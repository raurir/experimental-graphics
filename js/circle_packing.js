var isNode = (typeof module !== 'undefined');

var circle_packing = function() {

	var sw, sh;
	

	var bmp = dom.canvas(1, 1);

	var experiment = {
		stage: bmp.canvas,
		init: init,
		settings: {} // or null
	}


	function drawCircle(params) {
		var x = params.x, y = params.y, r = params.r,
			colour = params.colour == "COLOUR_NEXT" ? colours.getNextColour() : params.colour;
		bmp.ctx.beginPath();
		bmp.ctx.fillStyle = colour;
		bmp.ctx.drawCircle(x * sw, y * sh, r * sw);
		bmp.ctx.closePath();
		bmp.ctx.fill();
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

		var size = options.size;
		sw = size;
		sh = size;
		bmp.setSize(sw, sh);
		// rand.setSeed(4);
		colours.getRandomPalette();
		bmp.ctx.clearRect(0, 0, sw, sh);

		var iterations = 0;
		var circles = 0;
		var threads = 0;
		var gap = rand.getNumber(0.0001, 0.05);
		var minRadius = 0.002;//rand.getNumber(0.001, 0.01);
		var maxRadiusMod = rand.getNumber(0.01, 0.1);
		var maxDepth = rand.getInteger(1, 10);

		var worker = new Worker('js/circle_packing_worker.js');

		worker.addEventListener('message', function(e) {
			// con.log('Worker status:', e.data.status);
			switch (e.data.status) {
				case "success" : 
					// con.log('Worker success:', e.data.circle);
					circles ++;
					var parent = circles === 1
						? e.data.circle // if it's the first circle, there is no parent!
						: e.data.parent;
					drawCircle(e.data.circle);
					attemptNextCircle(parent, e.data.attempt);
					break;
				case "fail" :
					// con.log('Worker fail...');
					attemptNextCircle(e.data.parent, e.data.attempt);
					break;
			}
		}, false);


		function attemptNextCircle(parent, attempt) {
			attempt++;
			parent.attempts = 0;
			// con.log("attemptNextCircle", attempt);
			output.innerHTML = [circles, attempt, threads, iterations];
			if (attempt < 10000) { // && parent.r > 0.01) {
				setTimeout(function() {
					requestNextCircle(parent, attempt);
				}, 1);//iterations % 1000 ? 1 : 20);
			}
		}

		function requestNextCircle(parent, attempt, options) {
			worker.postMessage({
				attempt: attempt,
				options: options,
				parent: parent,
				type: "requestCircle",
				constants: { // madness ensues...
					gap: gap,
					maxDepth: maxDepth,
					maxRadiusMod: maxRadiusMod,
					minRadius: minRadius
				},
				randoms: { // this is fucking. crazy.
					angle: rand.random(),
					distance: rand.random(),
					incrementorDistance: rand.random(),
					incrementorAngle: rand.getNumber(-1, 1),
					radius: rand.random(),
				}
			});
		}

		// var container = drawCircle(null, 0, {colour: 'rgba(0,0,0,0.1)'});
		requestNextCircle(null, 0, {colour: 'rgba(0,0,0,0.1)'});

		// window.container = container;
		// var inner = drawCircle(parent, 0, {x: 0.5, y: 0.5, r: 0.3, colour: "rgba(0,0,0,0)"});
		// var inner2 = drawCircle(inner, 0, {x: 0.5, y: 0.5, r: 0.1, colour: colours.getNextColour()});

		progress("render:complete", bmp.canvas);
	}
	return experiment;

};

if (isNode) {
	module.exports = circle_packing();
} else {
	define("circle_packing", circle_packing);
}