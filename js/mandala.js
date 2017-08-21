var isNode = (typeof module !== 'undefined');

var mandala = function() {


	var settings = {
		spread: {
		type: "Number",
		label: "Spread",
			min: 1,
			max: 10,
			cur: 10
		}
	}

	var TAU = Math.PI * 2;
	var sw, sw, centre, spokes;
	var stage = dom.canvas(1, 1);
	var ctx = stage.ctx;

 	function init(options) {
		size = options.size;
		sw = options.sw || size;
		sh = options.sh || size;
		stage.setSize(sw, sh);
		centre = sh / 2;

 		var palette = colours.getRandomPalette();
 		con.log("Mandala init", palette);


		spokes = rand.getInteger(2, 40) * 2;

		settings.spread.cur = 10;
		// settings.background.cur = true;
		if (options.settings) {
			settings = options.settings;
		}
		progress('settings:initialised', settings);

		render();
	}

	function render() {
		var spread = settings.spread.cur / settings.spread.max;
		con.log("spread", spread);
		var a = 1 / spokes * TAU;
		var maxR = Math.sqrt(0.5 * 0.5 * 2);
		var r = maxR * size;
		var bgColour = colours.getRandomColour();

		var masker = dom.canvas(sw, sh);
		var maskBorder = 2; // 2 pixel overlap
		masker.ctx.translate(maskBorder, maskBorder);
		masker.ctx.lineCap = "flat";
		masker.ctx.beginPath();
		masker.ctx.moveTo(0, 0);
		masker.ctx.lineTo(Math.sin(0) * r, Math.cos(0) * r);
		masker.ctx.lineTo(Math.sin(a) * r, Math.cos(a) * r);
		masker.ctx.lineTo(0, 0);
		masker.ctx.fillStyle = "red";
		masker.ctx.strokeStyle = "red";
		masker.ctx.lineWidth = maskBorder;
		masker.ctx.stroke();
		// masker.ctx.fill();

		var pattern = dom.canvas(sw, sh);
		pattern.ctx.translate(maskBorder, maskBorder);
		pattern.ctx.beginPath();
		pattern.ctx.moveTo(0, 0);
		pattern.ctx.lineTo(Math.sin(0) * r, Math.cos(0) * r);
		pattern.ctx.lineTo(Math.sin(a) * r, Math.cos(a) * r);
		pattern.ctx.lineTo(0, 0);
		pattern.ctx.fillStyle = bgColour;
		pattern.ctx.strokeStyle = bgColour;
		pattern.ctx.lineWidth = maskBorder;
		pattern.ctx.stroke(); 
		pattern.ctx.fill();

		document.body.appendChild(masker.canvas);
		document.body.appendChild(pattern.canvas);

		var max = 7;
		
		function sorter(a,b) { return a < b ? -1 : 1; }

		function drawBands() {
			for (var i = 0; i < 1; i++) {
			// for (var i = 0; i < bandSets; i++) {
				var bands = rand.getInteger(3, 40);
				var bandSize = rand.getNumber(0.01, 0.1);
				var stripeSize = rand.getNumber(1, bandSize * 0.6);
				var bandAngle = rand.getNumber(0.25, 0.5) * TAU;
				var bandStart = rand.getNumber(0, 0.5);
				function drawBand(colour, widthMod) {
					pattern.ctx.lineWidth = stripeSize * widthMod * size * 0.01;
					pattern.ctx.strokeStyle = colour;
					for (var j = 0; j < bands; j++) {
						var x0 = -0.1;
						var y0 = bandStart + j * bandSize;
						con.log(y0, spread)
						if (y0 * maxR < spread) {
							var x1 = x0 + Math.sin(bandAngle) * 3; // just a really long distance! off screen please!
							var y1 = y0 + Math.cos(bandAngle) * 3;
							// con.log(x0, y0, x1, y1, pattern.ctx.lineWidth, x0 * centre, y0 * centre);
							pattern.ctx.beginPath();
							pattern.ctx.moveTo(x0 * centre, y0 * centre);
							pattern.ctx.lineTo(x1 * centre, y1 * centre);
							pattern.ctx.stroke();
						}
					}
				}
				// drawBand(bgColour, 2);
				drawBand(colours.getNextColour(), 1);
			}
		}

		function drawRegions() {
			var regionSizes = {
				left: [],
				right: []
			};
			for (var i = 0; i < regionSets; i++) {
				regionSizes.left.push(rand.random());
				regionSizes.right.push(rand.random());
			}
			regionSizes.left.sort(sorter);
			regionSizes.right.sort(sorter);
			for (i = 0; i < regionSets - 1; i++) {
				pattern.ctx.fillStyle = colours.getNextColour();
				var x0 = Math.sin(0) * regionSizes.left[i]; // should be 0 > alpha, intentional overdraw
				var y0 = Math.cos(0) * regionSizes.left[i];
				var x1 = Math.sin(a) * regionSizes.right[i];
				var y1 = Math.cos(a) * regionSizes.right[i];
				var x2 = Math.sin(a) * regionSizes.right[i + 1];
				var y2 = Math.cos(a) * regionSizes.right[i + 1];
				var x3 = Math.sin(0) * regionSizes.left[i + 1];
				var y3 = Math.cos(0) * regionSizes.left[i + 1];
				pattern.ctx.beginPath();
				pattern.ctx.moveTo(x0 * r, y0 * r);
				pattern.ctx.lineTo(x1 * r, y1 * r);
				pattern.ctx.lineTo(x2 * r, y2 * r);
				pattern.ctx.lineTo(x3 * r, y3 * r);
				pattern.ctx.closePath();
				pattern.ctx.fill();
				pattern.ctx.strokeStyle = "black";
				pattern.ctx.stroke();

				var points = [
					{x: x0, y: y0},
					{x: x1, y: y1},
					{x: x2, y: y2},
					{x: x3, y: y3}
				];
				var insetPoints = geom.insetPoints(points, -0.01);
				con.log("duble", points, insetPoints)
				if (insetPoints) {
					pattern.ctx.beginPath();
					pattern.ctx.fillStyle = colours.getNextColour();
					for (var i = 0; i < insetPoints.length; i++) {
						var p = insetPoints[i];
						pattern.ctx[i == 0 ? "moveTo" : "lineTo"](p.x * r, p.y * r);
					};
					pattern.ctx.fill();
				}
			}
		}

		function drawCircles() {
			for (var i = 0; i < circleSets; i++) {
				// pattern.ctx.globalCompositeOperation = 
				// 	rand.random() > 0.5
				// 	? "destination-out"
				// 	: "source-over";
				var angle = rand.getNumber(-a, 2 * a);
				var distance = rand.getNumber(0, r);
				var radius = rand.getNumber(0, r/4);
				var x = Math.sin(angle) * distance;
				var y = Math.cos(angle) * distance;
				pattern.ctx.fillStyle = colours.getNextColour();
				pattern.ctx.beginPath();
				pattern.ctx.drawCircle(x, y, radius);
				pattern.ctx.fill();
			}
		}

		var bandSets = rand.getInteger(0, max);
		max -= bandSets;
		var regionSets = 2;//rand.getInteger(0, max);
		max -= regionSets;
		var circleSets = max;
		con.log(bandSets, regionSets, circleSets);

		drawRegions();
		// drawCircles();
		// drawBands();


		// pattern.ctx.fillStyle = colours.getNextColour();
		// pattern.ctx.rotate(rand.getNumber(0, TAU));
		// pattern.ctx.fillText(
		// 	rand.getNumber(0, 100),
		// 	rand.getNumber(0, 10),
		// 	rand.getNumber(0, centre)
		// );

		/*
		pattern.ctx.save();
		pattern.ctx.fillStyle = colours.getNextColour();
		pattern.ctx.rotate(rand.getNumber(0, TAU));
		pattern.ctx.fillText(
			rand.getNumber(0, 100),
			rand.getNumber(0, 10),
			rand.getNumber(0, centre)
		);
		pattern.ctx.restore();
		*/
	

		// mask it out
		// pattern.ctx.globalCompositeOperation = "destination-in";
		// pattern.ctx.drawImage(masker.canvas, -maskBorder, -maskBorder);
		// pattern.ctx.beginPath();
		// pattern.ctx.moveTo(0, 0);
		// pattern.ctx.lineTo(0, r);
		// pattern.ctx.lineTo(Math.sin(a) * r, Math.cos(a) * r);
		// pattern.ctx.fill();


		for (var i = 0; i < spokes; i++) {
		// for (var i = 0; i < 1; i++) {
			stage.ctx.save();
			if (i % 2 == 1) {
				stage.ctx.scale(-1, 1);
				stage.ctx.translate(-centre, centre);
				stage.ctx.rotate((i - 1) * a);
			} else {
				stage.ctx.translate(centre, centre);
				stage.ctx.rotate(i * a);
			}
			stage.ctx.drawImage(pattern.canvas, -maskBorder, -maskBorder);
			stage.ctx.restore();
		}
		
	}

	function update(settings) {
		init({size: size, settings: settings})
	}

	var experiment = {
		init: init,
		render: render,
		settings: settings,
		stage: stage.canvas,
		update: update,
	}

	progress("render:complete", stage.canvas);

	return experiment;

};

if (isNode) {
  module.exports = mandala();
} else {
  define("mandala", mandala);
}