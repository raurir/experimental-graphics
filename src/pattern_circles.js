var isNode = typeof module !== "undefined";

var pattern_circles = function () {
	var r, c;
	var size, sw, sh;
	var bmp = dom.canvas(1, 1);
	var ctx = bmp.ctx;
	var circles;
	var colourBG;
	var rotation;

	function init(options) {
		r = rand.instance();
		r.setSeed(options.seed);
		c = colours.instance(r);

		size = options.size;
		sw = size;
		sh = size;
		var cx = sw / 2;
		var cy = sh / 2;
		bmp.setSize(sw, sh);
		ctx.clearRect(0, 0, sw, sh);
		// ctx.fillStyle = "#0f0";
		ctx.fillRect(cx - 2, cy - 2, 4, 4);

		rotation = (Math.random() * Math.PI) / 2;
		var size = 10 + ~~(Math.random() * 50);
		var lines = 2 + ~~(Math.random() * 5);
		var widths = [];
		while (widths.length < lines) widths.push(Math.ceil(Math.random() * size));
		widths.push(size);

		var noDuplicates = [];
		widths.map(function (a, i) {
			if (widths.indexOf(a) == i) {
				noDuplicates.push(a);
			}
		});

		widths = noDuplicates.sort(function (a, b) {
			return a < b ? -1 : 1;
		});

		c.getRandomPalette();
		var palette = [];
		while (palette.length < widths.length) {
			palette.push(c.getRandomColour());
		}

		colourBG = c.getRandomColour();

		var patternSize = size + size * Math.random();

		circles = dom.canvas(patternSize, patternSize);
		// document.body.appendChild(circles.canvas);
		for (var i = widths.length - 1; i > -1; i--) {
			var radius = widths[i];
			var colour = palette[i];
			circles.ctx.beginPath();
			circles.ctx.fillStyle = colour;
			circles.ctx.drawCircle(size / 2, size / 2, radius / 2);
			circles.ctx.fill();
			circles.ctx.closePath();
			// con.log(i);
		}
		render();
	}

	function render() {
		// con.log("render");

		ctx.save();
		ctx.fillStyle = colourBG;
		ctx.rect(0, 0, sw, sh);
		ctx.fill();
		ctx.rotate(rotation);
		ctx.fillStyle = ctx.createPattern(circles.canvas, "repeat");
		ctx.fill();
		ctx.restore();

		progress("render:complete", bmp.canvas);
	}

	var experiment = {
		stage: bmp.canvas,
		init: init,
	};

	return experiment;
};

if (isNode) {
	module.exports = pattern_circles();
} else {
	define("pattern_circles", pattern_circles);
}
