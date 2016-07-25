var perlin_noise = function() {

  var timer=((c)=>{var t={},f=()=>new Date().getTime();return {start:(k)=>{t[k]=f();},end:(k)=>{c.log(k,f()-t[k]);}};})(console);

  const pixel = 10;
  const w = 60;
  const h = 60;

  const M = Math;
  const r = M.random;

  const c = document.createElement("canvas");
  c.width = w * pixel;
  c.height = h * pixel;
  const d = c.getContext('2d');

  const logger = document.createElement("div");
  document.body.appendChild(logger);

  /*
  can't remember where this simplex / perlin noise algorithm came from...
  ported a few years ago for a js1k compo, the idea never worked.
  but the noise did. thanks to "anonymous soldier" who make the original!
  */

  function noise(w, h) {
    var s, u, v;
    var n = function(){
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
    }

    function z(uIndex, k, t, j) {
      var F = .5 - t * t - j * j;
      try {
        var zz = (F < 0) ? 0 : M.pow(F, 4) * (s[k%8][0] * t + s[k%8][1] * j);
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

    function cycle(time) {
      for (var i = 0; i < 8; i++) {
        s[i][0] = Math.sin(v[i][0] * time);
        s[i][1] = Math.cos(v[i][1] * time);
      }
      var channel = [];
      for (var i = 0, il = w * h; i < il; i++){
        var xp = (i % w) * 0.01;
        var yp = Math.floor(i / w) * 0.01;
        channel.push(q(xp, yp) + 0.5);
      }
      return channel;
    }

    n();

    return {
      cycle: cycle
    }

  }

  var iterations = 0;
  var channelRed = noise(w, h);
  var channelGreen = noise(w, h);
  var channelBlue = noise(w, h);

  var min = 1000;
  var max = -1000;


  function drawIt(time) {
    var t = time * 0.005;
    var red = channelRed.cycle(t);
    var green = channelGreen.cycle(t);
    var blue = channelBlue.cycle(t);

    for (var i = 0, il = w * h; i < il; i++){
      var xp = i % w;
      var yp = Math.floor(i / w);
      // d.save();
      // d.setTransform( 1, 0, 0, 1, 0, 0 );
      var r = ~~(red[i] * 255),
        g = ~~(green[i] * 255),
        b = ~~(blue[i] * 255);
      d.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
      d.fillRect(xp * pixel, yp * pixel, pixel, pixel);

      min = M.min(r, min); max = M.max(r, max);
      min = M.min(g, min); max = M.max(g, max);
      min = M.min(b, min); max = M.max(b, max);

      /*
      sc = Math.sqrt( red[i] * red[i] + blue[i] * blue[i] ) * 0.00001;
      rot = (Math.atan( blue[i] / red[i] ) ) + (red[i] >= 0 ? 0 :  Math.PI);
      d.setTransform(
        sc,
        Math.sin(rot),
        Math.sin(Math.PI + rot),
        sc,
        (xp+0.5) * pixel, // + red[i] * 0.02,
        (yp+0.5) * pixel // + blue[i] * 0.02
      );
      d.fillStyle = "rgba( 255, 255, 255, 0.8 )";
      d.beginPath();
      d.moveTo( -2, 0 );
      d.lineTo( 0, 10 );
      d.lineTo(  2, 0 );
      d.closePath();
      d.fill();
      */
      // d.restore();
    }
    // timer.end("render");
    // timer.end("drawIt");

    logger.innerHTML = min + '<br>' +  max;

    requestAnimationFrame(drawIt);
  };

  return {
    init: () => {
      drawIt(0);
    },
    stage: c
  };

};

define("perlin_noise", perlin_noise);