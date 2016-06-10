var isNode = (typeof module !== 'undefined');

var circle_packing = function() {

	var sw = 600, sh = 600;

	var bmp = dom.canvas(sw, sh);

	var experiment = {
		stage: bmp.canvas,
		init: init,
		settings: {} // or null
	}

	function init() {
		bmp.ctx.clearRect(0, 0, sw, sh);

		var iterations = 0;
		function drawCircle(parent) {

			var x, y, r, depth, colour;
			if (parent){
				var angle = rand.random() * Math.PI * 2;
				var distance = rand.random() * parent.r; // distance from centre of parent
				x = parent.x + Math.sin(angle) * distance;
				y = parent.y + Math.cos(angle) * distance;
				r = rand.random() * (parent.r - distance);
				depth = parent.depth + 1;

				var ok = true;
				for (var i = 0, il = parent.children.length; i < il && ok; i++) {
					var dx = x - parent.x,
						dy = y - parent.y,
						d = Math.sqrt(dx * dx + dy * dy), // minimum required distance between centres
						dR = r + parent.r; // actual distance

					if (dR < d) {
						ok = false;
					}
				}
				if (ok === false) {
					con.log("red");
					colour = "red" ;
					// return;
				} else {
					colour = depth % 2 == 0 ? "#010" : "#040";
				}

			} else {
				x = 0.5;//rand.random();
				y = 0.5;//rand.random();
				r = rand.random() / 2;
				depth = 0;
			}

			bmp.ctx.beginPath();
			bmp.ctx.fillStyle = colour;
			bmp.ctx.drawCircle(x * sw, y * sh, r * sw);
			bmp.ctx.closePath();
			bmp.ctx.fill();

			// con.log("iterations", iterations, x, y, r, bmp.ctx.fillStyle, depth, depth % 2);

			iterations++;
			var circle = {
				depth: depth,
				x: x,
				y: y,
				r: r,
				children: []
			}

			if (parent && parent.children) parent.children.push(circle);

			if (iterations < 500) {
				var num = rand.random() * 6;
				for (var i = 0; i < num; i++) {
					drawCircle(circle);
				}
			}
		}

		drawCircle(0);

		progress("render:complete", bmp.canvas);
	}
	return experiment;

};

if (isNode) {
  module.exports = circle_packing();
} else {
  define("circle_packing", circle_packing);
}