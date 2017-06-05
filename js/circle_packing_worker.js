var con = console;
var cx = 0.5, cy = 0.5;

var threads = 0;

function calcCircles(params) {
	var circles = [];
	var iterations = params.parent ? params.iterations : 1;
	for (var i = 0; i < iterations; i++) {
		var circle = calcCircle(i, params);
		if (circle.status == "success") {
			circles.push(circle);
		}
	}
	// con.log("calcCircles iterations:", iterations, "result", circles.length);
	return {
		attempt: 0,
		circles: circles,
		parent: params.parent || circles[0],
		status: circles.length ? "success" : "fail",
		successRatio: circles.length / iterations * 100,
	};
}

function calcCircle(index, params) {
	// con.log("calcCircle!!!!!!")
	var parent = params.parent,
		attempt = params.attempt, 
		options = params.options, 
		randoms = params.randoms[index],

		gap = params.constants.gap,
		maxDepth = params.constants.maxDepth,
		maxRadiusMod = params.constants.maxRadiusMod,
		minRadius = params.constants.minRadius;

	threads++;
	// iterations++;

	if (parent) {
		if (parent.children.length > parent.childrenMax) {
			threads--;
			// con.log("bailing too may children");
			return;
		}
		if (parent.attempts > 500000) {
			threads--;
			// con.log("bailing too may attempts");
			return;
		}
	}

	var x, y, r, dx, dy, d, depth, colour, angle, distance, other;
	if (parent) {
		angle = randoms.angle * Math.PI * 2;
		// angle = iterations * Math.PI * 2;

		// distance from centre of parent
		// distance = rand.getInteger(1, 5) / 5 * parent.r + rand.random() * 0.03;

		distance = randoms.distance * parent.r;
		// banding
		// distance = rand.getInteger(1, 5) / 5 * parent.r + rand.random() * 0.03;


		var angleIncrement = 0.01;

		// start filling in the rest by drawing circles in a sweeping fashion
		// var thresh = false;//true;//iterations > 5;
		var thresh = parent.children.length > parent.childrenMax / 2;
		if (thresh) {
			// con.log("ok");
			parent.incrementor.distance += randoms.incrementorDistance * 0.04;
			if (parent.incrementor.distance > parent.r) {
				parent.incrementor.distance = 0;
				parent.incrementor.angle += angleIncrement;
			}
			distance = parent.incrementor.distance;
			angle = parent.incrementor.angle + randoms.incrementorAngle * angleIncrement;
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
		// if (maxRadius > 1 ) con.log(maxRadius);

		// r = rand.random() * maxRadius * (parent.r - distance - gap);
		r = randoms.radius * maxRadius;// * maxRadiusMod;
		// r = parent.r - distance - gap;
		// r = maxRadius;
		// r = 0.005;
		// r = 0.05;


		if (options) {
			if (options.r) { /* con.log("overriding r"); */ r = options.r; }
			if (options.x) { /* con.log("overriding x"); */ x = options.x; }
			if (options.y) { /* con.log("overriding y"); */ y = options.y; }
		}

		if (r < minRadius) {
			// con.log("less thatn 0.004")
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
					// con.log("less thatn 0.002", r)
					threads--;
					return attemptNextCircle(parent, attempt);
				}
			}
		}
		if (ok === false) {
			threads--;
			return attemptNextCircle(parent, attempt);
		} else {
			// colour = depth % 2 == 0 ? "rgba(0, 0, 255, 0.5)" : "rgba(0, 255, 0, 0.5)";
			// colour = depth % 2 == 0 ? "black" : "white";
			colour = "COLOUR_NEXT"; // madness ;
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
		if (options.colour) { con.log("overriding colour", colour); colour = options.colour; }
	} else {
		// con.log("noptions?")
	}

	// con.log('drawOne', x, y, colour);

	// con.log("iterations", iterations, x, y, r, bmp.ctx.fillStyle, depth, depth % 2);

	var circle = {
		attempts: 0,
		colour: colour,
		depth: depth,
		x: x,
		y: y,
		r: r,
		children: [],
		childrenMax: Math.ceil(Math.pow((r * 20), 2) * 100),
		incrementor: {
			angle: 0,
			distance: 0
		}
	}
	// con.log(r, circle.childrenMax);

	// circles++;
	if (parent && parent.children) {
		parent.children.push(circle);
	}

	// if (iterations < 4) {//500) {
	// if (depth < maxDepth) {
	// 	var num = 5000;//rand.random() * 6;
	// 	for (var i = 0; i < num; i++) {
	// 		attemptNextCircle(circle, 0);
	// 	}
	// }


	// if (parent) {
	// 	attemptNextCircle(parent, attempt);
	// }
	threads--;
	return {
		attempt: attempt,
		circle: circle,
		parent: parent,
		status: "success"
	}
}

function attemptNextCircle(parent, attempt) {
	// con.log('we got a fail!');
	return {
		attempt: attempt,
		parent: parent,
		status: "fail",
	}
}

self.addEventListener('message', function(e) {
	// con.log("e", e);
	switch (e.data.type) {
		case "requestCircle" :
			var outcome = calcCircles(e.data);
			self.postMessage(outcome);
			break;
	}

}, false);