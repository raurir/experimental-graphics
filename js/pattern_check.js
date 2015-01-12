var sw = 400, sh = 400;
var bmp = dom.createCanvas(sw,sh);

var ctx = bmp.ctx;
var cx = sw / 2;
var cy = sh / 2;
var frame = 0;

function newPattern() {

  ctx.clearRect(0, 0, sw, sh);

  var patternSize = Math.ceil(Math.random() * 10) * 10; 
  var dot = 1, cols = Math.ceil(sw / patternSize), rows = Math.ceil(sh / patternSize);
  var pattern = dom.createCanvas(patternSize,patternSize);

  var lines = 2 + ~~(Math.random() * 5); 
  var widths = [0];
  while(widths.length < lines) widths.push(~~(1 + Math.random() * patternSize));
  widths.push(patternSize);
  con.log(widths);

  var noDuplicates = [];
  widths.map(function(a,i) {  
    if (widths.indexOf(a) == i) {
      noDuplicates.push(a)
    } 
  });

  widths = noDuplicates.sort(function(a,b) { return a < b ? -1 : 1;});
  
  var col = [];
  widths.map(function(a,i) {  
    col.push(colours.getRandomColour());
  });


  for (var i = 0; i < widths.length - 1; i++) {
    var x = widths[i];
    var w = widths[i + 1] - x;
    for (var j = 0; j < widths.length - 1; j++) {
      var y = widths[j];
      var h = widths[j + 1] - y;
      pattern.ctx.fillStyle = col[i < j ? i : j];
      pattern.ctx.fillRect(x, y, w, h);
    }
  }

  for (var i = 0; i < cols; i++) {
    var x = i * patternSize
    for (var j = 0; j < rows; j++) {
      var y = j * patternSize;
      ctx.drawImage(pattern.canvas, x, y);
    }
  }

}

document.body.appendChild(bmp.canvas);

newPattern();