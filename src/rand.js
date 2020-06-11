// eslint-disable-next-line no-console
var con = console;
// from https://gist.github.com/Protonk/5367430
var rand = function(isInstance) {
	var errors = 0;
	var instanceCount = 0;
	var instances = {};

	// Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
	// m is basically chosen to be large (as it is the max period)
	// and for its relationships to a and c
	var m = 4294967296;
	// a - 1 should be divisible by m's prime factors
	var a = 1664525;
	// c and m should be co-prime
	var c = 1013904223;
	var seed, z;

	var alphaToInteger = function(s) {
		var num = 0;
		for (var i = 0, il = s.length; i < il; i++) {
			num += s.charCodeAt(i) * c;
			num %= m;
		}
		// console.log("string", s.length)
		// console.log("seed", num);
		return num;
	};

	return {
		setSeed: function(val) {
			// con.log("setSeed", isInstance, val);
			var valDefined = val || val === 0;
			if (valDefined) {
				if (/[^\d]/.test(val)) {
					// con.log("setting alpha seed", val);
					val = alphaToInteger(val);
					// con.log("setting alpha now", val);
				} else {
					val = Number(val);
					// con.log("setting numeric seed", val);
				}
			} else {
				val = Math.round(Math.random() * m);
				// con.log("setting random seed", val);
			}
			z = seed = val;
		},
		getSeed: function() {
			return seed;
		},
		random: function() {
			if (z === undefined) {
				con.warn("no seed set - are you calling rand itself of an instance of rand?");
				errors++;
				if (errors > 1000) throw new Error("rand bailing because no seed");
				return null;
			}
			// define the recurrence relationship
			z = (a * z + c) % m;
			// return a float in [0, 1)
			// if z = m then z / m = 0 therefore (z % m) / m < 1 always
			return z / m;
		},

		getLastRandom: function() {
			return z / m;
		},

		getNumber: function(min, max) {
			return min + this.random() * (max - min);
		},

		getInteger: function(min, max) {
			return Math.floor(this.getNumber(min, max + 1));
		},

		shuffle: function(array) {
			for (var i = array.length - 1; i > 0; i--) {
				var j = Math.floor(this.random() * (i + 1));
				var temp = array[i];
				array[i] = array[j];
				array[j] = temp;
			}
			return array;
		},

		// for testability
		alphaToInteger: alphaToInteger,

		// instance control
		instance: function(seed) {
			instanceCount++;
			// con.log("rand.creating new instance", instanceCount);
			// this is the preferred method, call rand.instance() for a unique instance...
			// with this you can run multiple seeded randoms in parallel if needed.
			// optionally set seed
			var r = rand(true);
			if (typeof seed === "number" || typeof seed === "string") {
				r.setSeed(seed);
			}
			instances[instanceCount] = r;
			return r;
		},

		// use this to discover a seed if unknown...
		getInstanceById: function(id) {
			var randInstance = instances[id];
			if (id && randInstance) {
				return randInstance;
			}
			return "Can't find that rand instance, available ids are: " + Object.keys(instances);
		},
	};
};

if (typeof module !== "undefined") module.exports = rand(false); // export rand as a global
