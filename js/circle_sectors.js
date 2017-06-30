var isNode = (typeof module !== 'undefined');

if (isNode) {
	var con = console;
	var rand = require('./rand.js');
	var dom = require('./dom.js');
	var colours = require('./colours.js');
}


var circle_sectors = function() {

	var TAU = Math.PI * 2;
	var QUADRANT = Math.PI / 2;
	var centre = 0.5;
	var bmp = dom.canvas(1, 1);
	var size;
	
	function init(options) {
		size = options.size;
		bmp.setSize(size, size);

		colours.getRandomPalette();

		var rings = rand.getInteger(4, 24);
		var ringStart = rand.getInteger(0, rings - 1);
		var sectorsStart = rand.getInteger(2, 16);
		var sectorsPower = rand.getInteger(2, 3);
		var padding = rand.getNumber(0, 0.01);
		var sectorsMin = rand.getNumber(0.02, 0.2);
		var dotty = rand.getNumber(0, 1) > 0.8;
		var howDotty = rand.getNumber(0.1, 0.8);

		var colourCycle = function() {
			var mode = rand.getInteger(0, 2);
			con.log("colourCycle - mode:", mode);
			// params for case 2 only.
			var ringLast = -1;
			// ringRegularCycle - true: it's like a rainbow, kind of like a looping gradient / false: any new colour
			var ringRegularCycle = rand.getNumber(0, 1) > 0.6;
			switch(mode) {
				case 0 : // random per block
					return function(ring, sector) { return colours.getRandomColour(); };
				case 1 : // each ring has it's own arbitrary logic (param ring is not correlated with)
					return function(ring, sector) { return colours.getNextColour(ring); };
				case 2 : // make each ring have it's own colour
					return function(ring, sector) {
						if (ring != ringLast) {
							ringLast = ring;
							return colours.getNextColour(ringRegularCycle || rand.getInteger(0, 4));
						} else {
							return colours.getCurrentColour();
						}
						
					};
			}
		}();

		bmp.ctx.lineWidth = padding * size;

		for (var i = ringStart; i < rings; i++) {
			if (dotty && rand.getNumber(0, 1) > howDotty) continue; // not sure i like this.
			var ringRadiusInner = i / rings * centre;
			var ringRadiusOuter = (i + 1) / rings * centre;
			var perimeter = TAU * ringRadiusInner;
			var sectors = sectorsStart;
			while(perimeter / sectors > sectorsMin) {
				sectors *= sectorsPower;
			}
			for (var j = 0; j < sectors; j++) {
				if (dotty && rand.getNumber(0, 1) > howDotty) continue;
				var angle0 = j / sectors * TAU;
				var angle1 = (j + 1) / sectors * TAU;
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
		init: init
	}

};

if (isNode) {
	module.exports = circle_sectors();
} else {
	define("circle_sectors", circle_sectors);
}