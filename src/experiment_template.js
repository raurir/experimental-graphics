var isNode = (typeof module !== 'undefined');

var experiment_template = function() {
	var TAU = Math.PI * 2;
	var sw, sw, cx, cy;
	var stage = dom.canvas(1, 1);
	var ctx = stage.ctx;

 	function init(options) {
		size = options.size;
		sw = options.sw || size;
		sh = options.sh || size;
		stage.setSize(sw, sh);
		cx = sw / 2;
		cy = sh / 2;
		ctx.clearRect(0, 0, sw, sh);
		ctx.fillStyle = "#0f0";
		ctx.fillRect(cx - 20, cy - 20, 40, 40);
	}
	var experiment = {
		stage: stage.canvas,
		init: init,
	}

	progress("render:complete", stage.canvas);

	return experiment;

};
if (isNode) {
  module.exports = experiment_template();
} else {
  define("experiment_template", experiment_template);
}