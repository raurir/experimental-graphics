var isNode = (typeof module !== 'undefined');

var circle_packing = function() {

	var sw, sh;
	var cx = 0.5, cy = 0.5;

	var bmp = dom.canvas(1, 1);

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

	function init(options) {

		console.time("init");

		var size = options.size;
		sw = size;
		sh = size;
		bmp.setSize(sw, sh);
		// rand.setSeed(4);
		colours.getRandomPalette();
		bmp.ctx.clearRect(0, 0, sw, sh);

		var iterations = 0;
		var circles = 0, circlesLast = 0, circlesSame = 0;
		var threads = 0, threadsLast = 0, threadsSame = 0;
		var gap = 0.00;//5;//rand.getNumber(0.0001, 0.02);
		var minRadius = 0.002;//rand.getNumber(0.001, 0.01);
		var maxRadiusMod = 1;//0.05;//rand.getNumber(0.01, 0.1);
		var maxDepth = 2;//rand.getInteger(1, 10);

		con.log('maxDepth', maxDepth);

		var bailed = false;

		var progressChecker = () => {
			if (threadsLast === threads) {
				threadsSame++;
			} else {
				threadsSame = 0;
			}
			threadsLast = threads;

			if (circlesLast === circles) {
				circlesSame++;
			} else {
				circlesSame = 0;
			}
			circlesLast = circles;

			if (threadsSame > 10) {
				con.timeEnd("init");
				con.log("bailed threads!")
				bailed = true;
			}
			if (circlesSame > 300) {
				con.timeEnd("init");
				con.log("bailed circles!")
				bailed = true;
			}
			// setTimeout(progressChecker, 50);
		}
		// progressChecker();

		function attemptNextCircle(parent, attempt) {
			if (bailed) return;
			// threads++;
			attempt++;

			if (iterations % 5000 === 0) {
				progressChecker();
			}

			// parent.attempts++;
			// con.log("attemptNextCircle");
			output.innerHTML = [circles, threads, iterations];
			
			try {
				if (attempt < 1700 && parent.r > 0.005) {
					var delay = iterations % 50 ? 0 : 20;
					threads++;
					if (delay) {
						setTimeout(function() {
							attemptCircle(parent, attempt);
						}, delay);
					} else {
						attemptCircle(parent, attempt);
					}
				} else {
					// con.log("too many attempt");
				}
			} catch (err) {
				con.log("CALL STACK! err '" + attempt + "'");
			}
		}


		function attemptCircle(parent, attempt, options) {
			// con.log("attemptCircle")
			

			iterations++;

			// if (parent) {
			// 	if (parent.children.length > parent.childrenMax) {
			// 		threads--;
			// 		con.log("bailing too may children");
			// 		return parent;
			// 	}
			// 	// if (parent.attempts > 500000) {
			// 	// 	threads--;
			// 	// 	con.log("bailing too may attempts");
			// 	// 	return parent;
			// 	// }
			// }

			var x, y, r, dx, dy, d, depth, colour, angle, distance, other;
			if (parent) {
				angle = rand.random() * Math.PI * 2;
				// angle = iterations * Math.PI * 2;

				// distance from centre of parent
				// distance = rand.getInteger(1, 5) / 5 * parent.r + rand.random() * 0.03;

				distance = rand.random() * parent.r;
				// banding
				// distance = rand.getInteger(1, 5) / 5 * parent.r + rand.random() * 0.03;


				var angleIncrement = 0.01;

				// start filling in the rest by drawing circles in a sweeping fashion
				// var thresh = false;//true;//iterations > 5;
				var thresh = false;//parent.children.length > parent.childrenMax / 2;
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
				maxRadius = parent.r - distance - gap;// < parent.2 / 2
				// maxRadius = Math.pow(0.6 - d, 3) * 4;
				// maxRadius = (0.7 - d) * 0.2;
				// maxRadius = (d + 0.1) * 0.2;
				// maxRadius = 0.07;
				// maxRadius = (Math.sin((0.25 + d) * Math.PI * 2 * 2.5) + 1.5) / 80;
				// maxRadius = (Math.sin((d) * Math.PI * 2 * 2.5) + 1.3) / 70;
				if (maxRadius < minRadius) {
					// con.log("fail initial radius too small");
					threads--;
					return attemptNextCircle(parent, attempt);
				}


				// r = rand.random() * maxRadius * (parent.r - distance - gap);
				r = rand.random() * maxRadius * maxRadiusMod;
				// r = parent.r - distance - gap;
				// r = maxRadius;
				// r = 0.005;
				// r = 0.05;


				if (options) {
					if (options.r) { /* con.log("overriding r"); */ r = options.r; }
					if (options.x) { /* con.log("overriding x"); */ x = options.x; }
					if (options.y) { /* con.log("overriding y"); */ y = options.y; }
				}

				if (r - gap < minRadius) {
					// con.log("fail initial radius too small");
					threads--;
					return attemptNextCircle(parent, attempt);
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
						ok = false;
						r = d - other.r - gap;
						if (r < minRadius) {
							// con.log("less thatn 0.002")
							threads--;
							// attemptNextCircle(parent, attempt);

							return;
						}
					}
				}
				if (ok === false) {
					threads--;
					// con.log("fail can't find suitable radius")
					return attemptNextCircle(parent, attempt);
				} else {
					// colour = depth % 2 == 0 ? "rgba(0, 0, 255, 0.5)" : "rgba(0, 255, 0, 0.5)";
					colour = depth % 2 == 0 ? "black" : "white";
					// colour = colours.getNextColour();
				}

			} else {
				x = cx;//rand.random();
				y = cy;//rand.random();

				r = 0.5;//0.45;//rand.random() / 2;
				colour = "rgba(0, 0, 0, 0)";
				depth = 0;
			}


			if (options) {
				// con.log("options?")
				if (options.colour) { /* con.log("overriding colour", colour); */ colour = options.colour; }
			} else {
				// con.log("noptions?")
			}


			bmp.ctx.beginPath();
			bmp.ctx.fillStyle = colour;
			bmp.ctx.drawCircle(x * sw, y * sh, r * sw);
			bmp.ctx.closePath();
			bmp.ctx.fill();

			// con.log('drawOne', x, y, colour);

			// con.log("iterations", iterations, x, y, r, bmp.ctx.fillStyle, depth, depth % 2);

			var circle = {
				attempts: 0,
				depth: depth,
				x: x,
				y: y,
				r: r,
				children: [],
				// childrenMax: (5 + Math.ceil(Math.pow((r * 20), 2) * 100)) * 1,
				childrenMax: (1 + Math.pow(r, 2) * Math.PI * 400),
				incrementor: {
					angle: 0,
					distance: 0
				}
			}
			// con.log(r, circle.childrenMax);

			circles++;
			if (parent && parent.children) {
				parent.children.push(circle);
			}

			// if (iterations < 4) {//500) {
			if (depth < maxDepth) {
				// con.log("circle.childrenMax", circle.childrenMax)
				var num = circle.childrenMax * 50;//rand.random() * 6;
				for (var i = 0; i < num; i++) {
					// threads++;
					attemptNextCircle(circle, 0);
				}
				// attemptNextCircle(circle, 0);
			}

			// if (parent) {
			// 	attemptNextCircle(parent, attempt);
			// }
			threads--;

 		}

		var container = attemptCircle(null, 0, {colour: 'rgba(0,0,0,0.1)'});
		// window.container = container;
		// var inner = attemptCircle(parent, 0, {x: 0.5, y: 0.5, r: 0.3, colour: "rgba(0,0,0,0)"});
		// var inner2 = attemptCircle(inner, 0, {x: 0.5, y: 0.5, r: 0.1, colour: colours.getNextColour()});

		progress("render:complete", bmp.canvas);
	}
	return experiment;

};

if (isNode) {
	module.exports = circle_packing();
} else {
	define("circle_packing", circle_packing);
}