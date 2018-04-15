const isNode = (typeof module !== 'undefined');

const experiment_template_babel = () => {
	const settings = {};
	const stage = dom.canvas(1, 1);
	const {canvas, ctx} = stage;
	let sw, sh, size

 	const init = (options) => {
		size = options.size;
		sw = options.sw || size;
		sh = options.sh || size;
		stage.setSize(sw, sh);
 		colours.getRandomPalette();
		render();
	}

	const render = () => {
		ctx.fillRect(0, 0, sw, sh);

		const points = [];
		while (points.length < 4) {
			points.push({
				x: rand.getNumber(.1, .9),
				y: rand.getNumber(.1, .9),
			});
		};

		const intersects = geom.intersectionBetweenPoints.apply(null, points);
		if (intersects) {
			points.push(intersects);
		}
		points.forEach(p => {
			ctx.fillStyle = colours.getNextColour();
			ctx.beginPath();
			ctx.drawCircle(p.x * sw, p.y * sh, 15);
			ctx.fill();
		});

	}

	const update = (settings) => {
		init({size, settings});
	}

	progress("render:complete", canvas);

	return {
		init,
		render,
		settings,
		stage: canvas,
		update,
	};

};

if (isNode) {
  module.exports = experiment_template_babel();
} else {
  define("experiment_template_babel", experiment_template_babel);
}