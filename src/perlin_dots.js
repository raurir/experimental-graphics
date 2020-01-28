var perlin_dots = function(perlin) {
	const pixel = 20;
	const w = 30;
	const h = 30;
	const sw = w * pixel;
	const sh = h * pixel;

	const c = dom.canvas(sw, sh);
	const d = c.ctx;

	let dots = [];
	const numDots = 1e2;

	// const logger = document.createElement("div");
	// document.body.appendChild(logger);

	// var iterations = 0;
	var channelRed = perlin.noise(w, h);
	var channelGreen = perlin.noise(w, h);
	var channelBlue = perlin.noise(w, h);

	var scale = 0.03;
	var t = 1;
	var red = channelRed.cycle(t, scale);
	// var green = channelGreen.cycle(t, scale);
	// var blue = channelBlue.cycle(t, scale);

	const genClamp = (min, max) => (val) => {
		if (val < min) return min;
		if (val > max) return max;
		return val;
	};

	const drawFrame = (time) => {
		requestAnimationFrame(drawFrame);
		drawColours();
		drawDots();
		// console.log("d", dots[0]);
	};

	function drawColours(time) {
		// var t = time * 0.005;

		for (var i = 0, il = w * h; i < il; i++) {
			var xp = i % w;
			var yp = Math.floor(i / w);
			// d.save();
			// d.setTransform( 1, 0, 0, 1, 0, 0 );
			var r = ~~(red[i] * 255),
				g = ~~(red[i] * 255),
				b = ~~(red[i] * 255);
			d.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
			d.fillRect(xp * pixel, yp * pixel, pixel, pixel);

			// min = M.min(r, min);
			// max = M.max(r, max);
			// min = M.min(g, min);
			// max = M.max(g, max);
			// min = M.min(b, min);
			// max = M.max(b, max);
		}

		// console.log(dots[0]);
		// logger.innerHTML = min + "<br>" + max;

		// requestAnimationFrame(drawColours);
	}
	const drawDots = () => {
		const d = dots.map((dotA) => {
			const pressure = {
				x: 0,
				y: 0,
			};
			const pa = dotA.position();

			dots.forEach((dotB) => {
				if (dotA === dotB) {
					return;
				}
				const pb = dotB.position();
				const dx = pa.x - pb.x;
				const dy = pa.y - pb.y;
				const d = Math.hypot(dx, dy);
				if (d < 50) {
					pressure.x += (50 - Math.abs(dx)) * (dx < 0 ? -1 : 1) * 0.01;
					pressure.y += (50 - Math.abs(dy)) * (dy < 0 ? -1 : 1) * 0.01;
				}
			});
			dotA.move(pressure);
			dotA.draw();
			return dotA;
		});
		dots = d;
	};

	const generateDot = () => {
		let x = Math.random() * sw;
		let y = Math.random() * sh;
		const draw = () => {
			d.fillStyle = "#000";
			d.fillRect(x, y, 2, 2);
		};
		const move = (distance) => {
			x += distance.x;
			y += distance.y;
		};
		const position = () => ({x, y});
		return {
			position,
			draw,
			move,
		};
	};

	return {
		init: () => {
			for (var i = 0; i < numDots; i++) {
				dots.push(generateDot());
			}
			drawFrame();
		},
		stage: c.canvas,
	};
};

define("perlin_dots", ["perlin"], perlin_dots);
