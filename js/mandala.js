var isNode = (typeof module !== 'undefined');

var mandala = function() {

	var TAU = Math.PI * 2;
	var sw, sw, centre, spokes;
	var stage = dom.canvas(1, 1);
	var ctx = stage.ctx;

 	function init(options) {
 		colours.getRandomPalette();
		size = options.size;
		sw = options.sw || size;
		sh = options.sh || size;
		stage.setSize(sw, sh);
		centre = sh / 2;

		spokes = rand.getInteger(2, 40) * 2;

		var a = 1 / spokes * TAU;
		var r = Math.sqrt(centre * centre * 2);
		var bgColour = colours.getNextColour();

		var masker = dom.canvas(sw, sh);
		var maskBorder = 1; // 2 pixel overlap
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
		masker.ctx.fill();

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

		// document.body.appendChild(masker.canvas);
		// document.body.appendChild(pattern.canvas);

		function sorter(a,b) { return a < b ? -1 : 1; }

		function drawBands() {
			var sets = 4;
			for (var i = 0; i < sets; i++) {
				var bands = rand.getInteger(3, 40);
				var bandSize = rand.getNumber(0.01, 0.1) * size;
				var stripeSize = rand.getNumber(1, bandSize * 0.6);
				var bandAngle = 1 + (rand.getNumber(-0.2, 0.2)) * TAU;
				var bandStart = rand.getNumber(0, centre);
				function drawBand(colour, widthMod) {
					pattern.ctx.lineWidth = stripeSize * widthMod;
					pattern.ctx.strokeStyle = colour;
					for (var j = 0; j < bands; j++) {
						var x0 = -20;
						var y0 = bandStart + j * bandSize;
						var x1 = x0 + Math.sin(bandAngle) * centre * 10; // just a really long distance! off screen please!
						var y1 = y0 + Math.cos(bandAngle) * centre * 10;
						pattern.ctx.beginPath();
						pattern.ctx.moveTo(x0, y0);
						pattern.ctx.lineTo(x1, y1);
						pattern.ctx.stroke();
					}
				}
				drawBand(bgColour, 2);
				drawBand(colours.getNextColour(), 1);
			}
		}

		function drawRegions() {
			var regions = 4;
			var regionSizes = {
				left: [],
				right: []
			};
			for (var i = 0; i < regions; i++) {
				regionSizes.left.push(rand.random());
				regionSizes.right.push(rand.random());
			}
			regionSizes.left.sort(sorter);
			regionSizes.right.sort(sorter);
			for (i = 0; i < regions - 1; i++) {
				pattern.ctx.fillStyle = colours.getNextColour();
				var x0 = Math.sin(-a) * regionSizes.left[i]; // should be 0 > alpha, intentional overdraw
				var y0 = Math.cos(-a) * regionSizes.left[i];
				var x1 = Math.sin(2 * a) * regionSizes.right[i];
				var y1 = Math.cos(2 * a) * regionSizes.right[i];
				var x2 = Math.sin(2 * a) * regionSizes.right[i + 1];
				var y2 = Math.cos(2 * a) * regionSizes.right[i + 1];
				var x3 = Math.sin(-a) * regionSizes.left[i + 1];
				var y3 = Math.cos(-a) * regionSizes.left[i + 1];
				pattern.ctx.beginPath();
				pattern.ctx.moveTo(x0 * r, y0 * r);
				pattern.ctx.lineTo(x1 * r, y1 * r);
				pattern.ctx.lineTo(x2 * r, y2 * r);
				pattern.ctx.lineTo(x3 * r, y3 * r);
				pattern.ctx.fill();
			}
		}

		function drawCircles() {
			var circles = rand.getNumber(3, 100);
			for (var i = 0; i < circles; i++) {
				pattern.ctx.globalCompositeOperation = 
					rand.random() > 0.5
					? "destination-out"
					: "source-over";
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
		drawRegions();
		drawCircles();
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
		pattern.ctx.globalCompositeOperation = "destination-in";
		pattern.ctx.drawImage(masker.canvas, -maskBorder, -maskBorder);
		// pattern.ctx.beginPath();
		// pattern.ctx.moveTo(0, 0);
		// pattern.ctx.lineTo(0, r);
		// pattern.ctx.lineTo(Math.sin(a) * r, Math.cos(a) * r);
		// pattern.ctx.fill();


		for (var i = 0; i < spokes; i++) {
		// for (var i = 0; i < 2; i++) {
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
	var experiment = {
		stage: stage.canvas,
		init: init,
	}

	progress("render:complete", stage.canvas);

	return experiment;

};

if (isNode) {
  module.exports = mandala();
} else {
  define("mandala", mandala);
}