/*
can't remember where this simplex / perlin noise algorithm came from...
ported a few years ago for a js1k compo, the idea never worked.
but the noise did. thanks to "anonymous soldier" who made the original!
*/

var perlin = function() {
  function noise(w, h) {
    var r = Math.random;
    var s, h, s, u, v;
    function init(){
      // con.log("init");
      s = [];
      u = [];
      v = [];
      for (var i = 0; i < 8; i++) {
        // s[i] = [r()*3-1, r()*3-1]
        s.push([]);
        v.push([r(), r()]);
        // v.push([r(), 0]);
      }
      for (i = 0; i < 262; i++) {
        u.push(~~(r() * 256));
      }
      return this;
    }

    function z(uIndex, k, t, j) {
      var F = .5 - t * t - j * j;
      try {
        var zz = (F < 0) ? 0 : Math.pow(F, 4) * (s[k%8][0] * t + s[k%8][1] * j);
      } catch(err) {
        con.log(err, k, uIndex);
      }
      return zz;
    }

    function q(k, t) {
      var e = .2;
      var a = (k + t) * .3;
      var m = ~~(k + a);
      var b = ~~(t + a);
      a = (m + b) * e;

      var c = k - (m - a);
      var j = t - (b - a);

      var C = c > j;

      var u0 = m + u[b];
      var u1 = m + C + u[b + !C];
      var u2 = m + 1 + u[b + 1];
      var out = 38 * (
        z(u0, u[u0], c, j) +
        z(u1, u[u1], c - C + e, j - !C + e) +
        z(u2, u[u2], c - .6, j - .6)
      );

      var clamp = 0.2;
      // out = out > clamp ? ( out -= clamp ) : ( out < - clamp ? ( out += clamp ) : out = 0 );
      return out;

    };

    function cycle(time, scale) {
      for (var i = 0; i < 8; i++) {
        s[i][0] = Math.sin(v[i][0] * time);
        s[i][1] = Math.cos(v[i][1] * time);
      }
      var channel = [];
      for (var i = 0, il = w * h; i < il; i++){
        var xp = (i % w) * scale;
        var yp = Math.floor(i / w) * scale
        channel.push(q(xp, yp) + 0.5);
      }
      return channel;
    }

    init();

    return {
      cycle: cycle
    }
  }

  return {
    noise: noise
  }

}

define("perlin", perlin);