const isNode = typeof module !== "undefined";

const reddit_proc_gen = function() {
	const TAU = Math.PI * 2;
	const stage = dom.canvas(1, 1);
	const ctx = stage.ctx;
	let maxDepth;
	let border;
	let radius;
	let size;
	let sw, sh, cx, cy;
	let cutHalf;

	// been listening to GOTO80 for most of this: https://www.youtube.com/watch?v=2ZXlofdWtWw
	// and finishing up with tranan + hux flux

	// copied from recursive_polygon
	const drawPolygon = (points, { lineWidth, strokeStyle, fillStyle }) => {
		if (!points) {
			return; // con.warn("null array", points)
		}
		ctx.beginPath();
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		points.forEach((p, i) => {
			ctx[i == 0 ? "moveTo" : "lineTo"](p.x, p.y);
		});
		ctx.closePath();
		if (lineWidth && strokeStyle) {
			ctx.strokeStyle = strokeStyle;
			ctx.lineWidth = lineWidth;
			ctx.stroke();
		}
		if (fillStyle) {
			ctx.fillStyle = fillStyle;
			ctx.fill();
		}
	};

	const splitPolygon = array => {
		// pick two edges to slice into.
		// to do so we pick the corner of the start of the edge.
		const cornerAlpha = rand.getInteger(0, array.length - 1);
		const cornerBeta =
			(cornerAlpha + rand.getInteger(1, array.length - 1)) % array.length;

		const cornerMin = Math.min(cornerAlpha, cornerBeta);
		const cornerMax = Math.max(cornerAlpha, cornerBeta);

		// a edge is between point{K}0 - point{K}1
		const pointA0 = array[cornerMin];
		const pointA1 = array[(cornerMin + 1) % array.length];
		const pointB0 = array[cornerMax];
		const pointB1 = array[(cornerMax + 1) % array.length];

		// pick actual slice points somewhere along each edge
		// it is quite pleasant to slice the polygon half way along an edge
		// so going to bias towards that with `cutHalf`
		const pointA = geom.lerp(
			pointA0,
			pointA1,
			cutHalf ? 0.5 : rand.getNumber(0.1, 0.9)
		);
		const pointB = geom.lerp(
			pointB0,
			pointB1,
			cutHalf ? 0.5 : rand.getNumber(0.1, 0.9)
		);

		const arrayMin = [];
		const arrayMax = [];

		// add first polygon
		var i = 0;
		while (i < array.length) {
			if (i <= cornerMin) {
				arrayMin.push(array[i]);
			} else if (i > cornerMin && i <= cornerMax) {
				arrayMin.push(pointA, pointB);
				i = cornerMax; // jump around other polygon
			} else {
				arrayMin.push(array[i]);
			}
			i++;
		}
		// add other polygon
		i = cornerMin + 1;
		arrayMax.push(pointB, pointA);
		while (i < cornerMax + 1) {
			arrayMax.push(array[i]);
			i++;
		}

		return [arrayMin, arrayMax];
	};

	const getStyle = () => {
		const style = {};
		const colourMode = rand.getInteger(0, 8);
		switch (colourMode) {
			// very rare stroke
			case 0:
				style.lineWidth = 1;
				style.strokeStyle = colours.getRandomColour();
				break;
			// rare gradient
			case 1:
			case 2:
				let width = 0,
					height = 0;
				// pick a gradient direction
				if (rand.getInteger(0, 1) === 0) {
					width = radius * 2;
				} else {
					height = radius * 2;
				}
				const gradient = ctx.createLinearGradient(
					sw / 2 - radius,
					sh / 2 - radius,
					width,
					height
				);
				gradient.addColorStop(0, colours.getRandomColour());
				gradient.addColorStop(1, colours.getRandomColour());
				style.fillStyle = gradient;
				break;
			// default to simple colour fill
			default:
				style.fillStyle = colours.getRandomColour();
		}

		return style;
	};

	const drawAndSplit = (points, depth) => {
		// split the shape
		const [polyAlpha, polyBeta] = splitPolygon(points);

		// only render on last recursion
		if (depth === maxDepth - 1) {
			drawPolygon(geom.insetPoints(polyAlpha, border), getStyle());
			drawPolygon(geom.insetPoints(polyBeta, border), getStyle());
		}

		// recurse
		depth++;
		if (depth < maxDepth) {
			drawAndSplit(polyAlpha, depth);
			drawAndSplit(polyBeta, depth);
		}
	};

	const init = options => {
		size = options.size;
		sw = options.sw || size;
		sh = options.sh || size;
		colours.getRandomPalette();
		stage.setSize(sw, sh);
		cx = sw / 2;
		cy = sh / 2;
		ctx.clearRect(0, 0, sw, sh);

		maxDepth = rand.getInteger(2, 4);
		border = -rand.getInteger(2, 8);
		radius = sh * rand.getNumber(0.3, 0.5);
		cutHalf = rand.getNumber(0, 1) > 0.2; // cutting in half is nice!

		const points = [];
		const sides = rand.getInteger(3, 7);
		const startAngle = rand.getNumber(0, 1);
		for (var i = 0; i < sides; i++) {
			const a = startAngle + (i / sides) * -TAU,
				x = cx + Math.sin(a) * radius,
				y = cy + Math.cos(a) * radius;
			points.push({ x, y });
		}

		// draw a border around shape
		drawPolygon(points, {
			strokeStyle: colours.getRandomColour(),
			lineWidth: 1
		});
		// inset the shape before recursion begins
		drawAndSplit(geom.insetPoints(points, border), 0);
		progress("render:complete", stage.canvas);
	};

	return {
		stage: stage.canvas,
		init
	};
};
if (isNode) {
	module.exports = reddit_proc_gen();
} else {
	define("reddit_proc_gen", reddit_proc_gen);
}
