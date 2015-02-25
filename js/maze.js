(function() {
  var bits, branchrate, can, carve, centre, check, choice, con, ctx, d, draw, e, field, frontier, gap, harden, init, oscs, pos, random, row, s, seeds, size, time, x, xchoice, xwide, y, ychoice, yhigh, _i, _j, _k, _l, _m, _n;

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

  random = {
    randint: function(min, max) {
      return ~~(min + (max - min));
    },
    shuffle: function(arr) {
      return arr;
    },
    random: Math.random
  };

  xwide = 10;

  yhigh = 10;

  field = [];

  for (y = _i = 0; 0 <= yhigh ? _i < yhigh : _i > yhigh; y = 0 <= yhigh ? ++_i : --_i) {
    row = [];
    for (x = _j = 0; 0 <= xwide ? _j < xwide : _j > xwide; x = 0 <= xwide ? ++_j : --_j) {
      row.push('?');
    }
    field.push(row);
  }

  con.log(field);

  frontier = [];

  carve = function(y, x) {
    var extra;
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
    return frontier.push(extra);
  };

  harden = function(y, x) {
    return field[y][x] = '#';
  };

  check = function(y, x, nodiagonals) {
    var edgestate;
    if (nodiagonals == null) {
      nodiagonals = true;
    }
    con.log("check", y, x);

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
      if (edgestate.indexOf(1) || edgestate.indexOf(2) || edgestate.indexOf(4) || edgestate.indexOf(5)) {
        return true;
      }
      return false;
    }
  };

  xchoice = random.randint(0, xwide - 1);

  ychoice = random.randint(0, yhigh - 1);

  carve(ychoice, xchoice);

  branchrate = 0;

  e = Math.E;

  while (frontier.length) {
    con.log(frontier);
    pos = random.random();
    pos = pos * (e - branchrate);
    choice = frontier[parseInt(pos * frontier.length)];
    con.log("choice ...", choice);
    if (check(choice)) {
      carve(choice);
    } else {
      harden(choice);
    }
    frontier.remove(choice);
  }

  for (y = _k = 0; 0 <= yhigh ? _k < yhigh : _k > yhigh; y = 0 <= yhigh ? ++_k : --_k) {
    for (x = _l = 0; 0 <= xwide ? _l < xwide : _l > xwide; x = 0 <= xwide ? ++_l : --_l) {
      if (field[y][x] === '?') {
        field[y][x] = '#';
      }
    }
  }

  for (y = _m = 0; 0 <= yhigh ? _m < yhigh : _m > yhigh; y = 0 <= yhigh ? ++_m : --_m) {
    s = '';
    for (x = _n = 0; 0 <= xwide ? _n < xwide : _n > xwide; x = 0 <= xwide ? ++_n : --_n) {
      s += field[y][x];
    }
    con.log(s);
  }

  init = function() {};

  draw = function() {};

  init();

}).call(this);
