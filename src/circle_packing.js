var isNode = typeof module !== "undefined";

if (isNode) {
	var con = console;
	var rand = require("./rand.js");
	var dom = require("./dom.js");
	var colours = require("./colours.js");
}

var circle_packing = () => () => {
	var rnd = rand.instance();
	var c = colours.instance(rnd);
	var progress;
	var TAU = Math.PI * 2;
	var sw, sh;
	var cx = 0.5,
		cy = 0.5;
	var bmp = dom.canvas(1, 1);

	function error(site, depth, err) {
		return;
		bmp.ctx.fillStyle = err || "green";
		var siteSize = err ? 1 : 7;
		bmp.ctx.fillRect(site.x * sw - siteSize / 2, site.y * sh - siteSize / 2, siteSize, siteSize);
	}

	var experiment = {
		stage: bmp.canvas,
		init: init,
		settings: {}, // or null
	};

	// var output = dom.element("div");
	// document.body.appendChild(output);
	var threadOutput = dom.canvas(800, 300);
	// document.body.appendChild(threadOutput.canvas);

	function init(options) {
		console.time("process time");

		progress =
			options.progress ||
			(() => {
				con.log("circle_packing - no progress defined");
			});
		var size = options.size;
		sw = size;
		sh = size;
		bmp.setSize(sw, sh);
		rnd.setSeed(options.seed);
		console.log("setting seed.", rnd.getSeed());

		c.getRandomPalette();
		// bmp.ctx.clearRect(0, 0, sw, sh);
		bmp.ctx.fillStyle = "#000";
		bmp.ctx.fillRect(0, 0, sw, sh);

		var threads = 0;
		var iterations = 0;
		var circles = 0,
			circlesLast = 0,
			circlesSame = 0;
		var gap = rnd.getNumber(0.001, 0.02);
		// var gap = 0.0005;
		con.log("gap", gap);
		var minRadius = rnd.getNumber(0.001, 0.01);
		// var minRadius = 0.0002;
		var maxRadius = rnd.getNumber(minRadius + 0.02, 0.5);
		// var maxRadius = minRadius + 0.02;
		var maxDepth = rnd.getInteger(1, 10);
		// var maxDepth = 1;

		var limitMaxRadius = rnd.getInteger(0, 2);
		var powerMaxRadius = rnd.getNumber(0.8, 3);
		var limitMinRadius = rnd.getInteger(0, 1);
		con.log("limitMaxRadius", limitMaxRadius);
		con.log("powerMaxRadius", powerMaxRadius);
		con.log("limitMinRadius", limitMinRadius);

		var banding = rnd.getNumber() > 0.7;
		var bandScale = rnd.getInteger(4, 20);
		var bandModulo = rnd.getInteger(2, 10);

		var alternatePunchOut = rnd.getNumber() > 0.7;

		// brutal seeds: 454163889, 3575304202
		var bailed = false;
		var progressTicker = 0;
		var fakeProgress = 0.1;
		var progressChecker = () => {
			if (threads == -1) {
				// threads
				con.log("progressChecker", threads);
				progress("render:complete", bmp.canvas);
				bailed = true;
			} else {
				// fakeProgress -= (fakeProgress - 1) * 0.05;
				// progress("render:progress", fakeProgress);
				setTimeout(progressChecker, 250);
			}
			// output.innerHTML = [circles, iterations, threads];
		};
		progressChecker();

		function attemptNextCircle(parent, attempt) {
			threads++;
			attempt++;

			progressTicker++;
			threadOutput.ctx.fillRect(progressTicker / 500, 0, 1, threads / 50);

			if (circles % 100 == 0) {
				fakeProgress -= (fakeProgress - 1) * 0.02;
				progress("render:progress", fakeProgress);
			}

			// con.log("attemptNextCircle", progressTicker / 1000, threads / 1000);

			if (attempt < 5000) {
				var delay = iterations % 100 ? 0 : 200;
				// return attemptCircle(parent, attempt);
				if (delay) {
					// con.log("ok")
					setTimeout(function () {
						attemptCircle(parent, attempt);
					}, delay);
				} else {
					attemptCircle(parent, attempt);
				}
			} else {
				con.log("too many attempt");
			}
		}

		function attemptCircle(parent, attempt, options) {
			// con.log("attemptCircle")
			threads--;
			iterations++;

			var colour, depth, distance, dx, dy, other, r, radius, site, y, x;
			if (parent) {
				if (!parent.sites.length) {
					// no sites left
					return;
				}

				depth = parent.depth + 1;

				// distance from centre of parent
				// distance = rnd.getInteger(1, 5) / 5 * parent.r + rnd.random() * 0.03;

				// distance = rnd.random() * parent.r;
				// banding

				// pick a sot
				var index = Math.floor(rnd.random() * parent.sites.length);
				site = parent.sites.splice(index, 1)[0];
				x = site.x;
				y = site.y;
				dx = parent.x - x;
				dy = parent.y - y;
				distance = Math.sqrt(dx * dx + dy * dy);

				// establish start radius
				radius = parent.r - distance - gap;
				// radius = Math.pow(0.6 - d, 3) * 4;
				// radius = (0.7 - d) * 0.2;
				// radius = (d + 0.1) * 0.2;
				// radius = 0.07;
				// radius = (Math.sin((0.25 + d) * TAU * 2.5) + 1.5) / 80;
				// sin0 = 0 & sinHalfPi = 1
				// radius = (Math.sin(distance * Math.PI / 2)) * radius;
				// radius = (0.5 - distance) * 2 * radius;

				switch (limitMaxRadius) {
					// case 0 - ignore, adopt global maxRadius
					case 1: // set a varying maxRadius based on distance, growing smaller towards edges
						maxRadius = 0.01 + Math.pow(0.5 - distance, powerMaxRadius);
						break;
					case 2: // set a varying maxRadius based on distance, growing larger towards edges
						maxRadius = 0.01 + Math.pow(distance, powerMaxRadius);
						break;
				}

				switch (limitMinRadius) {
					// case 0 : ignore, adopt global minRadius
					case 1: // set a varying minRadius based on maxRadius
						minRadius = maxRadius * 0.1;
						break;
				}

				// choose a randomised radius
				// r = rnd.random() * radius * (parent.r - distance - gap);
				r = rnd.random() * radius;
				// r = parent.r - distance - gap;
				// r = radius;
				// r = 0.005;
				// r = 0.05;

				if (r > maxRadius) {
					r = maxRadius;
				} else if (r < minRadius) {
					r = minRadius;
					// con.log("fail initial radius too small");
					// error(site, depth, "red");
					// return attemptNextCircle(parent, attempt);
				}

				if (options) {
					if (options.r) {
						/* con.log("overriding r"); */ r = options.r;
					}
					if (options.x) {
						/* con.log("overriding x"); */ x = options.x;
					}
					if (options.y) {
						/* con.log("overriding y"); */ y = options.y;
					}
				}

				if (r - gap < minRadius) {
					// con.log("fail initial radius too small");
					error(site, depth, "blue");
					return attemptNextCircle(parent, attempt);
				}

				// check all other children
				var ok = true;
				for (var i = 0, il = parent.children.length; i < il && ok; i++) {
					other = parent.children[i];
					dx = x - other.x;
					dy = y - other.y;
					distance = Math.sqrt(dx * dx + dy * dy); // minimum required distance between centres
					var distanceCombined = r + other.r + gap; // actual distance of radiuses and gap
					if (distanceCombined > distance) {
						r = distance - other.r - gap;
						if (r < minRadius) {
							ok = false;
						}
					}
				}
				if (ok === false) {
					// con.log("fail can't find suitable radius", r)
					error(site, depth, "yellow");
					return attemptNextCircle(parent, attempt);
				}
			} else {
				// the host container, typically want it centred (cx, cy) and half of canvas (0.5)
				x = cx; //rnd.random();
				y = cy; //rnd.random();
				r = 0.5; //rnd.random() / 2;
				depth = 0;
			}

			if (options && options.colour) {
				colour = options.colour;
			} else {
				colour = c.getRandomColour(); //"#fff";//colour;
				while (parent && parent.colour == colour) {
					// don't allow same colour as parent
					colour = c.getNextColour();
				}
			}

			// if (depth > 1) return

			if (alternatePunchOut) {
				// every second level punch the circle out rather than draw on top.
				bmp.ctx.globalCompositeOperation = (depth + 1) % 2 ? "destination-out" : "source-over";
			}
			bmp.ctx.beginPath();
			bmp.ctx.fillStyle = colour;
			bmp.ctx.drawCircle(x * sw, y * sh, r * sw);
			bmp.ctx.closePath();
			bmp.ctx.fill();
			// bmp.ctx.stroke();

			// calculate series of sites worth testing for this circle
			// based on https://codepen.io/raurir/pen/KqVOqE
			// inspiration from s_roddeh
			// var grid = (maxRadius + minRadius) / 10 || 0.01;
			var grid = 0.01;
			var rings = Math.ceil(r / grid);
			grid = r / rings;
			var sites = [];
			for (var ring = 0; ring < rings; ring++) {
				var perimeter = ring * grid * TAU;
				var segments = Math.ceil(perimeter / grid) || 6;
				for (var segment = 0; segment < segments; segment++) {
					// vary siteRadius and siteAngle by rnd.getNumber(0, 1) for some jitter
					var siteRadius = (ring + rnd.getNumber(0, 1)) * grid,
						siteAngle = ((segment + rnd.getNumber(0, 1)) / segments) * TAU,
						siteX = x + Math.sin(siteAngle) * siteRadius,
						siteY = y + Math.cos(siteAngle) * siteRadius,
						site = {
							x: siteX,
							y: siteY,
						};
					// if (Math.sin(siteAngle) < 0.75) { // pacman
					// if (Math.sin(siteAngle) > 0) { // semi circle
					// if (parseInt(siteAngle) % 2 == 0) // radioactive sign
					if (banding) {
						if (parseInt(siteRadius * bandScale) % bandModulo == 0) {
							sites.push(site);
						}
					} else {
						sites.push(site);
					}
				}
			}

			if (site) {
				error(site, depth, false);
			}

			var circle = {
				colour: colour,
				depth: depth,
				x: x,
				y: y,
				r: r,
				children: [],
				sites: sites,
			};
			// con.log(r, circle.childrenMax);

			circles++;
			if (parent && parent.children) {
				parent.children.push(circle);
			}

			if (depth < maxDepth) {
				for (var i = 0, il = circle.sites.length; i < il; i++) {
					attemptNextCircle(circle, 0);
				}
			}
		}

		var container = attemptCircle(null, 0, {colour: "transparent"});
		// var inner = attemptCircle(parent, 0, {x: 0.5, y: 0.5, r: 0.3, colour: "rgba(0,0,0,0)"});
		// var inner2 = attemptCircle(inner, 0, {x: 0.5, y: 0.5, r: 0.1, colour: c.getNextColour()});
	}
	return experiment;
};

if (isNode) {
	module.exports = circle_packing();
} else {
	define("circle_packing", circle_packing);
}
