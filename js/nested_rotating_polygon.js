var isNode = (typeof module !== 'undefined');

var nested_rotating_polygon = function() {
	var TAU = Math.PI * 2;
	var bmp = dom.canvas(1,1);
	var ctx = bmp.ctx;
	var size, sides, depthMax;
	var pos = 0;
	var half = 0;
	var BLACK = "#000", WHITE = "#fff";

	function init(options) {
		size = options.size;
		bmp.setSize(size, size);
		sides = rand.getInteger(3, 6);
		depthMax = rand.getInteger(3, 16);
		progress("render:complete", bmp.canvas);
		render();
	}

	function render() {
		if (pos < 2) requestAnimationFrame(render);
		ctx.fillStyle = depthMax % 2 ? BLACK : WHITE;
		ctx.fillRect(0, 0, size, size);
		create({depth:0});
		pos += 0.005;
		if (pos >= 1) {
			pos = 0;
			half ++;
			half %= 2;
		}
	}

	function create(parent) {
		var i;
		var depth = parent.depth + 1;
		var points = [];
		if (parent.points) {
			var progress = Ease.easeInOutQuart(pos, 0, 1, 1) + half;
			for(i = 0; i < sides; i++) {
				var point0 = parent.points[i];
				var point1 = parent.points[(i + 1) % sides];
				var p = geom.lerp(
					{x: point0.x, y: point0.y},
					{x: point1.x, y: point1.y},
					progress / 2
				);
				var xp = p.x,
					yp = p.y;
				// con.log(xp, yp)
				points.push({x:xp, y:yp});
			}
		} else {
			// con.log("none")
			for(i = 0; i < sides; i++) {
				var angle = i / sides * TAU;
				var xp = size / 2 + size / 2 * 0.8 * Math.cos(angle),
					yp = size / 2 + size / 2 * 0.8 * Math.sin(angle);
				points.push({x:xp, y:yp});
			}
		}

		ctx.fillStyle = depth % 2 ? BLACK : WHITE;
		ctx.strokeStyle = ctx.fillStyle;
		ctx.lineWidth = depth;
		ctx.beginPath();
		ctx.strokeStyle = "0"
		for(var i = 0; i < sides; i++) {
			var xp = points[i].x, yp = points[i].y;
			if (i == 0) {
				ctx.moveTo(xp, yp);
			} else {
				ctx.lineTo(xp, yp);
			}
		}
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
		if (depth < depthMax) {
			// con.log("ok");
			create({depth, points});
		}
	}

	var experiment = {
		stage: bmp.canvas,
		init: init
	}

	return experiment;

};

if (isNode) {
  module.exports = nested_rotating_polygon();
} else {
  define("nested_rotating_polygon", nested_rotating_polygon);
}