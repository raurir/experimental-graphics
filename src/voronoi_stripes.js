/*global voronoi, fillDither, fillStripes*/
var isNode = typeof module !== "undefined";
if (isNode) {
	var colours = require("./colours.js");
	var dom = require("./dom.js");
	// var geom = require("./geom.js");
	var rand = require("./rand.js");
}

const voronoi_stripes = () => () => {
	const r = rand.instance();
	const c = colours.instance(r);

	const dot = 1;
	const stage = dom.canvas(1, 1);
	const {canvas, ctx} = stage;
	const settings = {};

	let size;
	let sizeX;
	let sizeY;

	function positionPoint(index, total) {
		const dim = Math.floor(Math.sqrt(total));
		const x = (index % dim) + 0.5;
		const y = Math.floor(index / dim) + 0.5;

		const blockX = sizeX / dim / dot;
		const blockY = sizeY / dim / dot;

		const centreX = sizeX / 2 / dot;
		const centreY = sizeY / 2 / dot;

		const radius = (index / total) * centreX;
		const angle = (index / total) * Math.PI * index * (0.5 + r.getNumber(0, 20));

		const methods = [
			[r.getNumber(0, sizeX), r.getNumber(0, sizeY)], // original random
			[centreX + (Math.sin(angle) * sizeX) / 3, centreY + (Math.cos(angle) * sizeY) / 3], // polar
			[centreX + Math.sin(angle) * radius, centreY + Math.cos(angle) * radius], // cluster near centre

			// 3 grid
			[(x - settings.pointBias / 2 + r.getNumber(0, settings.pointBias)) * blockX, (y - settings.pointBias / 2 + r.getNumber(0, settings.pointBias)) * blockY],
		];
		return methods[settings.pointMethod];
	}

	function renderRegion(region, bounds) {
		const buffer = 10;
		const {x, y, width, height} = bounds;
		if (isNaN(x) || isNaN(y) || (isNaN(width) && isNaN(height))) {
			// eslint-disable-next-line
			console.log("null renderRegion", bounds);
			return null;
		}
		const size = (width > height ? width : height) + buffer;
		// const pattern = fillStripes({c, r, size, settings});
		const pattern = fillDither({c, r, size, settings});
		const regionCanvas = dom.canvas(width + buffer, height + buffer);
		const imageData = regionCanvas.ctx.getImageData(0, 0, width + buffer, height + buffer);
		region.forEach(([rx, ry]) => {
			const ox = rx - x;
			const oy = ry - y;
			const xp = (oy * (width + buffer) + ox) * 4;
			imageData.data[xp] = 255;
			imageData.data[xp + 1] = 255;
			imageData.data[xp + 3] = 255;
		});
		// document.body.appendChild(regionCanvas.canvas);
		regionCanvas.ctx.putImageData(imageData, 0, 0);
		regionCanvas.ctx.globalCompositeOperation = "source-in";
		regionCanvas.ctx.drawImage(pattern, 0, 0);
		ctx.drawImage(regionCanvas.canvas, x, y);
	}

	function generate() {
		settings.baseRotation = Math.PI * 2;
		settings.lineGap = r.getNumber(1, 101);
		settings.lineSize = r.getNumber(1, 101);
		settings.overallScale = r.getNumber(50, 200);
		settings.lineScale = settings.overallScale;

		settings.pointBias = r.getNumber(0, 2);
		// settings.pointMethod = r.getInteger(0, 4);
		settings.pointMethod = 0;
		settings.varyDuotone = false;
		// settings.varyDuotone = r.random() > 0.5;
		settings.varyPerLine = false;
		// settings.varyPerLine = r.random() > 0.5;
		settings.varyPerRegion = false;
		// settings.varyPerRegion = r.random() > 0.5;
		settings.varyRotation = Math.PI * (r.random() > 0.5 ? 2 : 0.2);

		if (settings.varyDuotone) c.setRandomPalette(0); // this sets black and white (or greys really.)
		// c.setRandomPalette(41); // this sets black and white (or greys really.)
		// c.setRandomPalette();

		settings.sites = 16 + r.getNumber(0, 20);
		// settings.sites = 1 + r.getNumber(0, 80);

		/*
		var txt = [
			"sites",
			"overallScale",
			"pointMethod",
			"pointBias",
			"baseRotation",
			"varyRotation",
			"varyDuotone",
			"varyPerRegion",
			"varyPerLine",
			"lineScale",
			"lineSize",
			"lineGap",
		]
			.map(function(v) {
				return v + ":" + settings[v];
			})
			.join("\n");
		*/

		voronoi.init({dot, sites: settings.sites, sizeX, sizeY, debug: false});
		voronoi.genPoints(positionPoint);
		voronoi.genMap();
		voronoi.drawRegions(renderRegion);
		// voronoi.drawRegionBounds(ctx);
		// voronoi.drawSites(ctx);
	}

	return {
		init: (options) => {
			size = options.size;
			sizeX = size;
			sizeY = size;
			r.setSeed(options.seed);
			c.getRandomPalette();
			stage.setSize(sizeX, sizeY);
			generate(0);
		},
		settings,
		stage: canvas,
		update: () => {},
	};
};

if (isNode) {
	module.exports = voronoi_stripes();
} else {
	define("voronoi_stripes", voronoi_stripes);
}
