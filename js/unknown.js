var con = console;
var isNode = (typeof module !== 'undefined');

var unknown = function() {

  var size = 800, sw = size, sh = size;
  var bmp = dom.canvas(size,size);
  var ctx = bmp.ctx;

  return {
    stage: bmp.canvas,
    resize: function(w,h) {
      bmp.canvas.setSize(w, h);
    },
    init: function() {

      var rows = 10;
      var y = -10;

      colours.getRandomPalette();

      // radius
      var rOffset = rand.getNumber(0, 2);
      var rBase = rand.getNumber(1, 2);
      var rPower = rand.getNumber(1.01, 1.5);

      // x gap
      var gOffset = rand.getNumber(-2, 2);
      var gBase = rand.getNumber(8000, 10000);
      var gPower = rand.getNumber(0.4, 0.6);

      // y gap
      var yOffset = rand.getNumber(-2, 2);
      var yBase = rand.getNumber(1.2, 2);
      var yPower = rand.getNumber(1.2, 1.6);
      var yMultiplier = rand.getNumber(2, 3);

      for(var i = 0; i < rows; i++) {
              
        var r = Math.pow((rOffset + rows - i) * rBase, rPower); 
        var g = Math.pow((gOffset + rows - i) * gBase, gPower); 
        y += Math.pow((yOffset + rows - i) * yBase, yPower) * yMultiplier;

        ctx.fillStyle = colours.getNextColour();

        var cols = i + 1;
        for(var j = 0; j < cols; j++) {
          var x = sw / 2 + (j - (cols - 1) / 2) / cols * g;
          ctx.beginPath();
          ctx.drawCircle(x,y,r);
          ctx.closePath();
          ctx.fill();
        }
      }
    },
    kill: function() {}
  };

}

if (isNode) {
  module.exports = unknown();
} else {
  define("unknown", unknown);
}