(function() {
  var borderIndex, borderLength, branchrate, can, carve, check, con, ctx, d, draw, e, exits, field, frontier, getExits, getMaze, harden, init, iterations, iterativeDraw, keepDrawing, maze, ran, random, row, time, unit, x, xwide, y, yhigh, _i, _j, _k, _l;

  con = console;

  d = document;

  ctx = null;

  can = d.createElement("canvas");

  time = 0;

  xwide = 12;

  yhigh = 12;

  unit = 16;

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

  getExits = (function(_this) {
    return function(num) {
      var exits;
      if (num == null) {
        num = 2;
      }
      exits = [];
      exits[0] = Math.floor(Math.random() * borderLength);
      exits[1] = (exits[0] + Math.floor(2 + Math.random() * (borderLength - 3))) % borderLength;
      return exits;
    };
  })(this);

  borderIndex = 0;

  borderLength = xwide * 2 + yhigh * 2 - 4;

  exits = [xwide / 2, xwide + yhigh * 2 - 4 + xwide / 2];


  /*
  for i in [0..10000]
    exits = getExits(2)
     * make sure they are not the same
    con.warn("exits are the same", exits) if exits[0] is exits[1]
     * make sure they are within the acceptable range
    con.warn("ecits outside range", exits) if exits[0] > borderLength or exits[1] > borderLength
     * and make sure they are not beside each other.
    con.warn("exits beside each other", exits[0], exits[1]) if Math.abs(exits[0] - exits[1]) < 2
  con.log("test worked", exits)
   */

  for (y = _k = 0; 0 <= yhigh ? _k < yhigh : _k > yhigh; y = 0 <= yhigh ? ++_k : --_k) {
    for (x = _l = 0; 0 <= xwide ? _l < xwide : _l > xwide; x = 0 <= xwide ? ++_l : --_l) {
      if (x === 0 || y === 0 || x === xwide - 1 || y === yhigh - 1) {
        if (exits.indexOf(borderIndex) === -1) {
          field[y][x] = "#";
        } else {
          carve(y, x);
        }
        borderIndex++;
      }
    }
  }

  e = Math.E;

  branchrate = 10;

  iterations = 0;

  init = function(cb, _xwide, _yhigh) {
    can.width = xwide * unit;
    can.height = yhigh * unit;
    ctx = can.getContext("2d");
    return draw(cb);
  };

  keepDrawing = (function(_this) {
    return function() {
      return frontier.length > 2 && iterations < 1e10;
    };
  })(this);

  iterativeDraw = function() {
    var choice, index, pos;
    if (keepDrawing()) {
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
    var f, rgb, _m, _n, _o, _p, _results;
    time += 0.5;
    for (d = _m = 0; _m < 10; d = ++_m) {
      iterativeDraw();
    }
    for (y = _n = 0; 0 <= yhigh ? _n < yhigh : _n > yhigh; y = 0 <= yhigh ? ++_n : --_n) {
      for (x = _o = 0; 0 <= xwide ? _o < xwide : _o > xwide; x = 0 <= xwide ? ++_o : --_o) {
        f = field[y][x];
        rgb = f === '#' ? 50 : 150;
        ctx.fillStyle = "rgba(" + rgb + "," + rgb + "," + rgb + ",1)";
        ctx.fillRect(x * unit, y * unit, unit, unit);
      }
    }
    if (keepDrawing()) {
      console.log("drawing");
      return requestAnimationFrame(draw);
    } else {
      console.log("done");
      console.log(field);
      _results = [];
      for (y = _p = 0; 0 <= yhigh ? _p < yhigh : _p > yhigh; y = 0 <= yhigh ? ++_p : --_p) {
        _results.push((function() {
          var _q, _results1;
          _results1 = [];
          for (x = _q = 0; 0 <= xwide ? _q < xwide : _q > xwide; x = 0 <= xwide ? ++_q : --_q) {
            if (field[y][x] === '?') {
              _results1.push(field[y][x] = '#');
            } else {
              _results1.push(void 0);
            }
          }
          return _results1;
        })());
      }
      return _results;
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
