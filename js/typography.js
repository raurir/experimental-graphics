var con = console;
var isNode = (typeof module !== 'undefined');

if (isNode) {
  var rand = require('./rand.js');
  var dom = require('./dom.js');
  var colours = require('./colours.js');
}

var typography = function() {


  var settings = {
    boxes: {
      label: "Boxes",
      min: 2,
      max: 64,
      cur: 4,
      type: "Number"
    },
    // phrase: {
    //   label: "Phrase",
    //   min: 1,
    //   max: 100,
    //   cur: "Typography",
    //   type: "String"
    // }
    background: {
      type: "Boolean",
      label: "Background",
      cur: false
    }
  };

  var bmp = dom.canvas(100, 100);
  var ctx = bmp.ctx;
  var size, sw, sh, block;
  var rows = 4;
  var cols = 4;

  var numerals = [], numeralsLength = rand.getInteger(1, 5), n = 0;
  while (n++ < numeralsLength) {
    numerals.push(rand.getInteger(0, 9));
  }
  numerals = numerals.join("");
  function getString() {
    var phrase = "Typography";
    // var strings = [settings.phrase.cur, numerals];
    var strings = [phrase, numerals];
    var str = strings[Math.floor(rand.random() * strings.length)];
    var ss = Math.round(rand.random() * str.length);
    var se = ss + Math.round(rand.random() * (str.length - ss));
    str = str.substr(ss, se);
    // con.log(ss, se);
    var textCase = Math.floor(rand.random() * 3);
    switch (textCase) {
      case 0 : str = str.toLowerCase(); break;
      case 1 : str = str.toUpperCase(); break;
      default : // do nothing to case
    }
    return str;
  }

  function drawBlock(x, y) {
    ctx.save();
    ctx.translate(x * block, y * block);
    if (rand.random() > 0.6) {
      var w = rand.getInteger(1, 3);
      var h = rand.getInteger(1, 3);
      ctx.fillStyle = colours.getRandomColour();
      ctx.fillRect(0, 0, block * w, block * h);
    }
    try { if (rand.random() > 0.8) { drawInnerBlock(); } } catch(err) { con.log("err drawInnerBlock", err); }
    try { if (rand.random() > 0.9) { drawSubdivion(); } } catch(err) { con.log("err drawSubdivion", err); }
    try { if (rand.random() > 0.9) { drawPattern(); } } catch(err) { con.log("err drawPattern", err); }
    try { if (rand.random() > 0.8) { drawRuler(); } } catch(err) { con.log("err drawRuler", err); }
    try { if (rand.random() > 0.4) { drawText(); } } catch(err) { con.log("err drawText", err); }

    ctx.restore();
  }

  function drawInnerBlock() {
    var border = 0.1 * block;
    ctx.fillStyle = colours.getRandomColour();
    ctx.fillRect(border, border, block - border * 2, block - border * 2);
  }

  function drawSubdivion() {
    var divs = Math.pow(2, Math.ceil(rand.random() * 3));
    var size = block / divs;
    for (var i = 0; i < divs * divs; i++) {
      var x = (i % divs);
      var y = Math.floor(i / divs);
      ctx.fillStyle = colours.getRandomColour();
      ctx.fillRect(x * size, y * size, size, size);
    };
  }

  function drawRuler() {
    ctx.save();
    var angle = Math.floor(rand.random() * 4) / 4;
    ctx.rotate(angle * Math.PI * 2);
    var majors = Math.pow(2, rand.getInteger(1, 4));
    var minors = rand.getInteger(1, 4);
    var majorSize = rand.getInteger(5, 10) * size / 400;
    var minorSize = majorSize * rand.getNumber(0.2, 0.8);
    ctx.fillStyle = colours.getRandomColour();
    var width = 1 * size / 300;
    for (var m = 0; m < majors; m++) {
      var x = m / majors * block;
      var y = 0;
      ctx.fillRect(x, y, width, majorSize);
      for (var n = 0; n < minors; n++) {
        var xn = x + n / minors * block / majors;
        var yn = 0;
        ctx.fillRect(xn, yn, width, minorSize);
      }
    }
    ctx.restore();
  }

  function drawPattern() {
    var rotation = Math.round(rand.random() * 4) / 4 * Math.PI;
    var rowSize = Math.round((2 + Math.floor(rand.random() * 8)) * size / 1000);
    var patternColoured = dom.canvas(rowSize, rowSize * 2);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, block, block);
    ctx.rotate(rotation);
    patternColoured.ctx.fillStyle = colours.getNextColour();// getRandomColour();
    for (var py = 0; py < block / rowSize * 4; py++) {
      patternColoured.ctx.fillRect(0, py * rowSize * 2, block * rowSize, rowSize);

    }
    // document.body.appendChild(patternColoured.canvas);
    // patternColoured.canvas.style.border = "2px solid green";
    // patternColoured.canvas.style.width = "100px";
    ctx.fillStyle = ctx.createPattern(patternColoured.canvas, "repeat");
    ctx.fill();
    ctx.restore();
  }

  function drawText() {
    var angle = Math.floor(rand.random() * 4) / 4;
    var xo = rand.random() * block;
    var yo = rand.random() * block;
    var fontSize = Math.round(Math.pow(2, 2 + rand.random() * 6) * size / 400);
    // con.log(fontSize);
    var font = "Helvetica";
    ctx.rotate(angle * Math.PI * 2);
    ctx.translate(xo, yo);
    ctx.font = fontSize + 'px ' + font;
    ctx.fillStyle = colours.getRandomColour();
    ctx.fillText(getString(), 0, 0);
  }

  function init(options) {
    size = options.size;
    sw = size;
    sh = size;

    settings.background.cur = false;
    settings.boxes.cur = 4;
    // settings.phrase.cur = "Typography";
    if (options.settings) {
      settings = options.settings;
    }
    progress('settings:initialised', settings);

    cols = settings.boxes.cur;
    rows = settings.boxes.cur;

    block = Math.ceil(1 / cols * size);
    bmp.setSize(sw, sh);
    ctx.clearRect(0, 0, sw, sh);
    colours.getRandomPalette();
    colours.setPaletteRange(3);

    render();
  }

  function render() {
    if (settings.background.cur) {
      ctx.fillStyle = colours.getCurrentColour(); // cannot do next colour or rand will be shifted along. always add a background render first!
      ctx.fillRect(0, 0, sw, sh);
    }
    renderBatch(0);
  }

  function renderBatch(batch) {
    // for (var x = 0; x < cols; x++) {
    //   for (var y = 0; y < rows; y++) {
    //     drawBlock(x, y);
    //   }
    // }
    var total = rows * cols;
    var x = batch % cols;
    var y = Math.floor(batch / cols);
    drawBlock(x, y);
    if (batch < total) {
      progress("render:progress", batch / total);
      setTimeout(function () {
        renderBatch(batch + 1);
      }, 5);
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
  module.exports = typography();
} else {
  define("typography", typography);
}