var con = console;
// from https://gist.github.com/Protonk/5367430
var rand = (function() {
  // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
      // m is basically chosen to be large (as it is the max period)
      // and for its relationships to a and c
  var m = 4294967296,
      // a - 1 should be divisible by m's prime factors
      a = 1664525,
      // c and m should be co-prime
      c = 1013904223,
      seed, z;

  var alphaToInteger = function(s){
    var num = 0;
    for (var i = 0, il = s.length; i < il; i++) {
      num += s.charCodeAt(i) * c;
      num %= m;
    };
    // console.log("string", s.length)
    // console.log("seed", num);
    return num;
  }

  return {
    setSeed : function(val) {
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
        console.warn("no seed set");
        return null
      };
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

    alphaToInteger: alphaToInteger // for testability

  };
}());

if (typeof module !== 'undefined') module.exports = rand;