const isNode = typeof module !== "undefined";

if (isNode) {
	var con = console;
	var rand = require("./rand.js");
	var dom = require("./dom.js");
	var colours = require("./colours.js");
	var geom = require("./geom.js");
}

const getRotationRange = (sides) => {
	const angleInner = (180 * (sides - 2)) / sides;
	// range a square, rotationRange would be zero, so set to 45 instead
	const rotationRange = 90 - angleInner || 45;
	// multiple by 3 to get a decent chunk of variation
	return ((rotationRange * 3) / 180) * Math.PI;
};

const polygon_slice = () => () => {
	const r = rand.instance();
	const c = colours.instance(r);

	const TAU = Math.PI * 2;
	const bmp = dom.canvas(1, 1);
	const ctx = bmp.ctx;

	let backgroundColour;
	let progress;
	let border;
	let cutHalf;
	let maxDepth;
	let minArea;
	let radius;
	let sh;
	let size;
	let startAngle;
	let sw;

	var settings = {
		rotation: {
			type: "Number",
			label: "Rotation",
			min: 0,
			max: 9, // 0-9 allows one edge to be parallel with T,R,B,L when cur is: 0..3..6..9
			cur: 0,
		},
		maxDepth: {
			type: "Number",
			label: "Max Depth",
			min: 2,
			max: 8,
			cur: 2,
		},
		background: {
			type: "Boolean",
			label: "Background",
			cur: false,
		},
	};

	// been listening to GOTO80 for most of this: https://www.youtube.com/watch?v=2ZXlofdWtWw
	// followed by tranan + hux flux
	// next session: somfay

	// copied from recursive_polygon
	const drawPolygon = (points, {lineWidth, strokeStyle, fillStyle}) => {
		if (!points) {
			return; // con.warn("null array", points)
		}
		ctx.beginPath();
		// ctx.lineCap = "round";
		// ctx.lineJoin = "round";
		points.forEach((p, i) => {
			ctx[i == 0 ? "moveTo" : "lineTo"](p.x * sw, p.y * sh);
		});
		ctx.closePath();
		if (lineWidth && strokeStyle) {
			ctx.strokeStyle = strokeStyle;
			ctx.lineWidth = lineWidth * size;
			ctx.stroke();
		}
		if (fillStyle) {
			ctx.fillStyle = fillStyle;
			ctx.fill();
		}
	};

	const splitPolygon = (array) => {
		// pick two edges to slice into.
		// to do so we pick the corner of the start of the edge.
		const cornerAlpha = r.getInteger(0, array.length - 1);
		const cornerBeta = (cornerAlpha + r.getInteger(1, array.length - 1)) % array.length;

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
		const pointA = geom.lerp(pointA0, pointA1, cutHalf ? 0.5 : r.getNumber(0.1, 0.9));
		const pointB = geom.lerp(pointB0, pointB1, cutHalf ? 0.5 : r.getNumber(0.1, 0.9));

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
		const colourMode = r.getInteger(0, 8);
		let gradient;
		let width = 0;
		let height = 0;
		switch (colourMode) {
			// very rare stroke
			case 0:
				style.lineWidth = 0.001;
				style.strokeStyle = c.getRandomColour();
				break;
			// rare gradient
			case 1:
			case 2:
				// pick a gradient direction
				if (r.getInteger(0, 1) === 0) {
					width = radius * 2; // horizontal
				} else {
					height = radius * 2; // vertical
				}
				gradient = ctx.createLinearGradient(0.5 - radius, 0.5 - radius, width * sw, height * sh);
				gradient.addColorStop(0, c.getRandomColour());
				gradient.addColorStop(1, c.getRandomColour());
				style.fillStyle = gradient;
				break;
			// default to simple colour fill
			default:
				style.fillStyle = c.getRandomColour();
		}

		return style;
	};

	const drawAndSplit = (points, depth) => {
		// split the shape
		const polygons = splitPolygon(points);
		// recurse
		depth++;
		polygons.forEach((poly) => {
			if (
				depth < settings.maxDepth.cur && // always honour max recursions else we crash...
				(minArea === 0 || geom.polygonArea(poly) > minArea) // only honour minArea if not zero!
			) {
				drawAndSplit(poly, depth);
			} else {
				const polyInset = geom.insetPoints(poly, border);
				if (!polyInset) return;
				// then check if they are similar, if not it has been inverted due to excessive inset.
				if (!geom.polygonsSimilar(poly, polyInset)) return;
				// check if polygon is self intersecting, if so, discard it...
				// yup, this is O(n^2).
				if (geom.polygonSelfIntersecting(polyInset)) return;
				drawPolygon(polyInset, getStyle());
			}
		});
	};

	const init = (options) => {
		progress =
			options.progress ||
			(() => {
				con.log("polygon_slice - no progress defined");
			});
		r.setSeed(options.seed);
		size = options.size;
		sw = options.sw || size;
		sh = options.sh || size;
		c.getRandomPalette();
		bmp.setSize(sw, sh);

		border = -r.getNumber(0.002, 0.01);
		radius = r.getNumber(0.3, 0.5);
		cutHalf = r.getNumber(0, 1) > 0.2; // cutting in half is nice!
		minArea =
			r.getInteger(0, 1) === 0
				? 0 // either 0, which means ignore minArea altogether
				: r.getNumber(0.05, radius * 0.8); // or randomize it.
		maxDepth = r.getInteger(2, 8);

		settings.rotation.cur = r.getInteger(0, 9);
		settings.maxDepth.cur = maxDepth;
		settings.background.cur = r.getInteger(0, 4) > 3;
		if (options.settings) {
			settings = options.settings;
		}

		progress("settings:initialised", settings);

		const sides = r.getInteger(3, 7);
		startAngle = (settings.rotation.cur / settings.rotation.max) * getRotationRange(sides);

		const points = new Array(sides).fill().map((side, i) => {
			const a = (i / sides) * -TAU;
			const x = Math.sin(a) * radius;
			const y = Math.cos(a) * radius;
			return {x, y};
		});

		// perf.start('polygon')
		backgroundColour = c.getRandomColour();
		if (settings.background.cur) {
			ctx.fillStyle = backgroundColour;
			ctx.fillRect(0, 0, sw, sh);
		} else {
			ctx.clearRect(0, 0, sw, sh);
		}
		ctx.save();
		ctx.translate(sw * 0.5, sh * 0.5);
		ctx.rotate(startAngle);
		// draw a border around shape
		drawPolygon(points, {
			strokeStyle: c.getNextColour(),
			lineWidth: 0.001,
		});
		// inset the shape before recursion begins
		drawAndSplit(geom.insetPoints(points, border), 0);
		progress("render:complete", bmp.canvas);
		ctx.restore();
		// perf.end('polygon')
	};

	const update = (settings, seed) => {
		// con.log("update", settings);
		init({progress, seed, size, settings});
	};

	return {
		stage: bmp.canvas,
		init,
		settings,
		update,
	};
};
if (isNode) {
	module.exports = polygon_slice();
} else {
	define("polygon_slice", polygon_slice);
}
