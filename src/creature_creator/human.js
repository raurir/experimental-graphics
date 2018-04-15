var con = console;
var isNode = (typeof module !== 'undefined');

/* human structure

body
	torso
		bicep1
			forearm1
		bicep2
			forearm2
	thigh1
		calf1
	thigh2
		calf2
*/

function human() {
	var limbs = {
		"body": {
			"range": 0,
			"baserot": 0,
			"length": 0,
			"offset": 0
		},
		"torso": {
			"range": 0,
			"baserot": 3.141592653589793,
			"length": 100,
			"offset": 0
		},
		"thigh": {
			"range": 1,
			"baserot": 0.3,
			"length": 90,
			"offset": 0
		},
		"calf": {
			"range": -0.6,
			"baserot": -0.9,
			"length": 90,
			"offset": 1.6
		},
		"foot": {
			"range": 0.5,
			"baserot": 1.4,
			"length": 25,
			"offset": 0
		},
		"bicep": {
			"range": 0.9,
			"baserot": -0.5,
			"length": 70,
			"offset": 0
		},
		"forearm": {
			"range": 1.5,
			"baserot": 1.5,
			"length": 60,
			"offset": -0.3
		}
	};

	var iceskating = {"body":{"range":0,"baserot":0,"length":0,"offset":0},"torso":{"range":0,"baserot":2.5,"length":100,"offset":0},"thigh":{"range":0.5,"baserot":0.3,"length":100,"offset":0},"calf":{"range":-0.8,"baserot":-0.7,"length":110,"offset":2.9},"foot":{"range":0,"baserot":1.6,"length":40,"offset":0},"bicep":{"range":1.6,"baserot":-0.3,"length":85,"offset":0},"forearm":{"range":1.5,"baserot":1,"length":70,"offset":-0.3}};
	// limbs = iceskating;

	var human = [
		{name: "body", parent: null, movement: limbs.body, phase: 0},
		{name: "torso", parent: "body", movement: limbs.torso, phase: 0},
		{name: "thigh1", parent: "body", movement: limbs.thigh, phase: 0},
		{name: "calf1", parent: "thigh1", movement: limbs.calf, phase: 0},
		{name: "foot1", parent: "calf1", movement: limbs.foot, phase: 0},
		{name: "thigh2", parent: "body", movement: limbs.thigh, phase: Math.PI},
		{name: "calf2", parent: "thigh2", movement: limbs.calf, phase: Math.PI},
		{name: "foothigh2", parent: "calf2", movement: limbs.foot, phase: Math.PI},
		{name: "bicep1", parent: "torso", movement: limbs.bicep, phase: 0},
		{name: "forearm1", parent: "bicep1", movement: limbs.forearm, phase: 0},
		{name: "bicep2", parent: "torso", movement: limbs.bicep, phase: Math.PI},
		{name: "forearm2", parent: "bicep2", movement: limbs.forearm, phase: Math.PI},
	];

	return {
		body: human,
		limbs: limbs
	}

};

if (isNode) {
  module.exports = human();
} else {
  define("human", human);
}
