var sw = window.innerWidth, sh = window.innerHeight;
var bmp = dom.canvas(sw,sh);
var ctx = bmp.ctx;
var circles;
var colourBG;
var rotation;

document.body.appendChild(bmp.canvas);

function generate() {
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
  palette = [];
  while(palette.length < widths.length) {
    palette.push(colours.getRandomColour());
  }

  colourBG = colours.getRandomColour();

  var patternSize = size + size * Math.random();

  circles = dom.canvas(patternSize, patternSize);
  for (var i = widths.length - 1; i > -1 ; i--) {
    var radius = widths[i];
    var colour = palette[i];
    circles.ctx.beginPath();
    circles.ctx.fillStyle = colour;
    circles.ctx.drawCircle(size / 2, size / 2, radius / 2);
    circles.ctx.fill();
    circles.ctx.closePath();
  }
  render();
}

function render() {

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
}

bmp.canvas.addEventListener("click", generate);

window.addEventListener("resize", function() {
  bmp.canvas.width = sw = window.innerWidth;
  bmp.canvas.height = sh = window.innerHeight;
  render();
});

generate();