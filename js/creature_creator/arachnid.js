var con = console;
var isNode = (typeof module !== 'undefined');

var arachnid = function() {

	var spiderlimbs ={
		"body": {
			"range": 0,
			"baserot": 0,
			"length": 0,
			"offset": 0
		},
		"thigh": {
			"range": 0.2,
			"baserot": -2,
			"length": 90,
			"offset": 0
		},
		"calf": {
			"range": 0.2,
			"baserot": -0.2,
			"length": 90,
			"offset": 1.6
		},
		"thigh2": {
			"range": 0.2,
			"baserot": 2,
			"length": 90,
			"offset": 0
		},
		"calf2": {
			"range": -0.2,
			"baserot": -0.2,
			"length": 90,
			"offset": 1.6
		},
		"thigh3": {
			"range": 0.2,
			"baserot": 1.65,
			"length": 130,
			"offset": 0.5
		},
		"calf3": {
			"range": -0.5,
			"baserot": 1,
			"length": 100,
			"offset": 1.8
		},
		"thigh6": {
			"range": -1,
			"baserot": 3,
			"length": 40,
			"offset": 0
		},
		"calf6": {
			"range": -0.2,
			"baserot": 1,
			"length": 60,
			"offset": -1.5
		}
	};

	var spider = [
		{name: "body", parent: null, movement: spiderlimbs.body, phase: 0},
		{name: "thigh1", parent: "body", movement: spiderlimbs.thigh, phase: 0},
		{name: "calf1", parent: "thigh1", movement: spiderlimbs.calf, phase: 0},
		{name: "thigh2", parent: "body", movement: spiderlimbs.thigh, phase: Math.PI},
		{name: "calf2", parent: "thigh2", movement: spiderlimbs.calf, phase: Math.PI},
		{name: "thigh3", parent: "body", movement: spiderlimbs.thigh2, phase: 0},
		{name: "calf3", parent: "thigh3", movement: spiderlimbs.calf2, phase: 0},
		{name: "thigh4", parent: "body", movement: spiderlimbs.thigh2, phase: Math.PI},
		{name: "calf4", parent: "thigh4", movement: spiderlimbs.calf2, phase: Math.PI},

		{name: "thigh5", parent: "body", movement: spiderlimbs.thigh3, phase: Math.PI},
		{name: "calf5", parent: "thigh5", movement: spiderlimbs.calf3, phase: Math.PI},


		{name: "thigh6", parent: "body", movement: spiderlimbs.thigh6, phase: Math.PI},
		{name: "calf6", parent: "thigh6", movement: spiderlimbs.calf6, phase: Math.PI},

	]

	return {
		body: spider,
		limbs: spiderlimbs
	}

};

if (isNode) {
  module.exports = arachnid();
} else {
  define("arachnid", arachnid);
}