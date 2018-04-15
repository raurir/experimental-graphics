// mogrify -format gif *.png
// gifsicle --delay=1 --loop *.gif > anim.gif

var isNode = (typeof module !== 'undefined');
var posJump;
if (isNode) {
	con = console;
	dom = require("./dom.js");
	geom = require("./geom.js");
	rand = require("./rand.js");
	Ease = require("../lib/robertpenner/ease.js");
	progress = () =>
	fs = require("fs");
	saveFile = (canvas, frame, cb) => {
		const filename = '/../export/' + (String(frame).length == 1 ? "0" : "") + frame + '.png';
		canvas.toBuffer((err, buf) => {
			if (err) {
				con.log("saveFile err", err);
			} else {
				fs.writeFile(__dirname + filename, buf, () => {
					con.log("saveFile success", typeof buf, __dirname + filename);
					cb();
				});
			}
		});
	}
	posJump = 0.02;
} else {
	posJump = 0.005;
}


var nested_rotating_polygon = function() {
	var TAU = Math.PI * 2;
	var bmp = dom.canvas(1,1);
	var ctx = bmp.ctx;
	var size, sides, depthMax;
	var pos = 0;
	var half = 0;
	var BLACK = "#000", WHITE = "#fff";
	var frame = 0;

	function init(options) {
		size = options.size;
		bmp.setSize(size, size);
		sides = 3;//rand.getInteger(3, 6);
		depthMax = 6;//rand.getInteger(3, 16);
		progress("render:complete", bmp.canvas);
		render();
	}
	function render() {
		frame ++;
		ctx.fillStyle = depthMax % 2 ? BLACK : WHITE;
		ctx.fillRect(0, 0, size, size);
		create({depth:0});
		pos += posJump
		if (pos >= 1) {
			pos = 0;
			half ++;
			half %= 2;
		}
		if (isNode){
			// save for animated gif.
			saveFile(bmp.canvas, frame, () => {
				if (frame < 1 / posJump * 2) {
					render();
				} else {
					con.log("stopping - frame:",frame, "pos:", pos);
				}
			})
		} else {
			requestAnimationFrame(render);
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
				points.push(p);
			}
		} else {
			// con.log("none")
			for(i = 0; i < sides; i++) {
				var angle = i / sides * TAU + TAU / 4;
				var xp = size / 2 + size / 2 * 0.98 * Math.cos(angle),
					yp = size / 2 + size / 2 * 0.98 * Math.sin(angle);
				points.push({x:xp, y:yp});
			}
		}

		ctx.fillStyle = depth % 2 ? BLACK : WHITE;
		ctx.strokeStyle = ctx.fillStyle;
		ctx.lineWidth = 2;
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
		if (depth === depthMax) ctx.stroke();
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
	module.exports = exp = nested_rotating_polygon();
	con.log(exp)
	exp.init({size: 700});
} else {
	define("nested_rotating_polygon", nested_rotating_polygon);
}