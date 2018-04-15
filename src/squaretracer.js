(function() {
  var bits, centre, con, ctx, d, drawRing, gap, init, size, time, timeLoop, timeRingDelay, timeStep, yOffset;

  con = console;

  d = document;

  bits = 20;

  gap = 16;

  size = bits * gap * 2;

  centre = size / 2;

  ctx = null;

  time = 0;

  yOffset = 0;

  timeLoop = 2000;

  timeStep = 300;

  timeRingDelay = 20;

  init = function() {
    var can;
    can = d.createElement("canvas");
    can.width = can.height = size;
    d.body.appendChild(can);
    ctx = can.getContext("2d");
    return setInterval((function(_this) {
      return function() {
        var i, _i, _results;
        time += 1;
        time %= timeLoop;
        ctx.clearRect(0, 0, size, size);
        _results = [];
        for (i = _i = 0; _i < bits; i = _i += 1) {
          _results.push(drawRing(i));
        }
        return _results;
      };
    })(this), 1000 / 60);
  };

  drawRing = function(i) {
    var dot, inOutCubic, j, perside, rgb, s, timeEnd, timeMove, timeStart, x, y, zeroToOne, _i, _j, _results;
    perside = i * 2;
    _results = [];
    for (s = _i = 0; _i < 4; s = _i += 1) {
      ctx.save();
      ctx.translate(centre, centre);
      ctx.rotate(s * Math.PI / 2);
      for (j = _j = 0; _j <= perside; j = _j += 1) {
        inOutCubic = function(t, b, c, d) {
          var tc, ts;
          ts = (t /= d) * t;
          tc = ts * t;
          return b + c * (-2 * tc + 3 * ts);
        };
        timeStart = (i + 1) * timeRingDelay;
        timeEnd = timeStart + timeStep;
        timeMove = timeEnd - timeStart;
        zeroToOne = time > timeEnd ? 1 : time > timeStart ? (time - timeStart) / timeMove : 0;
        yOffset = inOutCubic(zeroToOne, 0, gap, 1);
        x = gap * (-i - 1 / 2);
        y = gap * (-j + i - 1 / 2) + yOffset;
        rgb = 0;
        ctx.fillStyle = "rgba(" + rgb + "," + rgb + "," + rgb + ",1)";
        dot = 6;
        ctx.fillRect(x - dot / 2, y - dot / 2, dot, dot);
      }
      _results.push(ctx.restore());
    }
    return _results;
  };

  init();

}).call(this);
