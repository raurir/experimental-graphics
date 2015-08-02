var con = console;
var isNode = (typeof module !== 'undefined');

var arachnid = function() {

var spiderlimbs = {
	"body": {
		"range": 0,
		"baserot": 0,
		"length": 0,
		"offset": 0
	},



"a2": {
		"range": 0,
		"baserot": 1.959,
		"length": 90,
		"offset": 1.368
	},
	"b2": {
		"range": 0.333,
		"baserot": 1.22,
		"length": 105,
		"offset": 0.7
	},
	"c2": {
		"range": 0.4,
		"baserot": 0.333,
		"length": 53,
		"offset": 4.99
	},




	"a1": {
		"range": 0.2,
		"baserot": -2,
		"length": 90,
		"offset": 0
	},
	"b1": {
		"range": 0.2,
		"baserot": 5.433,
		"length": 90,
		"offset": 1.6
	},
	"c1": {
		"range": 0.7,
		"baserot": 0.4,
		"length": 53,
		"offset": 1.6
	},


	"a3": {
		"range": 0.7020000000000001,
		"baserot": 2.994,
		"length": 46,
		"offset": 2.846
	},
	"b3": {
		"range": 0.333,
		"baserot": 0,
		"length": 58,
		"offset": 5.655
	},
	"c3": {
		"range": 0.48,
		"baserot": 5.803,
		"length": 55,
		"offset": 3.807
	},



};


	// femur tibia tarsus 

	var spider = [
		{name: "body", parent: null, movement: spiderlimbs.body, phase: 0},

		{name: "a1", parent: "body", movement: spiderlimbs.a1, phase: 0},
		{name: "b1", parent: "a1", movement: spiderlimbs.b1, phase: 0},
		{name: "c1", parent: "b1", movement: spiderlimbs.c1, phase: 0},

		{name: "a2", parent: "body", movement: spiderlimbs.a2, phase: 0},
		{name: "b2", parent: "a2", movement: spiderlimbs.b2, phase: 0},
		{name: "c2", parent: "b2", movement: spiderlimbs.c2, phase: 0},

		{name: "a3", parent: "body", movement: spiderlimbs.a3, phase: 0}, //Math.PI},
		{name: "b3", parent: "a3", movement: spiderlimbs.b3, phase: 0}, //Math.PI},
		{name: "c3", parent: "b3", movement: spiderlimbs.c3, phase: 0}, //Math.PI},

		// {name: "a3", parent: "body", movement: spiderlimbs.a2, phase: 0},
		// {name: "b3", parent: "a3", movement: spiderlimbs.b2, phase: 0},

		// {name: "a4", parent: "body", movement: spiderlimbs.a2, phase: Math.PI},
		// {name: "b4", parent: "a4", movement: spiderlimbs.b2, phase: Math.PI},

		// {name: "a5", parent: "body", movement: spiderlimbs.a3, phase: Math.PI},
		// {name: "b5", parent: "a5", movement: spiderlimbs.b3, phase: Math.PI},

		// {name: "a6", parent: "body", movement: spiderlimbs.a6, phase: Math.PI},
		// {name: "b6", parent: "a6", movement: spiderlimbs.b6, phase: Math.PI},

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

