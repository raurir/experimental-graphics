var sw = window.innerWidth, sh = window.innerHeight;
var bmp = dom.canvas(sw,sh);
var ctx = bmp.ctx;
var patternMonochrome;
var patternColoured;
var dot = 2;
var widths;
var pallete;
var size;
var rotation = 0;
var palettePreview;
var preview;
var title;

var container = dom.element("div", {className:"container", style:{width:sw+"px",height:sh+"px"}});
document.body.appendChild(container);
container.appendChild(bmp.canvas);

function newSize() {
  size = Math.ceil(Math.random() * 10) * 10;
}

function newStripes() {
  var lines = 2 + ~~(Math.random() * 5);
  widths = [0];
  while(widths.length < lines) widths.push(Math.ceil(1 + Math.random() * (size - 1) / 2) * 2); // all patternColoureds should be multiples of 2
  widths.push(size);
  // con.log("widths", widths)
  var noDuplicates = [];
  widths.map(function(a,i) {
    if (widths.indexOf(a) == i) {
      noDuplicates.push(a)
    }
  });

  widths = noDuplicates.sort(function(a,b) { return a < b ? -1 : 1;});

}

function newPalette() {
  colours.getRandomPalette();
  if (palettePreview) {
    container.removeChild(palettePreview);
    palettePreview.removeEventListener("click", changePalette)
  }
  palettePreview = colours.showPalette();
  palettePreview.addEventListener("click", changePalette);
  container.appendChild(palettePreview);
}
function newColours() {
  palette = [];
  var attempts = 0;
  // if the current colour scheme from colours.js has less than stripes. simple brute force check with attempts. don't tell anyone!
  while(palette.length < widths.length - 1) {
    var newColour = colours.getRandomColour();
    if (palette.indexOf(newColour) == -1 || attempts > 100) {
      palette.push(newColour);
    }
    attempts++;
  }
}

function reset() {
  newSize();
  newStripes();
  newPalette()
  newColours();
  render();
}

function changeStripes() {
  // newSize();
  newStripes();
  newColours();
  render();
}

function changeSize(size) {
  dot = size;
  render();
}

function changeRotation() {
  rotation += Math.PI / 4;
  render();
}

function changePalette() {
  newPalette();
  newColours();
  render();
}



function render() {

  // con.log(palette, widths)

  patternColoured = dom.canvas(size * dot, size * dot);

  if (patternMonochrome) patternDetails.removeChild(patternMonochrome.canvas);

  patternMonochrome = dom.canvas(size * dot, size * dot);

  var colourMonochrome = [["#666","#aaa"], ["#333","#888"]];

  for (var i = 0; i < widths.length - 1; i++) {
    var x = widths[i];
    var w = widths[i + 1] - x;
    var colourColumn = palette[i];
    var monoColumn = colourMonochrome[0][i%2];
    for (var j = 0; j < widths.length - 1; j++) {
      var y = widths[j];
      var h = widths[j + 1] - y;
      var colourRow = palette[j];
      var monoRow = colourMonochrome[1][j%2];
      for (var px = 0; px < w; px++) {
        for (var py = 0; py < h; py++) {
          patternColoured.ctx.fillStyle = (px+py) % 2 == 0 ? colourColumn : colourRow;
          patternColoured.ctx.fillRect((x + px) * dot, (y + py) * dot, dot, dot);
          patternMonochrome.ctx.fillStyle = (px+py) % 2 == 0 ? monoColumn : monoRow;
          patternMonochrome.ctx.fillRect((x + px) * dot, (y + py) * dot, dot, dot);
        }
      }

    }
  }


  patternDetails.appendChild(patternMonochrome.canvas);

  ctx.save();
  ctx.rect(0, 0, sw, sh);
  ctx.rotate(rotation);
  ctx.fillStyle = ctx.createPattern(patternColoured.canvas,"repeat");
  ctx.fill();
  ctx.restore();

}


var buttonsTop = dom.element("div", {className:"buttons top"});
container.appendChild(buttonsTop);
var buttonsBottom = dom.element("div", {className:"buttons bottom"});
container.appendChild(buttonsBottom);

var patternDetails = dom.element("div", {className:"pattern"});
container.appendChild(patternDetails);
patternDetails.addEventListener("click", changeStripes);


var buttonExport = dom.button("get css", {className:"button export"});
buttonExport.addEventListener("click", function(e) {
  var img = patternColoured.canvas.toDataURL("image/jpeg");

  if (preview === undefined) {
    preview = dom.element("div", {className:"preview"});

    var title = dom.element("div", {className: "title", innerHTML:"And the CSS..."});
    preview.appendChild(title);

    var close = dom.button("close", {className: "close"});
    close.addEventListener("click", function(e) {
      container.removeChild(preview);
    });
    preview.appendChild(close);

    preview.css = dom.element("div", {className: "css"});
    preview.appendChild(preview.css);
  }

  container.appendChild(preview);

  var r = "rotate(" + rotation + "rad)";
  var cssArr = [
    "background-image: url(" + img + ");",
    "background-repeat: repeat;",
    "-webkit-transform: " + r + ";",
    "-moz-transform: " + r + ";",
    "-ms-transform: " + r + ";",
    "-o-transform: " + r + ";",
    "transform: " + r + ";",
  ];

  preview.css.innerHTML = cssArr.join("<br>"); // wrap?? #.match(/.{1,20}/g).join("<br>")


});
buttonsTop.appendChild(buttonExport);


function save(canvas, type) {
  var dataURL = canvas.toDataURL("image/jpeg");
  var filename = "check_" + type + "_" + (Math.random() * 1e9 << 0).toString(16) + "-.jpg";
  var link = dom.element("a", {"href": dataURL, "download": filename});
  link.click();

  // not on my server you don't...
  // $.ajax({
  //   type: "POST",
  //   url: "/php/save.php",
  //   data: {
  //      imgBase64: dataURL
  //   }
  // }).done(function(o) {
  //   con.log('saved', o);
  // });
}

var buttonSaveOne = dom.button("pattern image", {className:"button"});
buttonSaveOne.addEventListener("click", function(e) { save(patternColoured.canvas, "pattern");});
buttonsTop.appendChild(buttonSaveOne);

var buttonSaveTiled = dom.button("tiled image", {className:"button"});
buttonSaveTiled.addEventListener("click", function(e) { save(bmp.canvas, "tiled");});
buttonsTop.appendChild(buttonSaveTiled);


var sizes = [1,2,3,4];
for (var s in sizes) {
  var size = sizes[s];
  var buttonSize = dom.button(size + "x", {className:"button", size: size});
  buttonSize.addEventListener("click", function() { changeSize(this.size); });
  buttonsBottom.appendChild(buttonSize);
}

var buttonRotation = dom.button("rotation", {className:"button"});
buttonRotation.addEventListener("click", function() { changeRotation(); });
buttonsBottom.appendChild(buttonRotation);

bmp.canvas.addEventListener("click", reset);

window.addEventListener("resize", function() {
  bmp.canvas.width = sw = window.innerWidth;
  bmp.canvas.height = sh = window.innerHeight;
  container.setSize(sw,sh);
  render();
});

reset();