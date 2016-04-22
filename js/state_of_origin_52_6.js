var con = console;
var isNode = (typeof module !== 'undefined');

var state_of_origin_52_6 = function() {

	var QLD = "QLD", NSW = "NSW";
	var font = "180px helvetica" // impact";
	var red = "#f00";
	var bmpSize = 200;
	var outputScale = 4;
	var output = canvas(bmpSize * outputScale, bmpSize * outputScale, true);

	function canvas(width, height, append) {
		var a = document.createElement("canvas");
		if (append)
			document.body.appendChild(a);
		a.width = width;
		a.height = height;
		return {
			canvas: a,
			ctx: a.getContext('2d')
		}
	}


	// collect progress events and batch em. wtf is this code even? hahaha. not funny.
	var progressions = {
		NSW: 0,
		QLD: 0
	};
	var complete = {
		NSW: false,
		QLD: false
	}
	function stateProgress(state, eventName, detail) {
		if (eventName === "render:progress") {
			progressions[state] = detail;
			progress(eventName, (progressions.NSW + progressions.QLD) / 2);
		} else if (eventName === "render:complete") {
			complete[state] = true;
			if (complete.NSW && complete.QLD) {
				progress(eventName, detail);
			}
		}
	}



	function render(state, score, x, y, maxGlyphs) {
		// QLD can fit more glyphs... because they are a better team...
		// no, because 52 takes up more space than 6...
		// ... go back to my first point.

		var count = 0, countMax = 70 * maxGlyphs;
		var min = 0;

		var testCanvas = canvas(bmpSize, bmpSize);
		var progressCanvas = canvas(bmpSize, bmpSize);

		var c0 = document.createElement("div");
		// document.body.appendChild(c0);

		function pointInShape(point) {

			testCanvas.ctx.globalCompositeOperation = 'source-over';
			testCanvas.ctx.drawImage(progressCanvas.canvas, 0, 0);
			testCanvas.ctx.globalCompositeOperation = 'source-in';
			drawShape(testCanvas.ctx, point, false, false);

			var pad = 20;

			var width = Math.ceil(point.size + pad) * 2;
			var height = Math.ceil(point.size + pad);
			var xs = Math.floor(point.x - width);
			var ys = Math.floor(point.y - height * 2);
			width = width * 2;
			height = height * 2;

			var pixels = testCanvas.ctx.getImageData(xs, ys, width, height).data;
			var ok = true;
			for (var x = 0; x < width && ok; x++) {
				for (var y = 0; y < height && ok; y++) {
					var pixel = (y * width + x) * 4;
					ok = pixels[pixel] === 0;
					// con.log(pixels[pixel])
				}
			}

			testCanvas.ctx.globalCompositeOperation = 'source-over';
			testCanvas.ctx.fillStyle = ok ? "rgba(0, 0, 255, 0.25)" : "rgba(255, 0, 0, 0.25)";
			testCanvas.ctx.fillRect(xs, ys, width, height);

			return ok;
		}


		function newPosition() {
			var padX = bmpSize * 0;
			var padY = bmpSize * 0.1;
			return {
				x: padX + Math.random() * (bmpSize - padX * 2),
				y: padY + Math.random() * (bmpSize - padY * 2),
				size: min// + Math.random() * 3// / ((count + 1) * 0.01)
			}
		}

		function drawShape(target, props, fx, renderOuput) {
			var fillStyle;
			if (fx) {
				// target.shadowColor = '#000';
				// target.shadowBlur = 2;
			}
			var overScale = 1;
			if (renderOuput) {
				overScale = 2;
			}
			var scale = 2 * props.size / bmpSize * overScale;
			var x = (props.x - props.size) * overScale;
			var y = (props.y - props.size) * overScale;

			if (renderOuput) {
				x += bmpSize * overScale / 2;
				if (state === NSW) {
					y += bmpSize * overScale * 0.8;
				}
				fillStyle = "white";
			} else {
				fillStyle = red;
			}

			target.save();
			target.translate(x, y);
			target.scale(scale, scale);
			target.font = font;
			target.fillStyle = fillStyle;
			target.fillText(state, 0, 0);
			target.restore();
		}

		function generate() {
			var proposed = newPosition();
			var ok = pointInShape(proposed);
			if (ok) {
				count++;
				drawShape(output.ctx, proposed, true, true);
				drawShape(progressCanvas.ctx, proposed, true, false);
			}
		}

		function r() {
			min = Math.pow(1.15, (10 - Math.floor(count / (countMax * 0.1) )));

			var iterationsPerFrame = 30;
			for (var i = 0; i < iterationsPerFrame; i++) {
				generate(true);
				generate(false);
			}
			if (count < countMax) {
				requestAnimationFrame(r);
			} else {
				stateProgress(state, "render:complete", output.canvas);
			}
			c0.innerHTML = [count,min].join(" ");

			// con.log(count, countMax, count / countMax);

			stateProgress(state, "render:progress", count / countMax);

			// setTimeout(r, 1000);
		}

		progressCanvas.ctx.clearRect(0, 0, bmpSize, bmpSize);
		progressCanvas.ctx.fillStyle = red;
		progressCanvas.ctx.fillRect(0, 0, bmpSize, bmpSize);
		progressCanvas.ctx.globalCompositeOperation = 'destination-out';
		progressCanvas.ctx.save();
		progressCanvas.ctx.translate(bmpSize * x, bmpSize * y);
		// progressCanvas.ctx.scale(outputScale, outputScale);
		progressCanvas.ctx.font = font;
		progressCanvas.ctx.fillText(score, 0, 0);
		progressCanvas.ctx.restore();
		progressCanvas.ctx.globalCompositeOperation = 'source-over';

		r();

	}

	function init() {
		render(QLD, 52, -0.02, 0.9, 1.6);
		render(NSW, 6, 0.23, 0.9, 1);
	}

	var experiment = {
		stage: output.canvas,
		init: init
	}

	return experiment;

};

if (isNode) {
	module.exports = state_of_origin_52_6();
} else {
	define("state_of_origin_52_6", state_of_origin_52_6);
}