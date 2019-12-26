/*global voronoi*/
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

	let size;
	var dot = 1;
	var sizeX;
	var sizeY;
	var width;
	var height;
	var canvas = dom.canvas(1, 1);
	var {ctx} = canvas;

	var settings = {};

	function positionPoint(index, total) {
		var dim = Math.floor(Math.sqrt(total));
		var x = (index % dim) + 0.5;
		var y = Math.floor(index / dim) + 0.5;

		// console.log("positionPoint", dim, total);

		var blockX = width / dim / dot;
		var blockY = height / dim / dot;

		var centreX = width / 2 / dot;
		var centreY = height / 2 / dot;

		var radius = (index / total) * centreX;
		var angle = (index / total) * Math.PI * index * (0.5 + r.getNumber(0, 20));

		var methods = [
			[r.getNumber(0, sizeX), r.getNumber(0, sizeY)], // original random
			[centreX + (Math.sin(angle) * width) / 3, centreY + (Math.cos(angle) * height) / 3], // polar
			[centreX + Math.sin(angle) * radius, centreY + Math.cos(angle) * radius], // cluster near centre

			// 3 grid
			[(x - settings.pointBias / 2 + r.getNumber(0, settings.pointBias)) * blockX, (y - settings.pointBias / 2 + r.getNumber(0, settings.pointBias)) * blockY],
		];
		return methods[settings.pointMethod];
	}

	function renderRegion(region, bounds) {
		if (isNaN(bounds.x) || isNaN(bounds.y) || (isNaN(bounds.width) && isNaN(bounds.height))) {
			console.log("null renderRegion", bounds);
			return null;
		}
		const pattern = createPattern((bounds.width > bounds.height ? bounds.width : bounds.height) + 10);
		const regionCanvas = dom.canvas(width, height);
		regionCanvas.ctx.globalCompositeOperation = "source-over";
		regionCanvas.ctx.fillStyle = "red";
		for (var r = 0; r < region.length; r++) {
			var x = region[r][0];
			var y = region[r][1];
			regionCanvas.ctx.fillRect(x * dot, y * dot, dot, dot);
		}
		regionCanvas.ctx.globalCompositeOperation = "source-in";
		regionCanvas.ctx.drawImage(pattern, bounds.x - 5, bounds.y - 5);
		ctx.drawImage(regionCanvas.canvas, 0, 0);
	}

	function createPattern(size) {
		// console.log('dom.canvas, size', size);
		var half = size / 2;
		var canvas = dom.canvas(size, size);
		// document.body.appendChild(canvas.canvas);
		// canvas.canvas.style.border = '2px solid black'
		var ctx = canvas.ctx;
		// puts the canvas centre so the whole area has a pattern
		// ctx.save();
		ctx.translate(half, half);
		ctx.rotate(settings.baseRotation + r.getNumber(0, settings.varyRotation));
		ctx.translate(-half, -half);

		if (settings.varyDuotone) {
			c.setColourIndex(1);
			ctx.fillStyle = c.getCurrentColour();
		} else {
			ctx.fillStyle = c.getRandomColour();
		}

		var padding = Math.sqrt(half * half * 2) - half; // the gaps between the corner when rotated 45 degrees

		// draw bg. not good for shirts!!!
		// ctx.fillRect(-padding, -padding, size + padding * 2, size + padding * 2);

		if (settings.varyPerRegion) {
			settings.lineScale = 0.5 + r.getNumber(0, settings.overallScale);
			settings.lineSize = 1 + r.getNumber(0, 10) * settings.lineScale;
			settings.lineGap = 2 + r.getNumber(0, 3) * settings.lineScale;
		}

		var colour;
		if (settings.varyDuotone) {
			colour = c.getNextColour();
		}
		var y = -padding;
		while (y < size + padding) {
			if (settings.varyPerLine) {
				settings.lineSize = 1 + r.getNumber(0, 10) * settings.lineScale;
				settings.lineGap = 2 + r.getNumber(0, 3) * settings.lineScale;
			}
			if (!settings.varyDuotone) {
				colour = c.getRandomColour();
			}
			ctx.fillStyle = colour;
			ctx.fillRect(-padding, y, size + padding * 2, settings.lineSize);
			y += settings.lineSize + settings.lineGap;
		}

		// ctx.restore();

		return canvas.canvas;
	}

	function generate() {
		settings.baseRotation = Math.PI * 2;
		settings.lineGap = r.getNumber(1, 101);
		settings.lineSize = r.getNumber(1, 101);
		settings.overallScale = r.getNumber(50, 200);
		settings.lineScale = settings.overallScale;

		settings.pointBias = r.getNumber(0, 2);
		settings.pointMethod = r.getInteger(0, 4);
		// settings.varyDuotone = false;
		settings.varyDuotone = r.random() > 0.5;
		// settings.varyPerLine = false;
		settings.varyPerLine = r.random() > 0.5;
		// settings.varyPerRegion = false;
		settings.varyPerRegion = r.random() > 0.5;
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

		voronoi.init({dot, sites: settings.sites, sizeX, sizeY});

		// console.log("generate", current, total);

		voronoi.genPoints(positionPoint);
		voronoi.genMap();
		voronoi.drawRegions(renderRegion);
		// voronoi.drawRegionBounds();
		// voronoi.drawSites(canvas.ctx);
	}

	return {
		init: (options) => {
			size = options.size;
			sizeX = size;
			sizeY = size;
			width = sizeX;
			height = sizeY;
			r.setSeed(options.seed);
			c.getRandomPalette();
			canvas.setSize(sizeX, sizeY);
			generate(0);
		},
		settings,
		stage: canvas.canvas,
		update: () => {},
	};
};

// if (!isNode) generate(0);

// if (typeof module !== "undefined") module.exports = {generate: generate};

if (isNode) {
	module.exports = voronoi_stripes();
} else {
	define("voronoi_stripes", voronoi_stripes);
}
