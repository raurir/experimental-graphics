var con = console;
var isNode = (typeof module !== 'undefined');

var running_man = (function() {

	var sw = 600, sh = 600;

	var bmp = dom.canvas(sw,sh);

	var cx = sw / 2;
	var cy = sh / 2;

	bmp.ctx.clearRect(0, 0, sw, sh);
	bmp.ctx.fillStyle = "#0f0";
	bmp.ctx.fillRect(cx - 2, cy - 2, 4, 4);

	var experiment = {
		stage: bmp.canvas,
		inner: null,
		resize: function() {},
		init: function() {},
		kill: function() {}
	}

	if (!isNode) dispatchEvent(new CustomEvent("load:complete", {detail:experiment}));

	return experiment;

})();

// con.log(running_man);

if (isNode) module.exports = running_man;