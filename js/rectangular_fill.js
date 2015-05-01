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
  var rows = 25;
  var cols = 25;
  var populated = [];
  var available = [];


  function tryPosition() {

    var startIndex = Math.floor(available.length * Math.random());
    var start = available[startIndex];
    var x = start[0], y = start[1];
    var size = Math.ceil(Math.random() * 4);
    var colour = colours.getRandomColour();

    populated[x][y] = colour;

    // con.log("tryPosition", available.length, x, y);

    available.splice(startIndex, 1);

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
        available.push([x,y]);
      }
    }

    tryPosition();
  }

  function render(j) {


    con.log(populated, available)

    for (var x = 0; x < cols; x++) {
      for (var y = 0; y < rows; y++) {
        bmp.ctx.fillStyle = populated[x][y];
        bmp.ctx.fillRect(x * block, y * block, block, block);
      }
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