var isNode = (typeof module !== 'undefined');

var circle_packing = function() {

	var sw = 600, sh = 600;

	var bmp = dom.canvas(sw, sh);

	var cx = sw / 2;
	var cy = sh / 2;

	var experiment = {
		stage: bmp.canvas,
		inner: null,
		resize: function() {},
		init: function() {},
		kill: function() {},
		settings: {} // or null
	}
	bmp.ctx.clearRect(0, 0, sw, sh);

	var iterations = 0;
	function drawCircle(parent) {
		var x = rand.random();
		var y = rand.random();
		var r = rand.random();
		bmp.ctx.beginPath();
		bmp.ctx.fillStyle = parent.depth % 2 ? "#010" : "#040";
		bmp.ctx.drawCircle(x * sw, y * sh, r * 20);
		bmp.ctx.closePath();
		bmp.ctx.fill();
		iterations++;
		var circle = {
			depth: parent.depth + 1,
			x: x,
			y: y,
			r: r
		}
		if (iterations < 20) {
			var num = rand.random() * 3;
			for (var i = 0; i < num; i++) {
				drawCircle(circle);
			}
		}
	}

	drawCircle(0);

	progress("render:complete", bmp.canvas);

	return experiment;

};

if (isNode) {
  module.exports = circle_packing();
} else {
  define("circle_packing", circle_packing);
}