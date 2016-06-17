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


require([
	"js/dom.js",
	"js/rand.js",
	"js/geom.js",
	"js/colours.js",
	"js/experiments.js"
	// "js/experiments_progress.js"
], function() {
		// console.log("experiments main ready dom", dom);
});