var isNode = (typeof module !== 'undefined');

var circle_packing = function() {

	var sw = 600, sh = 600;

	var bmp = dom.canvas(sw, sh);

	var experiment = {
		stage: bmp.canvas,
		init: init,
		settings: {} // or null
	}


	function drawLine(p0, p1, colour, lineWidth) {
		bmp.ctx.strokeStyle = colour;
		bmp.ctx.lineWidth = lineWidth;
		bmp.ctx.beginPath();
		bmp.ctx.moveTo(p0.x, p0.y);
		bmp.ctx.lineTo(p1.x, p1.y);
		bmp.ctx.stroke();
	}

	function init() {
		bmp.ctx.clearRect(0, 0, sw, sh);

		var iterations = 0;
		var circles = 0;
		function drawCircle(parent, attempt) {

			var gap = 0.01;

			var x, y, r, depth, colour;
			if (parent){
				var angle = rand.random() * Math.PI * 2;
				var distance = rand.random() * parent.r; // distance from centre of parent
				x = parent.x + Math.sin(angle) * distance;
				y = parent.y + Math.cos(angle) * distance;
				r = rand.random() * (parent.r - distance - gap);
				// r = parent.r - distance - gap;

				if (r < 0.001) {
					if (attempt < 1000) {
						drawCircle(parent, attempt + 1);
					}
					return;
				}

				depth = parent.depth + 1;

				var ok = true;
				for (var i = 0, il = parent.children.length; i < il && ok; i++) {
					var other = parent.children[i]
					var dx = x - other.x,
						dy = y - other.y,
						d = Math.sqrt(dx * dx + dy * dy), // minimum required distance between centres
						dR = r + other.r + gap; // actual distance
						// con.log(parent.children, dR, d);

						// drawLine({x: other.x * sw, y: other.y * sw}, {x:x*sw, y:y*sw}, "red", 2);

					if (dR > d) {
						ok = false;
					}
				}
				if (ok === false) {
					// con.log("red");
					colour = "rgba(255, 0, 0, 0.5)";
					if (attempt < 1000) {
						drawCircle(parent, attempt + 1);
					}
					return;
				} else {
					// colour = depth % 2 == 0 ? "rgba(0, 0, 255, 0.5)" : "rgba(0, 255, 0, 0.5)";
					colour = depth % 2 == 0 ? "black" : "white";
				}

			} else {
				x = 0.5;//rand.random();
				y = 0.5;//rand.random();
				r = 0.5;//rand.random() / 2;
				colour = "transparent";
				depth = 0;
			}

			bmp.ctx.beginPath();
			bmp.ctx.fillStyle = colour;
			bmp.ctx.drawCircle(x * sw, y * sh, r * sw);
			bmp.ctx.closePath();
			bmp.ctx.fill();


			if (ok === false) {
				return;
			}


			// con.log("iterations", iterations, x, y, r, bmp.ctx.fillStyle, depth, depth % 2);

			iterations++;
			var circle = {
				depth: depth,
				x: x,
				y: y,
				r: r,
				children: []
			}

			circles++;
			if (parent && parent.children) parent.children.push(circle);

			// if (iterations < 4) {//500) {
			setTimeout(function () {
				if (depth < 2) {
					var num = 500;//rand.random() * 6;
					for (var i = 0; i < num; i++) {
						drawCircle(circle, 0);
					}
					// setTimeout(function () {
					// 	drawCircle(circle, 0);
					// }, 1);
				}
			}, 1);

			if (parent && attempt < 1500) {
				con.log("doing", attempt, circles);
				setTimeout(function () {
					drawCircle(parent, attempt + 1);
				}, 1);
			}


			return circle;
		}

		drawCircle(0, 0);

		progress("render:complete", bmp.canvas);
	}
	return experiment;

};

if (isNode) {
  module.exports = circle_packing();
} else {
  define("circle_packing", circle_packing);
}