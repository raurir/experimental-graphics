var con = console;
var isNode = (typeof module !== 'undefined');

var state_of_origin_52_6 = function() {

	var QLD = "QLD", NSW = "NSW";
	var font = "180px helvetica" // impact";
	var red = "#f00";
	var bmpSize = 200;
	var outputScale = 4;
	var dim = bmpSize;
	var output = canvas(dim * outputScale, dim * outputScale, true);

	function canvas(width, height, append) {
		var a = document.createElement("canvas");
	// if (append)
			document.body.appendChild(a);
		a.width = width;
		a.height = height;
		var c = a.getContext('2d');
		var circleRads = Math.PI * 2;
		c.fillCircle = function(x, y, r, colour) {
			c.beginPath();
			c.fillStyle = colour;
			c.arc(x, y, r, 0, circleRads, false);
			c.closePath();
			c.fill();
		}
		return {
			canvas: a,
			ctx: c
		}
	}

	function render(state, score, x, y) {

		con.log("render", arguments);

		var count = 0, countMax = 1e5;
		var min = 0;

		var testCanvas = canvas(dim, dim);
		var progressCanvas = canvas(dim, dim);

		var c0 = document.createElement("div");
		document.body.appendChild(c0);

		function pointInShape(point) {

			testCanvas.ctx.globalCompositeOperation = 'source-over';
			testCanvas.ctx.drawImage(progressCanvas.canvas, 0, 0);
			testCanvas.ctx.globalCompositeOperation = 'source-in';
			drawShape(testCanvas.ctx, point, false, false);

			var pad = 2;

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
			var pad = 0;
			return {
				x: pad + Math.random() * (dim - pad * 2),
				y: pad + Math.random() * (dim - pad * 2),
				size: min// + Math.random() * 3// / ((count + 1) * 0.01)
			}
		}

		function drawShape(target, props, fx, renderOuput) {
			if (fx) {
				// target.shadowColor = '#fff';
				// target.shadowBlur = 2;
			}
			var overScale = 1;
			if (renderOuput) {
				overScale = 2;
			}
			var scale = 2 * props.size / bmpSize * overScale;
			var x = (props.x - props.size) * overScale;
			var y = (props.y - props.size) * overScale;

			if (state === NSW && renderOuput) {
				y += bmpSize * overScale;
			}


			target.save();
			target.translate(x, y);
			target.scale(scale, scale);
			// target.drawImage(piImage, 0, 0);
			target.font = font;
			target.fillStyle = red;
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
			min = Math.pow(1.15, (10 - Math.floor(count / 1000)));

			var iterationsPerFrame = 30;
			for (var i = 0; i < iterationsPerFrame; i++) {
				generate(true);
				generate(false);
			}
			if (count < countMax) {
				requestAnimationFrame(r);
			} else {
				min += "done!";
			}
			c0.innerHTML = [count,min].join(" ");

			// con.log(count, countMax, count / countMax);

			if (state === QLD) {
				progress("render:progress", count / countMax);
			}

			// setTimeout(r, 1000);
		}

		progressCanvas.ctx.clearRect(0, 0, dim, dim);
		progressCanvas.ctx.fillStyle = red;
		progressCanvas.ctx.fillRect(0, 0, dim, dim);
		progressCanvas.ctx.globalCompositeOperation = 'destination-out';
		progressCanvas.ctx.save();
		progressCanvas.ctx.translate(dim * x, dim * y);
		// progressCanvas.ctx.scale(outputScale, outputScale);
		progressCanvas.ctx.font = font;
		progressCanvas.ctx.fillText(score, 0, 0);
		progressCanvas.ctx.restore();
		progressCanvas.ctx.globalCompositeOperation = 'source-over';

		r();

	}

	function init() {
		con.log("ok");
		render(QLD, 52, -0.02, 0.9);
		render(NSW, 6, 0.23, 0.9);
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