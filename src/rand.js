// eslint-disable-next-line no-console
var con = console;
// from https://gist.github.com/Protonk/5367430
var instance = 0;
var rand = function() {
	// return function() {
	instance++;
	con.log("instance!!!!!!!!", instance);

	// Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
	// m is basically chosen to be large (as it is the max period)
	// and for its relationships to a and c
	var m = 4294967296;
	// a - 1 should be divisible by m's prime factors
	var a = 1664525;
	// c and m should be co-prime
	var c = 1013904223;
	var seed, z;

	var alphaToInteger = function(s){
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
		setSeed : function(val) {
			con.log("setSeed", val);
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
		getSeed : function() {
			return seed;
		},
		random : function() {
			if (z === undefined) {
				con.warn("no seed set");
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

		alphaToInteger: alphaToInteger, // for testability

		shuffle: function(array) {
			for (var i = array.length - 1; i > 0; i--) {
				var j = Math.floor(this.random() * (i + 1));
				var temp = array[i];
				array[i] = array[j];
				array[j] = temp;
			}
			return array;
		}

	};
};

rand.setSeed = function() {
	throw new Error("you're doing it wrong!");
};

if (typeof module !== "undefined") module.exports = rand;