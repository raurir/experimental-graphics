var sw = window.innerWidth, sh = window.innerHeight;
var bmp = dom.canvas(sw,sh);
var ctx = bmp.ctx;
var pattern;
var dot = 2;
var widths;
var pallete;
var size;

var container = dom.element("div", {className:"container", style:{width:sw+"px",height:sh+"px"}});
document.body.appendChild(container);

function newSize() {
  size = Math.ceil(Math.random() * 10) * 10;
}

function newStripes() {
  var lines = 2 + ~~(Math.random() * 5);
  widths = [0];
  while(widths.length < lines) widths.push(Math.ceil(1 + Math.random() * size / 2) * 2); // all patterns should be multiples of 2
  widths.push(size);

  var noDuplicates = [];
  widths.map(function(a,i) {
    if (widths.indexOf(a) == i) {
      noDuplicates.push(a)
    }
  });

  widths = noDuplicates.sort(function(a,b) { return a < b ? -1 : 1;});
}

function newColours() {
  palette = [];
  widths.map(function(a,i) {
    palette.push(colours.getRandomColour());
  });
}

function reset() {
  newSize();
  newStripes();
  newColours();
  render();
}

function render() {

  pattern = dom.canvas(size * dot, size * dot);

  for (var i = 0; i < widths.length - 1; i++) {
    var x = widths[i];
    var w = widths[i + 1] - x;
    var colourColumn = palette[i];
    for (var j = 0; j < widths.length - 1; j++) {
      var y = widths[j];
      var h = widths[j + 1] - y;
      var colourRow = palette[j];
      for (var px = 0; px < w; px++) {
        for (var py = 0; py < h; py++) {
          pattern.ctx.fillStyle = (px+py) % 2 == 0 ? colourColumn : colourRow;
          pattern.ctx.fillRect((x + px) * dot, (y + py) * dot, dot, dot);
        }
      }

    }
  }

  ctx.save();
  ctx.rect(0, 0, sw, sh);
  // ctx.rotate(0.1);
  ctx.fillStyle = ctx.createPattern(pattern.canvas,"repeat");
  ctx.fill();
  ctx.restore();

}


var buttonsTop = dom.element("div", {className:"buttons top"});
container.appendChild(buttonsTop);
var buttonsBottom = dom.element("div", {className:"buttons bottom"});
container.appendChild(buttonsBottom);

var preview;
var buttonExport = dom.button("export", {className:"button export"});
buttonExport.addEventListener("click", function(e) {

  var img = pattern.canvas.toDataURL("image/jpeg");
  var style = [
    "<pre>",
    " background-image: url(" + img + ");",
    " background-repeat: repeat;",
    "</pre>"
  ];

  preview = dom.button("preview",{className:"preview"});
  container.appendChild(preview);
  var css = dom.element("div", {className:"previewCSS", innerHTML:style.join("\n")});
  preview.appendChild(css);
});
buttonsTop.appendChild(buttonExport);

function changeSize(size) {
  // alert(size);
  dot = size;
  render();
}

var sizes = [1,2,3,4];
// var sizeButtons
for (var s in sizes) {
  var size = sizes[s];
  var buttonSize = dom.button(size + "x", {className:"button size", size: size});
  buttonSize.addEventListener("click", function() { changeSize(this.size); });
  buttonsBottom.appendChild(buttonSize);
}

bmp.canvas.addEventListener("click", reset);

container.appendChild(bmp.canvas);

reset();