(function() {
  var branchrate, can, carve, check, con, ctx, d, draw, e, field, frontier, getMaze, harden, init, iterations, iterativeDraw, maze, ran, random, row, time, unit, x, xchoice, xwide, y, ychoice, yhigh, _i, _j;

  con = console;

  d = document;

  ctx = null;

  can = d.createElement("canvas");

  time = 0;

  xwide = 30;

  yhigh = 30;

  ran = Math.random();

  random = {
    randint: function(min, max) {
      return parseInt(min + Math.random() * (max - min));
    },
    shuffle: function(array) {
      var i, m, t;
      m = array.length;
      while (m) {
        i = Math.floor(Math.random() * m--);
        t = array[m];
        array[m] = array[i];
        array[i] = t;
      }
      return array;
    }
  };

  field = [];

  for (y = _i = 0; 0 <= yhigh ? _i < yhigh : _i > yhigh; y = 0 <= yhigh ? ++_i : --_i) {
    row = [];
    for (x = _j = 0; 0 <= xwide ? _j < xwide : _j > xwide; x = 0 <= xwide ? ++_j : --_j) {
      row.push('?');
    }
    field.push(row);
  }

  frontier = [];

  carve = function(y, x) {
    var extra, i, _k, _len, _results;
    extra = [];
    field[y][x] = '.';
    if (x > 0) {
      if (field[y][x - 1] === '?') {
        field[y][x - 1] = ',';
        extra.push([y, x - 1]);
      }
    }
    if (x < xwide - 1) {
      if (field[y][x + 1] === '?') {
        field[y][x + 1] = ',';
        extra.push([y, x + 1]);
      }
    }
    if (y > 0) {
      if (field[y - 1][x] === '?') {
        field[y - 1][x] = ',';
        extra.push([y - 1, x]);
      }
    }
    if (y < yhigh - 1) {
      if (field[y + 1][x] === '?') {
        field[y + 1][x] = ',';
        extra.push([y + 1, x]);
      }
    }
    extra = random.shuffle(extra);
    _results = [];
    for (_k = 0, _len = extra.length; _k < _len; _k++) {
      i = extra[_k];
      _results.push(frontier.push(i));
    }
    return _results;
  };

  harden = function(y, x) {
    return field[y][x] = '#';
  };

  check = function(y, x, nodiagonals) {
    var edgestate;
    if (nodiagonals == null) {
      nodiagonals = true;
    }

    /*
    Test the cell at y,x: can this cell become a space?
    true indicates it should become a space,
    false indicates it should become a wall.
     */
    edgestate = 0;
    if (x > 0) {
      if (field[y][x - 1] === '.') {
        edgestate += 1;
      }
    }
    if (x < xwide - 1) {
      if (field[y][x + 1] === '.') {
        edgestate += 2;
      }
    }
    if (y > 0) {
      if (field[y - 1][x] === '.') {
        edgestate += 4;
      }
    }
    if (y < yhigh - 1) {
      if (field[y + 1][x] === '.') {
        edgestate += 8;
      }
    }
    if (nodiagonals) {
      if (edgestate === 1) {
        if (x < xwide - 1) {
          if (y > 0) {
            if (field[y - 1][x + 1] === '.') {
              return false;
            }
          }
          if (y < yhigh - 1) {
            if (field[y + 1][x + 1] === '.') {
              return false;
            }
          }
        }
        return true;
      } else if (edgestate === 2) {
        if (x > 0) {
          if (y > 0) {
            if (field[y - 1][x - 1] === '.') {
              return false;
            }
          }
          if (y < yhigh - 1) {
            if (field[y + 1][x - 1] === '.') {
              return false;
            }
          }
        }
        return true;
      } else if (edgestate === 4) {
        if (y < yhigh - 1) {
          if (x > 0) {
            if (field[y + 1][x - 1] === '.') {
              return false;
            }
          }
          if (x < xwide - 1) {
            if (field[y + 1][x + 1] === '.') {
              return false;
            }
          }
        }
        return true;
      } else if (edgestate === 8) {
        if (y > 0) {
          if (x > 0) {
            if (field[y - 1][x - 1] === '.') {
              return false;
            }
          }
          if (x < xwide - 1) {
            if (field[y - 1][x + 1] === '.') {
              return false;
            }
          }
        }
        return true;
      }
      return false;
    } else {
      if ([1, 2, 4, 8].indexOf(edgestate) !== -1) {
        return true;
      }
      return false;
    }
  };

  xchoice = random.randint(0, xwide - 1);

  ychoice = random.randint(0, yhigh - 1);

  carve(ychoice, xchoice);

  e = Math.E;

  branchrate = 20;

  iterations = 0;

  unit = 4;

  init = function(cb, _xwide, _yhigh) {
    can.width = xwide * unit;
    can.height = yhigh * unit;
    ctx = can.getContext("2d");
    return draw(cb);
  };

  iterativeDraw = function() {
    var choice, index, pos;
    if (frontier.length && iterations < 1e10) {
      pos = Math.random();
      pos = Math.pow(pos, Math.pow(e, -branchrate));
      if (pos >= 1 || pos < 0) {
        console.log(pos);
      }
      index = Math.floor(pos * frontier.length);
      choice = frontier[index];
      if (check(choice[0], choice[1])) {
        carve(choice[0], choice[1]);
      } else {
        harden(choice[0], choice[1]);
      }
      frontier.splice(index, 1);
    }
    return iterations++;
  };

  draw = function(cb) {
    var rgb, _k, _l, _m;
    time += 0.5;
    for (d = _k = 0; _k < 1000; d = ++_k) {
      iterativeDraw();
    }
    for (y = _l = 0; 0 <= yhigh ? _l < yhigh : _l > yhigh; y = 0 <= yhigh ? ++_l : --_l) {
      for (x = _m = 0; 0 <= xwide ? _m < xwide : _m > xwide; x = 0 <= xwide ? ++_m : --_m) {
        if (field[y][x] === "#") {
          rgb = 20;
          ctx.fillStyle = "rgba(" + rgb + "," + rgb + "," + rgb + ",1)";
          ctx.fillRect(x * unit, y * unit, unit, unit);
        }
      }
    }
    if (frontier.length) {
      return requestAnimationFrame(draw);
    } else {
      console.log("done");
      return typeof cb === "function" ? cb() : void 0;
    }
  };

  getMaze = (function(_this) {
    return function() {
      return field;
    };
  })(this);

  maze = {
    getMaze: getMaze,
    init: init,
    stage: can,
    resize: function() {
      return console.log("resize maze not implemented!");
    },
    kill: function() {
      return console.log("kill maze not implemented!");
    }
  };

  window.maze = maze;

  define("maze", window.maze);

}).call(this);
