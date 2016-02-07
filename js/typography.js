var con = console;
var isNode = (typeof module !== 'undefined');

if (isNode) {
  var rand = require('./rand.js');
  var dom = require('./dom.js');
  var colours = require('./colours.js');
}

var typography = function() {

  var block = 128;
  var sw = block * 6, sh = block * 6;
  var bmp = dom.canvas(sw,sh);
  var ctx = bmp.ctx;
  var rows = Math.floor(sh / block);
  var cols = Math.floor(sw / block);

  ctx.clearRect(0, 0, sw, sh);

  var string = "Typography";
  function getString() {
    var str = string;
    var ss = Math.round(Math.random() * str.length);
    var se = ss + Math.round(Math.random() * (str.length - ss));
    str = str.substr(ss, se);
    // con.log(ss, se);
    var textCase = Math.floor(Math.random() * 3);
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
    var w = Math.round(Math.random() * 3);
    var h = Math.round(Math.random() * 3);
    ctx.save();
    ctx.translate(x * block, y * block);
    ctx.fillStyle = colours.getRandomColour();
    ctx.fillRect(0, 0, block * w, block * h);

    if (Math.random() > 0.8) {
      drawInnerBlock();
    }

    if (Math.random() > 0.8) {
      drawSubdivion();
    }

    if (Math.random() > 0.8) {
      drawPattern();
    }

    if (Math.random() > 0.4) {
      drawText();
    }

    ctx.restore();
  }

  function drawSubdivion() {
    var divs = Math.pow(2, Math.ceil(Math.random() * 3));
    var size = block / divs;
    con.log("======", divs);
    for (var i = 0; i < divs * divs; i++) {
      var x = (i % divs);
      var y = Math.floor(i / divs);
      con.log(x,y, size);
      ctx.fillStyle = colours.getRandomColour();
      ctx.fillRect(x * size, y * size, size, size);
    };
  }

  function drawText() {
    var angle = Math.floor(Math.random() * 4) / 4;
    var xo = Math.random() * block;
    var yo = Math.random() * block;
    var fontSize = Math.round(Math.random() * 200) / 4;
    var font = "Helvetica";
    ctx.rotate(angle * Math.PI * 2);
    ctx.translate(xo, yo);
    ctx.font = fontSize + 'px ' + font;
    ctx.fillStyle = colours.getRandomColour();
    ctx.fillText(getString(), 0, 0);
  }

  function drawInnerBlock() {
    ctx.fillStyle = colours.getRandomColour();
    ctx.fillRect(0 + 10, 0 + 10, block - 20, block - 20);
  }

  function drawPattern() {
    var rotation = Math.round(Math.random() * 4) / 4 * Math.PI;
    var rowSize = 2 + Math.floor(Math.random() * 8);
    var patternColoured = dom.canvas(block * rowSize / 2, block * rowSize / 2);
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, block, block);
    // ctx.translate(block / 2, block / 2)
    ctx.rotate(rotation);
    patternColoured.ctx.fillStyle = colours.getRandomColour();
    for (var py = 0; py < block / rowSize * 4; py++) {
      patternColoured.ctx.fillRect(0, py * rowSize * 2, block * rowSize, rowSize);
      // patternColoured.canvas.style.border = "10px solid red";
      // document.body.appendChild(patternColoured.canvas);
    }

    ctx.fillStyle = ctx.createPattern(patternColoured.canvas, "repeat");
    ctx.fill();
    ctx.restore();
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