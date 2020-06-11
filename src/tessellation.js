const isNode = typeof module !== "undefined";

if (isNode) {
	// var rand = require("./rand.js");
	// var dom = require("./dom.js");
	// var colours = require("./colours.js");
	// var geom = require("./geom.js");
}

const tessellation = () => () => {
	const r = rand.instance();
	const c = colours.instance(r);

	const bmp = dom.canvas(1, 1);
	const ctx = bmp.ctx;

	let progress;
	let sh;
	let sw;
	let size;

	var settings = {};

	const dots = [];

	const dotLine = ([a, b], {lineWidth, strokeStyle, fillStyle}) => {
		const dx = a.x - b.x;
		const dy = a.y - b.y;
		const jumps = Math.ceil(Math.hypot(dx, dy) / 0.0288);
		for (var i = 0; i < jumps; i++) {
			const {x, y} = geom.lerp(a, b, i / jumps);
			dots.push({x, y});
			ctx.fillStyle = fillStyle;
			ctx.fillRect(x * sw - 3, y * sh - 3, 6, 6);
		}
	};

	// copied from recursive_polygon
	const drawPolygon = (points, {lineWidth, strokeStyle, fillStyle}) => {
		if (!points || points.length < 2) {
			return;
		}
		const len = points.length;
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
		for (var i = 0; i < len; i++) {
			dotLine([points[i], points[(i + 1) % len]], {fillStyle: "#000"});
		}
	};

	const populated = [];
	const hashPolygon = () => {
		const startIndex = r.getInteger(0, dots.length);
		const otherIndex = r.getInteger(0, dots.length);

		let aIncrementing = startIndex;
		let aDecrementing = startIndex + 1;
		let bIncrementing = otherIndex;
		let bDecrementing = otherIndex + 1;
		let iterations = 0;
		const maxIterations = 200;
		while (populated.length < dots.length && iterations < maxIterations) {
			aIncrementing++;
			aDecrementing--;
			bIncrementing++;
			bDecrementing--;

			const pAInc = dots[(aIncrementing + dots.length) % dots.length];
			const pBDec = dots[(bDecrementing + dots.length) % dots.length];

			const pBInc = dots[(bIncrementing + dots.length) % dots.length];
			const pADec = dots[(aDecrementing + dots.length) % dots.length];

			ctx.fillStyle = "red";
			ctx.fillRect(pAInc.x * sw - 2, pAInc.y * sh - 2, 4, 4);

			ctx.beginPath();
			ctx.strokeStyle = "red";
			ctx.lineWidth = 3;
			ctx.moveTo(pAInc.x * sw, pAInc.y * sh);
			ctx.lineTo(pBDec.x * sw, pBDec.y * sh);
			ctx.stroke();

			ctx.fillStyle = "blue";
			ctx.fillRect(pBInc.x * sw - 2, pBInc.y * sh - 2, 4, 4);

			ctx.beginPath();
			ctx.strokeStyle = "blue";
			ctx.lineWidth = 3;
			ctx.moveTo(pBInc.x * sw, pBInc.y * sh);
			ctx.lineTo(pADec.x * sw, pADec.y * sh);
			ctx.stroke();

			populated.push("d");
			iterations++;
		}
		console.log("finished", dots, populated);
	};

	const init = (options) => {
		progress =
			options.progress ||
			(() => {
				// eslint-disable-next-line no-console
				console.log("tessellation - no progress defined");
			});
		r.setSeed(options.seed);
		size = options.size;
		sw = options.sw || size;
		sh = options.sh || size;
		c.getRandomPalette();
		bmp.setSize(sw, sh);

		progress("settings:initialised", settings);

		const backgroundColour = c.getRandomColour();
		ctx.fillStyle = backgroundColour;
		ctx.fillRect(0, 0, sw, sh);

		drawPolygon([{x: 0.2, y: 0.2}, {x: 0.8, y: 0.2}, {x: 0.8, y: 0.8}, {x: 0.5, y: 0.8}, {x: 0.5, y: 0.5}, {x: 0.2, y: 0.5}], {fillStyle: c.getNextColour()});

		hashPolygon();

		progress("render:complete", bmp.canvas);
		// ctx.restore();
	};

	const update = (settings, seed) => {
		// console.log("update", settings);
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
	module.exports = tessellation();
} else {
	define("tessellation", tessellation);
}
