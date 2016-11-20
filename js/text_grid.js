/*
First thing killian ever typed:

D Q36RUCN    FGVNFVGQax6q2 b            2                                                                 W2WW                                                                                                                                                                                                                                                                                                                                Q      N

*/
var con = console;
var isNode = (typeof module !== 'undefined');

if (isNode) {
  var rand = require('./rand.js');
  var dom = require('./dom.js');
  var colours = require('./colours.js');
}

var text_grid = function() {

  var settings = {
    boxes: {
      label: "Boxes",
      min: 2,
      max: 64,
      cur: 7,
      type: "Number"
    },
    phrase: {
      label: "Phrase",
      // min: 1,
      // max: 100,
      cur: "D Q36RUCN    FGVNFVGQax6q2 b",
      type: "String"
    },
    background: {
      type: "Boolean",
      label: "Background",
      cur: true
    }
  };

  var bmp = dom.canvas(100, 100);
  var ctx = bmp.ctx;
  var widthOnHeight = 0.6;
  var size, sw, sh, blockW, blockH;
  var rows;
  var cols;
  var phrase;

  function drawBlock(index, x, y) {
    var w = 1, h = 1;
    ctx.save();
    ctx.translate(x * blockW, y * blockH);


    // var gradient = ctx.createLinearGradient(blockW / 2, 0, blockW / 2, blockH);
    // gradient.addColorStop(0, colours.getRandomColour());
    // gradient.addColorStop(1, colours.getRandomColour());
    // ctx.fillStyle = gradient;
    // // ctx.fillStyle = colours.getRandomColour();
    // ctx.fillRect(0, 0, blockW * w, blockH * h);

    try { drawText(index); } catch(err) { con.log("err drawText", err); }
    ctx.restore();
  }

  function drawText(index) {
    var str = phrase[index];
    // var angle = 0;//Math.floor(rand.random() * 4) / 4;
    var xo = 0;
    var yo = 0.8 * blockH;
    var fontSize = 0.2 * size;
    // con.log(fontSize);
    var font = "Helvetica";
    // ctx.rotate(angle * Math.PI * 2);


    ctx.font = fontSize + 'px ' + font;
    // ctx.fillStyle = colours.getRandomColour();

    var gradient = ctx.createLinearGradient(0, -blockH, 0, 0);
    gradient.addColorStop(0, colours.getRandomColour());
    gradient.addColorStop(1, colours.getRandomColour());
    ctx.fillStyle = gradient;

    var textDimensions = ctx.measureText(str).width;
    // con.log(textDimensions, blockW);
    xo = (blockW - textDimensions) / 2;
    ctx.translate(xo, yo);
    ctx.fillText(str, 0, 0);
  }

  function init(options) {
    size = options.size;
    sw = size;
    sh = size;

    // settings.background.cur = false;
    // settings.boxes.cur = 4;
    // settings.phrase.cur = "text_grid";
    if (options.settings) {
      settings = options.settings;
    }
    progress('settings:initialised', settings);

    phrase = settings.phrase.cur;
    cols = settings.boxes.cur;
    rows = Math.floor(phrase.length / cols);

    blockW = Math.ceil(1 / cols * size);
    blockH = Math.ceil(blockW / widthOnHeight);
    bmp.setSize(sw, sh);
    ctx.clearRect(0, 0, sw, sh);
    colours.getRandomPalette();
    colours.setPaletteRange(3);

    render();
  }

  function render() {
    if (settings.background.cur) {
      // ctx.fillStyle = colours.getCurrentColour(); // cannot do next colour or rand will be shifted along. always add a background render first!
      // ctx.fillRect(0, 0, sw, sh);
    }
    renderBatch(0);
  }

  function renderBatch(batch) {
    var total = rows * cols;
    var x = batch % cols;
    var y = Math.floor(batch / cols);
    drawBlock(batch, x, y);
    if (batch < total - 1) {
      progress("render:progress", batch / total);
      setTimeout(function () {
        renderBatch(batch + 1);
      }, 1);
    } else {
      progress("render:complete", bmp.canvas);
    }
  }


  function update(settings) {
    init({size: size, settings: settings});
  }


  var experiment = {
    stage: bmp.canvas,
    init: init,
    render: render,
    settings: settings,
    update: update
  }

  return experiment;

};

if (isNode) {
  module.exports = text_grid();
} else {
  define("text_grid", text_grid);
}