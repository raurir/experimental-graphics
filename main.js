// performance testing...
var perf = (function() {
	var stacks = {};
	return {
		start: function(id) {
			// id = id || 0;
			stacks[id] = {
				timeStart: new Date().getTime()
			};
		},
		end: function(id) {
			// id = id || 0;
			stacks[id].timeEnd = new Date().getTime();
			var time = stacks[id].timeEnd - stacks[id].timeStart;
			con.log("performance", id, time);
			stacks[id].timeProcessing = time;
		}
	}
})();

require.config({
	baseUrl: "js",
	urlArgs: "bust=" + (new Date()).getTime(),
	paths: {
		"box": "games/box",
		"creature": "creature_creator/creature",
		"ease": "../lib/robertpenner/ease",
		"noise": "../lib/josephg/noisejs",
		"Tone": "../lib/tonejs/Tone.min",
		"THREE": "../lib/three/three.min",
		"TweenMax": "../lib/greensock/TweenMax.min",
	},
});

console.log("v1.2");

require(["dom", "rand", "geom", "colours", "exps"], function(d, r, g, c, e) {
	console.log("ready");
	e();
});