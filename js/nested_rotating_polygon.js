var isNode = (typeof module !== 'undefined');

var nested_rotating_polygon = function() {

	var bmp = dom.canvas(1,1);
	var ctx = bmp.ctx;
	var size;
	var sides = 3;
	var depthMax = 4;

	function init(options) {
		size = options.size;
		bmp.setSize(size, size);

	}

	var pos = 0;
	function render() {
		requestAnimationFrame(render);
		ctx.clearRect(0, 0, size, size);
		create({depth:0});
		pos++;
	}
	render();

	function create(parent) {
		var depth = parent.depth + 1;
		var points = [];
		geom.lerp;
		if (parent.points) {
			// con.log("par")
			for(var i = 0; i < sides; i++) {
				var point0 = parent.points[i];
				var point1 = parent.points[(i + 1) % sides];
				var p = geom.lerp(
					{x: point0.x, y: point0.y},
					{x: point1.x, y: point1.y},
					pos * 0.001
				);
				var xp = p.x,
					yp = p.y;
				// con.log(xp, yp)
				points.push({x:xp, y:yp});
			}
		} else {
			// con.log("none")
			for(var i = 0; i < sides; i++) {
				var angle = i / sides * Math.PI * 2 ;
				var xp = size / 2 + size / 2 * 0.8 * Math.cos(angle),
					yp = size / 2 + size / 2 * 0.8 * Math.sin(angle);
				points.push({x:xp, y:yp});
			}
		}

		ctx.beginPath();
		ctx.lineWidth = 2;
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
		if (depth < depthMax) {
			// con.log("ok");
			create({depth, points});
		}
		progress("render:complete", bmp.canvas);
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