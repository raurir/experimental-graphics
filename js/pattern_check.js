var sw = window.innerWidth - 20, sh = window.innerHeight- 20;
var bmp = dom.canvas(sw,sh);
var ctx = bmp.ctx;
var pattern;
var dot = 2;

function newPattern() {

  ctx.clearRect(0, 0, sw, sh);

  var patternSize = Math.ceil(Math.random() * 10) * 10;
  var cols = Math.ceil(sw / (patternSize * dot)), rows = Math.ceil(sh / (patternSize * dot));

  pattern = dom.canvas(patternSize * dot, patternSize * dot);

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

  // con.log(col, widths)

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
var buttonExport = dom.button("export", {className: "export"});
buttonExport.addEventListener("click", function(e) {

  var img = pattern.canvas.toDataURL("image/jpeg");
  var style = [
    "<pre>",
    // "body {",
    " background-image: url(" + img + ");",
    " background-repeat: repeat;",
    // "}",
    "</pre>"
  ];

  preview = dom.button("preview",{className:"preview", style:{backgroundImage: "url(" + img + ")"}});
  document.body.appendChild(preview);

  var previewCSS = dom.element("div", {className:"previewCSS", innerHTML:style.join("\n")});
  preview.appendChild(previewCSS);
});
document.body.appendChild(buttonExport);
document.body.appendChild(bmp.canvas);

function changeSize(size) {
  // alert(size);
  dot = size;
  newPattern();
}

var buttonSize1 = dom.button("1x", {className:"size"});
buttonSize1.addEventListener("click", function() { changeSize(1)});
var buttonSize2 = dom.button("2x", {className:"size"});
buttonSize2.addEventListener("click", function() { changeSize(2)});



document.body.appendChild(buttonSize1);
document.body.appendChild(buttonSize2);


bmp.canvas.addEventListener("click", newPattern)
newPattern();