var con = console;
var isNode = (typeof module !== 'undefined');

function ExperimentFactory(experiment) {

  function progress() {
    con.log("ExperimentFactory factory progress", arguments);
    if (isNode) {
      callback(arguments);
    } else {
      if (arguments.length === 2) {
        dispatchEvent(new CustomEvent("load:complete", {detail: arguments[1]}));
      } else {
        dispatchEvent(new Event(arguments));
      }
    }
  }

  var e = experiment(progress);
  return e;
}


var rect = function(progress) {

  colours.getRandomPalette();

  var sw = sh = size = 800;

  var bmp = dom.canvas(size,size);

  var block = 10;
  var stroke = block * 0.2;

  var rows = 50;
  var cols = 50;
  var populated = [];
  var available = [];
  var squares = [];



  function setBlock(size, colour) {
    var startIndex = Math.floor(available.length * Math.random());
    var start = available[startIndex].split(":");
    var x = parseInt(start[0]), y = parseInt(start[1]);

    // con.log("setBlock", x, y)

    var ok = true;

    var xxe = x + size;
    if (xxe > cols) xxe = cols;
    var yye = y + size;
    if (yye > rows) yye = rows;

    for (var xx = x; xx < xxe && ok; xx++) {
      for (var yy = y; yy < yye && ok; yy++) {
        if (populated[xx][yy]) ok = false;
      }
    }
    if (ok) {
      for (var xx = x; xx < xxe && ok; xx++) {
        for (var yy = y; yy < yye && ok; yy++) {
          populated[xx][yy] = colour;

          var id = [xx,yy].join(":");

          try {
            var availIndex = available.indexOf(id);
            available.splice(availIndex, 1);
          } catch(e) {
            con.log("error", e);
          }

        }
      }

      squares.push({
        colour: colour,
        x: x * block + stroke,
        y: y * block + stroke,
        w: size * block - 2 * stroke,
        h: size * block - 2 * stroke
      });

    }

    // con.log("tryPosition", available.length, x, y);


  }

  var attempts = 0;
  function tryPosition() {

    attempts++;

    if (attempts > 1e5) {
      return con.warn("bailing!", attempts);
    }

    var size = Math.ceil(Math.random() * 4);
    var colour = colours.getRandomColour();
    setBlock(size, colour) ;

    if (available.length) {
      tryPosition();
      // setTimeout(tryPosition, 1);
    } else {
      render();
    }

  }

  function init() {
    con.log("init");

    for (var x = 0; x < cols; x++) {
      populated[x] = [];
      for (var y = 0; y < rows; y++) {
        populated[x][y] = 0;
        available.push([x,y].join(":"));
      }
    }

    // con.log("available", available)

    tryPosition();
  }

  function render(j) {

    // con.log(populated, available)

    // for (var x = 0; x < cols; x++) {
    //   for (var y = 0; y < rows; y++) {
    //     bmp.ctx.fillStyle = populated[x][y];
    //     bmp.ctx.fillRect(x * block, y * block, block, block);
    //   }
    // }

    bmp.ctx.setTransform(1,Math.random() * 0.2 - 0.1,Math.random() * 0.2 - 0.1,1,0,0);

    for (var s = 0, sl = squares.length; s < sl; s++) {
      var rect = squares[s];
      bmp.ctx.fillStyle = rect.colour;
      bmp.ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    }


    progress("render:complete");

  }

  var experiment = {
    stage: bmp.canvas,
    resize: function(w,h) {
      sw = w;
      sh = h;
      // bmp.canvas.width = sw;
      // bmp.canvas.height = sh;
    },
    init: init,
    kill: function() {}
  }
  progress("load:complete", experiment);

  return experiment;

};

ExperimentFactory(rect);




// if (isNode) module.exports = bezier_flow;