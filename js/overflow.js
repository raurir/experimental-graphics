var isNode = (typeof module !== 'undefined');

var overflow = function() {
	var TAU = Math.PI * 2;
	var sw, sw, cx, cy;
	var stage = dom.canvas(1, 1);
	var ctx = stage.ctx;

	var polys = [];
 	function init(options) {
		size = options.size;
		sw = options.sw || size;
		sh = options.sh || size;
		stage.setSize(sw, sh);

		colours.getRandomPalette();

		createPolygon();
		createPolygon();
		polys.forEach((poly) => {
			ctx.strokeStyle = poly.colour
			ctx.beginPath();
			poly.points.forEach(({x, y}, i) => {
				var xs = x * sw, ys = y * sh;
				if (i) {
					ctx.lineTo(xs, ys);
				} else {
					ctx.moveTo(xs, ys);
				}
				con.log(xs, ys)
			});
			ctx.closePath();
			ctx.stroke();
			// ctx.fill();
		});
	}

	function createPolygon() {
		var poly = {
			colour: colours.getRandomColour(),
			points: []
		};
		// geom.pointInPolygon(polygon, point)
		var sides = rand.getInteger(3, 17);
		var radius = rand.getNumber(0.1, 0.4);
		var cx = rand.getNumber(0, 1);
		var cy = rand.getNumber(0, 1);
		for (var i = 0; i < sides; i++) {
			var angle = i / sides * TAU;
			var x = cx + Math.sin(angle) * radius;
			var y = cy + Math.cos(angle) * radius;
			poly.points.push({x, y});
		}
		polys.push(poly);
	}


	var experiment = {
		stage: stage.canvas,
		init: init,
	}

	progress("render:complete", stage.canvas);

	return experiment;

};
if (isNode) {
  module.exports = overflow();
} else {
  define("overflow", overflow);
}