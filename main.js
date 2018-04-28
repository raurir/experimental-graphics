// keep this file es5!
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

var isDev = window.location.hostname === 'exp.local' || window.location.search.includes('src');

require.config({
	baseUrl: isDev ? 'es5' : 'jsmin',
	urlArgs: "bust=" + (isDev ? Math.random() : "{HASH}"),
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

require(["dom", "rand", "geom", "colours", "exps"], function(d, r, g, c, e) {
	console.log("v{VERSION} loaded. isDev:" + isDev);
	e();
});