var con = console;
var isNode = (typeof module !== "undefined");

// if (isNode) {
// 	var dom = require("./dom.js");
// 	var fs = require("fs");
// 	var creature_creator = require("./creature_creator/creature_creator.js");
// }

var creature = function() {

	// con.log("creature constructor");

	var sw = 400;
	var sh = 400;

	var bmp = dom.canvas(sw, sh);
	var ctx = bmp.ctx;

	// require(["creature_creator", "human"], function(creature_creator, human) {
	// 	creature_creator.init(bmp, ctx, human.body, human.limbs);
	// });

	require.config({
		paths: {
			"arachnid": "creature_creator/arachnid",
      "creature_creator": "creature_creator/creature_creator",
      "human": "creature_creator/human",
		},
	});
	// require(["creature_creator", "arachnid"], function(creature_creator, arachnid) {
		// creature_creator.init(bmp, ctx, arachnid.body, arachnid.limbs);
	require(["creature_creator", "human"], function(creature_creator, human) {
		creature_creator.init(bmp, ctx, human.body, human.limbs);
	});

	var experiment = {
		stage: bmp.canvas,
		inner: null,
		resize: function() {},
		init: function() {
			// con.log("creature init");
			// con.log(creature_creator);
		},
		kill: function() {}
	}

	return experiment;
};

if (isNode) {
	module.exports = creature();
} else {
	define("creature", creature);
}