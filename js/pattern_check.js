var sw = window.innerWidth - 20, sh = window.innerHeight- 20;
var bmp = dom.createCanvas(sw,sh);
var ctx = bmp.ctx;
var pattern

function newPattern() {

  ctx.clearRect(0, 0, sw, sh);

  var patternSize = Math.ceil(Math.random() * 10) * 10;
  var dot = 2, cols = Math.ceil(sw / (patternSize * dot)), rows = Math.ceil(sh / (patternSize * dot));

  pattern = dom.createCanvas(patternSize * dot, patternSize * dot);

  var lines = 2 + ~~(Math.random() * 5);
  var widths = [0];
  while(widths.length < lines) widths.push(Math.ceil(1 + Math.random() * patternSize / 2) * 2); // all patterns should be multiples of 2
  widths.push(patternSize);

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

  con.log(col, widths)

  for (var i = 0; i < widths.length - 1; i++) {
    var x = widths[i];
    var w = widths[i + 1] - x;
    var colourColumn = col[i];
    for (var j = 0; j < widths.length - 1; j++) {
      var y = widths[j];
      var h = widths[j + 1] - y;
      var colourRow = col[j];
      for (var px = 0; px < w; px++) {
        for (var py = 0; py < h; py++) {
          pattern.ctx.fillStyle = (px+py) % 2 == 0 ? colourColumn : colourRow;
          pattern.ctx.fillRect((x + px) * dot, (y + py) * dot, dot, dot);
        }
      }

    }
  }

  // ctx.drawImage(pattern.canvas, 0,0);

  for (var i = 0; i < cols; i++) {
    var x = i * patternSize * dot;
    for (var j = 0; j < rows; j++) {
      var y = j * patternSize * dot;
      ctx.drawImage(pattern.canvas, x, y);
    }
  }

}


var preview;
var buttonExport = dom.createElement("button");
buttonExport.className = "export";
buttonExport.innerHTML = "Create CSS";
buttonExport.addEventListener("click", function(e) {

  preview = dom.createElement("div");
  preview.className = "preview";
  document.body.appendChild(preview);

  var previewCSS = dom.createElement("div");
  previewCSS.className = "previewCSS";
  preview.appendChild(previewCSS);

  var img = pattern.canvas.toDataURL("image/jpeg");
  var style = [
    "<pre>",
    // "body {",
    " background-image: url(" + img + ");",
    " background-repeat: repeat;",
    // "}",
    "</pre>"
  ];

  preview.style.backgroundImage = "url(" + img + ")";
  previewCSS.innerHTML = style.join("\n");

});
document.body.appendChild(buttonExport);
document.body.appendChild(bmp.canvas);
bmp.canvas.addEventListener("click", newPattern)
newPattern();