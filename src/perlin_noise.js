var perlin_noise = function(perlin) {
	const pixel = 20;
	const w = 30;
	const h = 30;

	// const M = Math;
	// const r = M.random;

	const c = dom.canvas(w * pixel, h * pixel);
	const d = c.ctx;

	// const logger = document.createElement("div");
	// document.body.appendChild(logger);

	// var iterations = 0;
	var channelRed = perlin.noise(w, h);
	var channelGreen = perlin.noise(w, h);
	var channelBlue = perlin.noise(w, h);

	// var min = 1000;
	// var max = -1000;

	function drawColours(time) {
		var t = time * 0.005;
		var scale = 0.01;
		var red = channelRed.cycle(t, scale);
		var green = channelGreen.cycle(t, scale);
		var blue = channelBlue.cycle(t, scale);

		for (var i = 0, il = w * h; i < il; i++) {
			var xp = i % w;
			var yp = Math.floor(i / w);
			// d.save();
			// d.setTransform( 1, 0, 0, 1, 0, 0 );
			var r = ~~(red[i] * 255),
				g = ~~(green[i] * 255),
				b = ~~(blue[i] * 255);
			d.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
			d.fillRect(xp * pixel, yp * pixel, pixel, pixel);

			// min = M.min(r, min);
			// max = M.max(r, max);
			// min = M.min(g, min);
			// max = M.max(g, max);
			// min = M.min(b, min);
			// max = M.max(b, max);
		}

		// logger.innerHTML = min + "<br>" + max;

		requestAnimationFrame(drawColours);
	}

	function drawCircles(time) {
		d.clearRect(0, 0, w * pixel, h * pixel);
		var t = time * 0.005;
		var scale = 0.01;
		var red = channelRed.cycle(t, scale);
		var green = channelGreen.cycle(t, scale);
		var blue = channelBlue.cycle(t, scale);

		for (var i = 0, il = w * h; i < il; i++) {
			var xp = i % w;
			var yp = Math.floor(i / w);
			// d.save();
			// d.setTransform( 1, 0, 0, 1, 0, 0 );
			// var r = ~~(red[i] * 255),
			// 	g = ~~(green[i] * 255),
			// 	b = ~~(blue[i] * 255);
			// d.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
			d.fillStyle = "#000";
			d.beginPath();
			// d.moveTo(xp, yp);
			d.drawCircle(xp * pixel, yp * pixel, (red[i] * pixel) / 2);
			d.closePath();
			d.fill();

			d.fillStyle = "#00a";
			d.beginPath();
			// d.moveTo(xp, yp);
			d.drawCircle((xp + 0.5) * pixel, yp * pixel, (blue[i] * pixel) / 4);
			d.closePath();
			d.fill();
		}

		requestAnimationFrame(drawCircles);
	}

	return {
		init: () => {
			drawCircles(0);
		},
		stage: c.canvas,
	};
};

// define("perlin_noise", perlin_noise);
define("perlin_noise", ["perlin"], perlin_noise);
