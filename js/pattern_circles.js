var isNode = (typeof module !== 'undefined');

var pattern_circles = function() {

  var size, sw, sh;
  var bmp = dom.canvas(1, 1);
  var ctx = bmp.ctx;
  var circles;
  var colourBG;
  var rotation;

  function init(options) {
    size = options.size;
    sw = size;
    sh = size;
    var cx = sw / 2;
    var cy = sh / 2;
    bmp.setSize(sw, sh);
    ctx.clearRect(0, 0, sw, sh);
    // ctx.fillStyle = "#0f0";
    ctx.fillRect(cx - 2, cy - 2, 4, 4);

    rotation = Math.random() * Math.PI / 2;
    var size = 10 + ~~(Math.random() * 50);
    var lines = 2 + ~~(Math.random() * 5);
    var widths = [];
    while(widths.length < lines) widths.push(Math.ceil(Math.random() * size));
    widths.push(size);

    var noDuplicates = [];
    widths.map(function(a,i) {
      if (widths.indexOf(a) == i) {
        noDuplicates.push(a)
      }
    });

    widths = noDuplicates.sort(function(a,b) { return a < b ? -1 : 1;});

    colours.getRandomPalette();
    var palette = [];
    while(palette.length < widths.length) {
      palette.push(colours.getRandomColour());
    }

    colourBG = colours.getRandomColour();

    con.log("colourBG", colourBG);

    var patternSize = size + size * Math.random();

    circles = dom.canvas(patternSize, patternSize);
    document.body.appendChild(circles.canvas);
    for (var i = widths.length - 1; i > -1 ; i--) {
      var radius = widths[i];
      var colour = palette[i];
      circles.ctx.beginPath();
      circles.ctx.fillStyle = colour;
      circles.ctx.drawCircle(size / 2, size / 2, radius / 2);
      circles.ctx.fill();
      circles.ctx.closePath();
      con.log(i)
    }
    render();
  }

  function render() {

    con.log("render");

    // var cols = Math.ceil(sw / size), rows = Math.ceil(sh / size);
    // var cosR = patternSize * Math.cos(rotation);
    // var sinR = patternSize * Math.sin(rotation);
    // for (var i = 0; i < cols; i++) {
    //   for (var j = 0; j < rows; j++) {
    //     var x = i * cosR - j * sinR;
    //     var y = i * sinR + j * cosR;
    //     // x %= rows * (cosR - sinR);
    //     // y %= cols * (sinR + cosR);
    //     ctx.drawImage(circles.canvas, x, y);
    //   }
    // }

    ctx.save();
    ctx.fillStyle = colourBG;
    ctx.rect(0, 0, sw, sh);
    ctx.fill();
    ctx.rotate(rotation);
    ctx.fillStyle = ctx.createPattern(circles.canvas,"repeat");
    ctx.fill();
    ctx.restore();

     progress("render:complete", bmp.canvas);
  }


  var experiment = {
    stage: bmp.canvas,
    init: init
  }



  return experiment;

};

if (isNode) {
  module.exports = pattern_circles();
} else {
  define("pattern_circles", pattern_circles);
}