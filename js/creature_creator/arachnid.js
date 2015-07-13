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
	"femur1": {
		"range": 0.2,
		"baserot": -2,
		"length": 90,
		"offset": 0
	},
	"tibia1": {
		"range": 0.2,
		"baserot": 5.433,
		"length": 90,
		"offset": 1.6
	},
	"tarsus1": {
		"range": 0.7,
		"baserot": 0.4,
		"length": 90,
		"offset": 1.6
	},
	"femur2": {
		"range": 0.48,
		"baserot": 1.663,
		"length": 90,
		"offset": 4.103
	},
	"tibia2": {
		"range": 0.85,
		"baserot": 0.85,
		"length": 114,
		"offset": 3.289
	},
	"tarsus2": {
		"range": 0.48,
		"baserot": 0.7020000000000001,
		"length": 91,
		"offset": 5.581
	}
};



	var spider = [
		{name: "body", parent: null, movement: spiderlimbs.body, phase: 0},

		{name: "femur1", parent: "body", movement: spiderlimbs.femur1, phase: 0},
		{name: "tibia1", parent: "femur1", movement: spiderlimbs.tibia1, phase: 0},
		{name: "tarsus1", parent: "tibia1", movement: spiderlimbs.tarsus1, phase: 0},

		{name: "femur2", parent: "body", movement: spiderlimbs.femur2, phase: 0}, //Math.PI},
		{name: "tibia2", parent: "femur2", movement: spiderlimbs.tibia2, phase: 0}, //Math.PI},
		{name: "tarsus2", parent: "tibia2", movement: spiderlimbs.tarsus2, phase: 0}, //Math.PI},

		// {name: "femur3", parent: "body", movement: spiderlimbs.femur2, phase: 0},
		// {name: "tibia3", parent: "femur3", movement: spiderlimbs.tibia2, phase: 0},

		// {name: "femur4", parent: "body", movement: spiderlimbs.femur2, phase: Math.PI},
		// {name: "tibia4", parent: "femur4", movement: spiderlimbs.tibia2, phase: Math.PI},

		// {name: "femur5", parent: "body", movement: spiderlimbs.femur3, phase: Math.PI},
		// {name: "tibia5", parent: "femur5", movement: spiderlimbs.tibia3, phase: Math.PI},

		// {name: "femur6", parent: "body", movement: spiderlimbs.femur6, phase: Math.PI},
		// {name: "tibia6", parent: "femur6", movement: spiderlimbs.tibia6, phase: Math.PI},

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

