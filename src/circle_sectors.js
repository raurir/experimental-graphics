var isNode = typeof module !== "undefined";

if (isNode) {
	// var con = console;
	// var rand = require("./r.js");
	// var dom = require("./dom.js");
	// var colours = require("./c.js");
}

var circle_sectors = function() {
	const r = rand.instance(undefined);
	const c = colours.instance(r);

	var TAU = Math.PI * 2;
	var QUADRANT = Math.PI / 2;
	var centre = 0.5;
	var bmp = dom.canvas(1, 1);
	var size;

	function init(options) {
		size = options.size;
		bmp.setSize(size, size);
		r.setSeed();
		c.getRandomPalette();

		var rings = r.getInteger(4, 24);
		var ringStart = r.getInteger(0, rings - 1);
		var sectorsStart = r.getInteger(2, 16);
		var sectorsPower = r.getInteger(2, 3);
		var padding = r.getNumber(0, 0.01);
		var sectorsMin = r.getNumber(0.02, 0.2);
		var dotty = r.getNumber(0, 1) > 0.8;
		var howDotty = r.getNumber(0.1, 0.8);

		var colourCycle = (function() {
			var mode = r.getInteger(0, 2);
			con.log("colourCycle - mode:", mode);
			// params for case 2 only.
			var ringLast = -1;
			// ringRegularCycle - true: it's like a rainbow, kind of like a looping gradient / false: any new colour
			var ringRegularCycle = r.getNumber(0, 1) > 0.6;
			switch (mode) {
				case 0: // random per block
					return function(ring, sector) {
						return c.getRandomColour();
					};
				case 1: // each ring has it's own arbitrary logic (param ring is not correlated with)
					return function(ring, sector) {
						return c.getNextColour(ring);
					};
				case 2: // make each ring have it's own colour
					return function(ring, sector) {
						if (ring != ringLast) {
							ringLast = ring;
							return c.getNextColour(ringRegularCycle || r.getInteger(0, 4));
						} else {
							return c.getCurrentColour();
						}
					};
			}
		})();

		bmp.ctx.lineWidth = padding * size;

		for (var i = ringStart; i < rings; i++) {
			if (dotty && r.getNumber(0, 1) > howDotty) continue; // not sure i like this.
			var ringRadiusInner = (i / rings) * centre;
			var ringRadiusOuter = ((i + 1) / rings) * centre;
			var perimeter = TAU * ringRadiusInner;
			var sectors = sectorsStart;
			while (perimeter / sectors > sectorsMin) {
				sectors *= sectorsPower;
			}
			for (var j = 0; j < sectors; j++) {
				if (dotty && r.getNumber(0, 1) > howDotty) continue;
				var angle0 = (j / sectors) * TAU;
				var angle1 = ((j + 1) / sectors) * TAU;
				var x0 = centre + Math.sin(angle0) * ringRadiusInner;
				var y0 = centre + Math.cos(angle0) * ringRadiusInner;
				var x1 = centre + Math.sin(angle0) * ringRadiusOuter;
				var y1 = centre + Math.cos(angle0) * ringRadiusOuter;
				var x2 = centre + Math.sin(angle1) * ringRadiusOuter;
				var y2 = centre + Math.cos(angle1) * ringRadiusOuter;
				var x3 = centre + Math.sin(angle1) * ringRadiusInner;
				var y3 = centre + Math.cos(angle1) * ringRadiusInner;

				function drawSector() {
					bmp.ctx.beginPath();
					bmp.ctx.moveTo(x0 * size, y0 * size);
					bmp.ctx.lineTo(x1 * size, y1 * size);
					bmp.ctx.arc(centre * size, centre * size, ringRadiusOuter * size, QUADRANT - angle0, QUADRANT - angle1, true); // anti clockwise
					// cursor now at x2, y2
					bmp.ctx.lineTo(x3 * size, y3 * size);
					bmp.ctx.arc(centre * size, centre * size, ringRadiusInner * size, QUADRANT - angle1, QUADRANT - angle0, false); // clockwise
					// cursor now at x0, y0
					bmp.ctx.closePath();
				}

				// draw sectors as standard colour blocks
				bmp.ctx.globalCompositeOperation = "source-over";
				bmp.ctx.fillStyle = colourCycle(i, j);
				drawSector();
				bmp.ctx.fill();

				// don't want radial lines to fan out, as in be a sector shape, instead a line of constant width
				// so use a stroke to erase part of the colour block
				bmp.ctx.globalCompositeOperation = "destination-out";
				drawSector();
				bmp.ctx.stroke();
			}
		}
	}
	return {
		stage: bmp.canvas,
		init: init,
	};
};

if (isNode) {
	module.exports = circle_sectors();
} else {
	define("circle_sectors", circle_sectors);
}
