"use strict";

var isNode = typeof module !== 'undefined';

var experiment_template_babel = function experiment_template_babel() {
	var settings = {};
	var stage = dom.canvas(1, 1);
	var canvas = stage.canvas,
	    ctx = stage.ctx;

	var sw = void 0,
	    sh = void 0,
	    size = void 0;

	var init = function init(options) {
		size = options.size;
		sw = options.sw || size;
		sh = options.sh || size;
		stage.setSize(sw, sh);
		colours.getRandomPalette();
		render();
	};

	var render = function render() {
		ctx.fillRect(0, 0, sw, sh);

		var points = [];
		while (points.length < 4) {
			points.push({
				x: rand.getNumber(.1, .9),
				y: rand.getNumber(.1, .9)
			});
		};

		var intersects = geom.intersectionBetweenPoints.apply(null, points);
		if (intersects) {
			points.push(intersects);
		}
		points.forEach(function (p) {
			ctx.fillStyle = colours.getNextColour();
			ctx.beginPath();
			ctx.drawCircle(p.x * sw, p.y * sh, 15);
			ctx.fill();
		});
	};

	var update = function update(settings) {
		init({ size: size, settings: settings });
	};

	progress("render:complete", canvas);

	return {
		init: init,
		render: render,
		settings: settings,
		stage: canvas,
		update: update
	};
};

if (isNode) {
	module.exports = experiment_template_babel();
} else {
	define("experiment_template_babel", experiment_template_babel);
}
