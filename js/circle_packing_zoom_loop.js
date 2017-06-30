var isNode = (typeof module !== 'undefined');

if (isNode) {
	var con = console;
	var dom = require('./dom.js');
	var geom = require('./geom.js');
	var rand = require('./rand.js');
}

var circle_packing_zoom_loop = function() {

	var TAU = Math.PI * 2;
	var cx = 0.5, cy = 0.5;
	var bmp = dom.canvas(1, 1);
	var size;
	var current, next;
	
	var zoom = {};
	function init(options) {
		size = options.size;
		bmp.setSize(size, size);
		current = generate();
		// var p1 = generate();
		setTimeout(() => {
			var p0 = current;
			con.log("p0", p0)
			var targetIndex = rand.getInteger(0, p0.circles.length);
			var target = p0.circles[targetIndex];

			zoom = {
				amount: 1,
				max: 0.5 / target.r,
				target,
				targetIndex,
			}
			// con.log(getBaseLog(0.5, zoom.max));
			con.log("zoom", zoom);
			updateZoom(0);
		}, 100);
	}

	var maxTime = 10000;
	function updateZoom(time) {
		// if (time < maxTime) requestAnimationFrame(updateZoom);
		// zoom.amount += 0.01;
		// zoom.amount *= 1.01;
		// if (zoom.amount < 4) {
		if (zoom.amount < zoom.max) {
			// requestAnimationFrame(updateZoom);
			// setTimeout(updateZoom, 10);
		} else {
			// zoom.amount = 4;
			zoom.amount = zoom.max;
			// con.log("done", zoom);
		}
		target = zoom.target
		scale = zoom.amount


		var distance = Math.sqrt(Math.pow(zoom.target.x, 2) + Math.pow(zoom.target.y, 2)) * zoom.max;
		// con.log(distance)
		scaler = zoom.amount;
		// zoomProgress = 1 - Math.pow(1 - zoom.amount / zoom.max, distance);
		zoomProgress = zoom.amount / zoom.max;
		zoomRemaining = 1 - zoomProgress;

		var xo = zoom.target.x / distance * zoom.amount;

		// con.log(xo)

		bmp.ctx.save();
		bmp.ctx.clearRect(0, 0, size, size);

		for (var i = 0, il = current.circles.length; i < il; i++) {
			var {x,y,r} = current.circles[i];
			// x = 0.5 + (x - target.x) * scaler;
			// y = 0.5 + (y - target.y) * scaler;
			x = 0.5 + (x - 0.5) * scaler;
			y = 0.5 + (y - 0.5) * scaler;
			r = r * Math.pow(scaler, 1);//0.8);
			bmp.ctx.fillStyle = i == zoom.targetIndex ? "#f00" : "#000";
			bmp.ctx.beginPath();
			bmp.ctx.drawCircle(x * size, y * size, r * size);
			bmp.ctx.closePath();
			bmp.ctx.fill();
		}
		bmp.ctx.fillStyle = "yellow";
		bmp.ctx.fillRect(cx * size - 1, 0, 2, size);
		bmp.ctx.fillRect(0, cy * size - 1, size, 2);

		var xo = 0.5 + (target.x - 0.5) * scaler;
		var yo = 0.5 + (target.y - 0.5) * scaler;

		bmp.ctx.strokeStyle = "green";
		bmp.ctx.beginPath();
		bmp.ctx.moveTo(cx * size, cy * size);
		bmp.ctx.lineTo(xo * size, yo * size);
		bmp.ctx.stroke();

		var half = geom.lerp({x: cx * size, y: cy * size}, {x: xo * size, y: yo * size}, zoomProgress);
 
		bmp.ctx.fillRect(half.x, half.y, 10, 10);

	}

	window.addEventListener("mousemove",(e) => {
		zoom.amount = 1 + e.x / size * zoom.max;
		updateZoom();
	})

	function generate() {
		var planet = dom.canvas(size, size);
		var threads = 0;
		var iterations = 0;
		var circles = 0, circlesLast = 0, circlesSame = 0;
		var gap = rand.getNumber(0.0001, 0.02);
		var minRadius = rand.getNumber(0.001, 0.01);
		var maxRadius = rand.getNumber(minRadius + 0.02, 0.5);
		var maxDepth = 1;

		function attemptNextCircle(parent, attempt) {
			threads++;
			attempt++;
			if (attempt < 5000) {
				// con.log(threads);
				attemptCircle(parent, attempt);
			} else {
				con.log("too many attempt");
			}
		}


		function attemptCircle(parent, attempt, options) {
			// con.log("attemptCircle")
			threads--;
			iterations++;

			var depth, distance, dx, dy, other, r, radius, site, y, x;
			if (parent) {

				if (!parent.sites.length) { // no sites left
					return;
				}

				depth = parent.depth + 1;

				// pick a sot
				var index = Math.floor(rand.random() * parent.sites.length);
				site = parent.sites.splice(index, 1)[0];
				x = site.x;
				y = site.y;
				dx = parent.x - x;
				dy = parent.y - y;
				distance = Math.sqrt(dx * dx + dy * dy);

				// establish start radius
				radius = parent.r - distance - gap;

				r = rand.random() * radius;

				if (r > maxRadius) {
					r = maxRadius;
				} else if (r < minRadius) {
					r = minRadius;
				}
				if (r - gap < minRadius) {
					// con.log("fail initial radius too small");
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
					return attemptNextCircle(parent, attempt);
				}

			} else {
				// the host container, typically want it centred (cx, cy) and half of canvas (0.5)
				x = cx;
				y = cy;
				r = 0.5;
				depth = 0;
			}

			// calculate series of sites worth testing for this circle
			// based on https://codepen.io/raurir/pen/KqVOqE
			// inspiration from s_roddeh
			var grid = 0.01;
			var rings = Math.ceil(r / grid);
			grid = r / rings;
			var sites = [];
			for (var ring = 0; ring < rings; ring++) {
				var perimeter = ring * grid * TAU;
				var segments = Math.ceil(perimeter / grid) || 6;
				for (var segment = 0; segment < segments; segment++) {
					// vary siteRadius and siteAngle by rand.getNumber(0, 1) for some jitter
					var siteRadius = (ring + rand.getNumber(0, 1)) * grid,
						siteAngle = (segment + rand.getNumber(0, 1)) / segments * TAU,
						siteX = x + Math.sin(siteAngle) * siteRadius,
						siteY = y + Math.cos(siteAngle) * siteRadius,
						site = {
							x: siteX,
							y: siteY
						};
					sites.push(site);
				}
			}

			var circle = {
				depth: depth,
				x: x,
				y: y,
				r: r,
				children: [],
				sites: sites
			}

			circles++;
			if (parent && parent.children) {
				parent.children.push(circle);
			}

			if (depth < maxDepth) {
				for (var i = 0, il = circle.sites.length; i < il; i++) {
					attemptNextCircle(circle, 0);
				}
			}
			return circle;
		}
		var container = attemptCircle(null, 0);
		return {
			canvas: planet.canvas,
			circles: container.children
		};
	}
	return {
		stage: bmp.canvas,
		init: init
	}

};

if (isNode) {
	module.exports = circle_packing_zoom_loop();
} else {
	define("circle_packing_zoom_loop", circle_packing_zoom_loop);
}