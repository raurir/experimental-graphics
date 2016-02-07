var con = console;
var isNode = (typeof module !== 'undefined');

if (isNode) {
  var rand = require('./rand.js');
  var dom = require('./dom.js');
  var colours = require('./colours.js');
}

var typography = function() {

  var sw = 600, sh = 200;
  var bmp = dom.canvas(sw,sh);
  var ctx = bmp.ctx;
  var block = 100,
    rows = Math.floor(sh / block),
    cols = Math.floor(sw / block);

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
    var patternColoured = dom.canvas(block, block);
    var rotation = Math.round(Math.random() * 4) / 4 * Math.PI;
    ctx.save();
    ctx.beginPath();
    ctx.rect(0, 0, block, block);
    // ctx.translate(block / 2, block / 2)
    ctx.rotate(rotation);
    var rowSize = 2 + Math.floor(Math.random() * 8);
    patternColoured.ctx.fillStyle = colours.getRandomColour();
    for (var py = 0; py < block / rowSize * 4; py++) {
      patternColoured.ctx.fillRect(0, py * rowSize * 2, block, rowSize);
      // con.log(-block, py * rowSize / 2, block * 3, rowSize)
      // document.body.appendChild(patternColoured.canvas);
    }

    ctx.fillStyle = ctx.createPattern(patternColoured.canvas, "repeat");
    ctx.fill();
    ctx.restore();
  }

  function init() {
    con.log('init', cols, rows);
    var palette = colours.getRandomPalette();
    for (var x = 0; x < cols; x++) {
      for (var y = 0; y < rows; y++) {
        // con.log("s: ", getString());
        ctx.save();
        ctx.translate(x * block, y * block);
        ctx.fillStyle = colours.getRandomColour();
        ctx.fillRect(0, 0, block, block);

        if (Math.random() > 0.8) {
          // drawInnerBlock();
        }

        if (Math.random() > 0.8) {
          drawPattern();
        }

        if (Math.random() > 0.4) {
          // drawText();
        }

        ctx.restore();

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