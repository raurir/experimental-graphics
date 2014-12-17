(function() {
  var bits, can, centre, con, ctx, d, draw, gap, init, oscs, seeds, size, time;

  con = console;

  d = document;

  bits = 200;

  gap = 2;

  size = bits * gap;

  centre = size / 2;

  ctx = null;

  can = null;

  time = 0;

  oscs = 4;

  seeds = [];

  init = function() {
    var i, _i;
    can = d.createElement("canvas");
    can.width = can.height = size;
    d.body.appendChild(can);
    ctx = can.getContext("2d");
    for (i = _i = 0; _i < oscs; i = _i += 1) {
      seeds[i] = Math.pow(2, i + 1) + (Math.random() * 2 - 1) * 10;
    }
    con.log(seeds);
    return draw();
  };

  draw = function() {
    var i, rgb, v, x, y, _i, _j;
    can.width = can.width;
    time += 1;
    for (x = _i = 0; _i < bits; x = _i += 1) {
      v = 0;
      for (i = _j = 0; _j < oscs; i = _j += 1) {
        v += Math.sin((time + x) * seeds[i] * 0.01) / Math.pow(2, i + 1);
      }
      y = centre + v * centre / oscs;
      rgb = 100;
      ctx.fillStyle = "rgba(" + rgb + "," + rgb + "," + rgb + ",0.4)";
      ctx.fillRect(x * gap, y, 10, 10);
    }
    return requestAnimationFrame(draw);
  };

  init();

}).call(this);
