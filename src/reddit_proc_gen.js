const isNode = typeof module !== "undefined";

const reddit_proc_gen = function() {
	const TAU = Math.PI * 2;
	const stage = dom.canvas(1, 1);
	const ctx = stage.ctx;
	let maxDepth;
	let minArea;
	let border;
	let radius;
	let size;
	let sw, sh, cx, cy;
	let cutHalf;

	// been listening to GOTO80 for most of this: https://www.youtube.com/watch?v=2ZXlofdWtWw
	// followed by tranan + hux flux
	// next session: somfay

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

		// an edge is between point{K}0 - point{K}1
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

		// min and max are confusing, but one poly starts from 0 which is arrayMin.
		const arrayMin = [];
		const arrayMax = [];

		// add first polygon - start from the first point of the parent
		var i = 0;
		// and navigate around the parent's perimeter
		while (i < array.length) {
			if (i <= cornerMin) {
				arrayMin.push(array[i]);
				//  until we hit the slice point
			} else if (i > cornerMin && i <= cornerMax) {
				// then add points of both ends of the slice
				arrayMin.push(pointA, pointB);
				// jump around to after the other end of the slice...
				i = cornerMax;
			} else {
				// and add the remaining points
				arrayMin.push(array[i]);
			}
			i++;
		}
		// add 2nd polygon, a bit easier...
		// start at point after the slice.
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
					width = radius * 2; // horizontal
				} else {
					height = radius * 2; // vertical
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

	let c = 0;
	const drawAndSplit = (points, depth) => {
		// split the shape
		const polygons = splitPolygon(points);

		// recurse
		depth++;
		polygons.forEach(poly => {
			if (
				depth < maxDepth && // always honour max recursions else we crash...
				(minArea === 0 || geom.polygonArea(poly) > minArea) // only honour minArea if not zero!
			) {
				drawAndSplit(poly, depth);
			} else {
				const polyInset = geom.insetPoints(poly, border);

				if (!polyInset) return;

				// check if polygon is self intersecting, if so, discard it...
				// yup, this is O(n^2).

				const len = polyInset.length;
				for (var j = 0; j < len - 1; j++) {
					const indexA = j;
					const indexB = j + 1;
					const pointA = polyInset[indexA];
					const pointB = polyInset[indexB];

					// ctx.beginPath();
					// ctx.strokeStyle = "red";
					// ctx.lineWidth = 4;
					// ctx.moveTo(pointA.x, pointA.y);
					// ctx.lineTo(pointB.x, pointB.y);
					// ctx.stroke();

					for (var i = indexB; i < len; i++) {
						c++;
						const indexC = i;
						const indexD = (i + 1) % len;
						const pointC = polyInset[indexC];
						const pointD = polyInset[indexD];
						const intersects = geom.intersectionBetweenPoints(
							pointA,
							pointB,
							pointC,
							pointD
						);
						if (intersects) {
							con.log("fail?");
							return;
						} else {
							// con.log("ok");
							// ctx.beginPath();
							// ctx.strokeStyle = "#0f0";
							// ctx.lineWidth = 8;
							// ctx.moveTo(pointC.x, pointC.y);
							// ctx.lineTo(pointD.x, pointD.y);
							// ctx.stroke();
							// con.log("intersects", intersects, pointA,pointB, pointC, pointD)
						}
					}
				}

				drawPolygon(polyInset, getStyle());
			}
		});
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

		const maxSize = size * size * 0.4;
		minArea =
			rand.getInteger(0, 1) === 0
				? 0 // either 0, which means ignore minArea altogether
				: rand.getInteger(maxSize * 0.05, maxSize); // or randomize it.
		maxDepth = rand.getInteger(2, 8);

		// minArea = 0;
		// maxDepth = 8;
		con.log(minArea, maxDepth);

		border = -rand.getInteger(2, 8);
		radius = size * rand.getNumber(0.3, 0.5);
		cutHalf = rand.getNumber(0, 1) > 0.2; // cutting in half is nice!

		const points = [];
		const sides = rand.getInteger(3, 7);
		const startAngle = rand.getNumber(0, 1);
		// const startAngle = 1 / 12 * TAU;
		for (var i = 0; i < sides; i++) {
			const a = startAngle + (i / sides) * -TAU;
			const x = cx + Math.sin(a) * radius; // * 0.6,
			const y = cy + Math.cos(a) * radius;
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
		console.log("calculations", c);
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
