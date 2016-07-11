var isNode = (typeof module !== 'undefined');

var circle_packing = function() {

	var sw = 1200, sh = 1200;
	var cx = 0.5, cy = 0.5;

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

	var output = dom.element("div");
	document.body.appendChild(output);

	function init() {

		rand.setSeed(4);
		colours.getRandomPalette();
		bmp.ctx.clearRect(0, 0, sw, sh);

		var iterations = 0;
		var circles = 0;
		var threads = 0;

		function attemptNextCircle(parent, attempt) {
			attempt++;
			// con.log("attemptNextCircle", attempt);
			output.innerHTML = [circles, attempt, threads, iterations];
			if (attempt < 125000 && parent.r > 0.1) {
				setTimeout(function() {
					drawCircle(parent, attempt);
				}, 1);
			}
		}


		function drawCircle(parent, attempt, options) {

			threads++;
			iterations++;

			var gap = 0.01;

			var x, y, r, dx, dy, d, depth, colour, angle, distance, other;
			if (parent) {
				angle = rand.random() * Math.PI * 2;
				// angle = iterations * Math.PI * 2;

				// distance from centre of parent

				distance = rand.getInteger(1, 5) / 5 * parent.r + rand.random() * 0.03;

				distance = rand.random() * parent.r;
				// banding
				// distance = rand.getInteger(1, 5) / 5 * parent.r + rand.random() * 0.03;

				var thresh = iterations > 5;

				var angleIncrement = 0.01;

				if (thresh) {
					// con.log("ok");
					parent.incrementor.distance += rand.random() * 0.04;
					if (parent.incrementor.distance > parent.r) {
						parent.incrementor.distance = 0;
						parent.incrementor.angle += angleIncrement;
					}
					distance = parent.incrementor.distance;
					angle = parent.incrementor.angle + rand.getInteger(-angleIncrement, angleIncrement);
				}



				x = parent.x + Math.sin(angle) * distance;
				y = parent.y + Math.cos(angle) * distance;

				if (thresh) {
					// drawLine({x: parent.x * sw, y: parent.y * sw}, {x: x * sw, y: y * sw}, "red", 2);
				}

				dx = x - cx;
				dy = y - cy;
				d = Math.sqrt(dx * dx + dy * dy);
				// maxRadius = Math.pow(0.6 - d, 3) * 4;
				maxRadius = (0.7 - d) * 0.2;
				// maxRadius = (d + 0.1) * 0.2;
				// maxRadius = 0.07;
				// maxRadius = (Math.sin((0.25 + d) * Math.PI * 2 * 2.5) + 1.5) / 80;
				// maxRadius = (Math.sin((d) * Math.PI * 2 * 2.5) + 1.3) / 70;
				if (maxRadius > 1 ) con.log(maxRadius);

				// r = rand.random() * maxRadius * (parent.r - distance - gap);
				r = rand.random() * maxRadius * (parent.r - distance - gap);
				// r = parent.r - distance - gap;
				// r = maxRadius;
				// r = 0.005;// rand.random() * maxRadius * (parent.r - distance - gap);

				if (options) {
					if (options.r) { con.log("overriding r"); r = options.r; }
					if (options.x) { con.log("overriding x"); x = options.x; }
					if (options.y) { con.log("overriding y"); y = options.y; }
				}

				if (r < 0.004) {
					threads--;
					attemptNextCircle(parent, attempt);
					return;
				}

				depth = parent.depth + 1;

				var ok = true;
				for (var i = 0, il = parent.children.length; i < il && ok; i++) {
					other = parent.children[i];
					dx = x - other.x;
					dy = y - other.y;
					d = Math.sqrt(dx * dx + dy * dy); // minimum required distance between centres
					var dR = r + other.r + gap; // actual distance
						// drawLine({x: other.x * sw, y: other.y * sw}, {x:x*sw, y:y*sw}, "red", 2);
					if (dR > d) {
						// ok = false;
						r = d - other.r - gap;
						if (r < 0.002) {
							threads--;
							attemptNextCircle(parent, attempt);
							return;
						}
					}
				}
				if (ok === false) {
					threads--;
					attemptNextCircle(parent, attempt);
					return;
				} else {
					// colour = depth % 2 == 0 ? "rgba(0, 0, 255, 0.5)" : "rgba(0, 255, 0, 0.5)";
					// colour = depth % 2 == 0 ? "black" : "white";
					colour = colours.getNextColour();
				}

			} else {
				x = cx;//rand.random();
				y = cy;//rand.random();

				r = 0.45;//rand.random() / 2;
				colour = "rgba(0, 0, 0, 0)";
				depth = 0;
			}


			if (options) {
				if (options.colour) { con.log("overriding colour", colour); colour = options.colour; }
			}


			bmp.ctx.beginPath();
			bmp.ctx.fillStyle = colour;
			bmp.ctx.drawCircle(x * sw, y * sh, r * sw);
			bmp.ctx.closePath();
			bmp.ctx.fill();

			// con.log('drawOne', x, y, colour);

			// con.log("iterations", iterations, x, y, r, bmp.ctx.fillStyle, depth, depth % 2);

			var circle = {
				depth: depth,
				x: x,
				y: y,
				r: r,
				children: [],
				incrementor: {
					angle: 0,
					distance: 0
				}
			}

			circles++;
			if (parent && parent.children) {
				parent.children.push(circle);
			}

			// if (iterations < 4) {//500) {
			if (depth < 2) {
				var num = 100;//500;//rand.random() * 6;
				for (var i = 0; i < num; i++) {
					attemptNextCircle(circle, 0);
				}
			}


			if (parent) {
				attemptNextCircle(parent, attempt);
			}
			threads--;
			return circle;
		}

		var parent = drawCircle(0, 0);
		var inner = drawCircle(parent, 0, {x: 0.5, y: 0.5, r: 0.3, colour: "rgba(0,0,0,0)"});
		var inner2 = drawCircle(inner, 0, {x: 0.5, y: 0.5, r: 0.1, colour: colours.getNextColour()});

		progress("render:complete", bmp.canvas);
	}
	return experiment;

};

if (isNode) {
  module.exports = circle_packing();
} else {
  define("circle_packing", circle_packing);
}