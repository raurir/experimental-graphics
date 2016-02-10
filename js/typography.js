var con = console;
var isNode = (typeof module !== 'undefined');

if (isNode) {
  var rand = require('./rand.js');
  var dom = require('./dom.js');
  var colours = require('./colours.js');
}

var typography = function() {

  // rand.setSeed(309484);
  // rand.setSeed(Math.random());
  rand.setSeed(3);
  var size = blah * 100;

  var sw = size, sh = size;
  var block = Math.ceil(1 / 8 * size);
  con.log(block);
  var bmp = dom.canvas(sw,sh);
  var ctx = bmp.ctx;
  var rows = 8;//Math.floor(sh / block);
  var cols = 8;//Math.floor(sw / block);

  ctx.clearRect(0, 0, sw, sh);

  var numerals = [], numeralsLength = rand.getInteger(1, 5), n = 0;
  while (n++ < numeralsLength) {
    numerals.push(rand.getInteger(0, 9));
  }
  numerals = numerals.join("");
  function getString() {
    var strings = ["Typography", numerals];
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
    return str
  }

  // var test = 0;
  // while (test < 1000) {
  //   if (getString() == string) {
  //     con.log("got it...");
  //   }
  //   test ++;
  // }
  function drawBlock(x, y) {
    var w = 1;//Math.round(rand.random() * 3);
    var h = 1;//Math.round(rand.random() * 3);
    ctx.save();
    ctx.translate(x * block, y * block);
    ctx.fillStyle = colours.getRandomColour();
    ctx.fillRect(0, 0, block * w, block * h);

    // if (rand.random() > 0.8) drawInnerBlock();
    // if (rand.random() > 0.9) drawSubdivion();
    // if (rand.random() > 0.9) 
      drawPattern();
    // if (rand.random() > 0.8) drawRuler();
    // if (rand.random() > 0.4) drawText();

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
    var majorSize = rand.getInteger(5, 10);
    var minorSize = majorSize * rand.getNumber(0.2, 0.8);
    ctx.fillStyle = colours.getRandomColour();
    for (var m = 0; m < majors; m++) {
      var x = m / majors * block;
      var y = 0;
      ctx.fillRect(x, y, 1, majorSize);
      for (var n = 0; n < minors; n++) {
        var xn = x + n / minors * block / majors;
        var yn = 0;
        ctx.fillRect(xn, yn, 1, minorSize);
      }
    }
    ctx.restore();
  }

  function drawPattern() {
    var rotation = Math.round(rand.random() * 4) / 4 * Math.PI;
    var rowSize = Math.round((2 + Math.floor(rand.random() * 8)) * size / 1000);
    con.log(rowSize);
    var patternColoured = dom.canvas(block * rowSize, block * rowSize);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, block, block);
    ctx.rotate(rotation);
    patternColoured.ctx.fillStyle = colours.getNextColour();// getRandomColour();
    for (var py = 0; py < block / rowSize * 4; py++) {
      patternColoured.ctx.fillRect(0, py * rowSize * 2, block * rowSize, rowSize);

    }
    document.body.appendChild(patternColoured.canvas);
    patternColoured.canvas.style.border = "2px solid green";
    ctx.fillStyle = ctx.createPattern(patternColoured.canvas, "repeat");
    ctx.fill();
    ctx.restore();
  }

  function drawText() {
    var angle = Math.floor(rand.random() * 4) / 4;
    var xo = rand.random() * block;
    var yo = rand.random() * block;
    var fontSize = Math.round(Math.pow(2, 1 + rand.random() * 8));
    con.log(fontSize);
    var font = "Helvetica";
    ctx.rotate(angle * Math.PI * 2);
    ctx.translate(xo, yo);
    ctx.font = fontSize + 'px ' + font;
    ctx.fillStyle = colours.getRandomColour();
    ctx.fillText(getString(), 0, 0);
  }

  function init() {
    con.log('init', cols, rows);
    var palette = colours.getRandomPalette();
    // drawBlock(0, 0);
    // return;
    for (var x = 0; x < cols; x++) {
      for (var y = 0; y < rows; y++) {
        drawBlock(x, y);
      }
    }
    progress("render:complete", bmp.canvas);
  }

  var experiment = {
    stage: bmp.canvas,
    // inner: inner,
    resize: function() {},
    init: init,
    kill: function() {}
  }

  return experiment;

};

if (isNode) {
  module.exports = typography();
} else {
  define("typography", typography);
}