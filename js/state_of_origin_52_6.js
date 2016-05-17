var con = console;
var isNode = (typeof module !== 'undefined');

if (isNode) {
  var rand = require('./rand.js');
  var dom = require('./dom.js');
}

var state_of_origin_52_6 = function() {

  var QLD = "QLD", NSW = "NSW";
  var font = "180px helvetica" // impact";
  var red = "#f00";
  var bmpSize = 200; // to reduce CPU overheard, do calculations on small image. imprecise, but affordable.
  var overScale; // calculated from bmpSize v printSize
  var output = dom.canvas(1,1);

  // collect progress events and batch em. wtf is this code even? hahaha. not funny.
  var machines = {};
  var progressions = {
    NSW: 0,
    QLD: 0
  };
  var complete = {
    NSW: false,
    QLD: false
  }

  function initState(state, score, x, y, maxGlyphs) {
    // state & are score are obvious

    // x y are positional offsets for typographical aesthetics

    // maxGlyps = QLD can fit more glyphs... because they are a better team...
    // no, because 52 takes up more space than 6...
    // ... go back to my first point.

    var count = 0, countMax = 150 * maxGlyphs;
    var testCanvas = dom.canvas(bmpSize, bmpSize);
    var progressCanvas = dom.canvas(bmpSize, bmpSize);

    // var c0 = document.createElement("div");
    // document.body.appendChild(c0);

    function pointInShape(point) {

      testCanvas.ctx.globalCompositeOperation = 'source-over';
      testCanvas.ctx.drawImage(progressCanvas.canvas, 0, 0);
      testCanvas.ctx.globalCompositeOperation = 'source-in';
      drawShape(testCanvas.ctx, point, false, false);

      var pad = 20;

      var width = Math.ceil(point.size + pad) * 2;
      var height = Math.ceil(point.size + pad);
      var xs = Math.floor(point.x - width);
      var ys = Math.floor(point.y - height * 2);
      width = width * 2;
      height = height * 2;

      var pixels = testCanvas.ctx.getImageData(xs, ys, width, height).data;
      var ok = true;
      for (var x = 0; x < width && ok; x++) {
        for (var y = 0; y < height && ok; y++) {
          var pixel = (y * width + x) * 4;
          ok = pixels[pixel] === 0;
          // con.log(pixels[pixel])
        }
      }

      testCanvas.ctx.globalCompositeOperation = 'source-over';
      testCanvas.ctx.fillStyle = ok ? "rgba(0, 0, 255, 0.25)" : "rgba(255, 0, 0, 0.25)";
      testCanvas.ctx.fillRect(xs, ys, width, height);

      return ok;
    }


    function newPosition() {
      var padX = bmpSize * 0;
      var padY = bmpSize * 0.1;
      return {
        x: padX + rand.random() * (bmpSize - padX * 2),
        y: padY + rand.random() * (bmpSize - padY * 2),
        size: getScaleFromCount(count)// + rand.random() * 3// / ((count + 1) * 0.01)
      }
    }

    function drawShape(target, props, fx, renderOuput) {
      var fillStyle;
      if (fx) {
        // target.shadowColor = '#000';
        // target.shadowBlur = 2;
      }
      var renderScale = renderOuput ? overScale / 2 : 1
      var scale = 2 * props.size / bmpSize * renderScale;
      var x = (props.x - props.size) * renderScale;
      var y = (props.y - props.size) * renderScale;

      if (renderOuput) {
        x += bmpSize * renderScale / 2;
        if (state === NSW) {
          y += bmpSize * renderScale * 0.8;
        }
        var grey = rand.getInteger(200,254);
        fillStyle = "rgb(" + grey + "," + grey + "," + grey + ")";
      } else {
        fillStyle = red;
      }

      target.save();
      target.translate(x, y);
      target.scale(scale, scale);
      target.font = font;
      target.fillStyle = fillStyle;
      target.fillText(state, 0, 0);
      target.restore();
    }

    function generate() {
      var proposed = newPosition();
      var ok = pointInShape(proposed);
      if (ok) {
        count++;
        drawShape(output.ctx, proposed, true, true);
        drawShape(progressCanvas.ctx, proposed, true, false);
      }
    }

    function getScaleFromCount(c) {
      // return 5 - Math.pow(8, (c / (countMax * 1.2)));
      var sc = 0.75 + rand.random() * 4 * (0.001 + countMax - c) / countMax;
      // con.log(c, sc);
      return sc;
    }

    // getScaleFromCount(0);
    // getScaleFromCount(10);
    // getScaleFromCount(20);
    // getScaleFromCount(30);
    // getScaleFromCount(40);
    // getScaleFromCount(countMax);

    progressCanvas.ctx.clearRect(0, 0, bmpSize, bmpSize);
    progressCanvas.ctx.fillStyle = red;
    progressCanvas.ctx.fillRect(0, 0, bmpSize, bmpSize);
    progressCanvas.ctx.globalCompositeOperation = 'destination-out';
    progressCanvas.ctx.save();
    progressCanvas.ctx.translate(bmpSize * x, bmpSize * y);
    progressCanvas.ctx.font = font;
    progressCanvas.ctx.fillText(score, 0, 0);
    progressCanvas.ctx.restore();
    progressCanvas.ctx.globalCompositeOperation = 'source-over';

    function bruteForce() { // like mal squashing lawrie
      // con.log("bruteForce", state, count, countMax);
      if (count < countMax) {
        var iterationsPerFrame = 100;
        for (var i = 0; i < iterationsPerFrame && count < countMax; i++) {
          generate(true);
          generate(false);
        }
        progressions[state] = count / countMax
      } else {
        complete[state] = true;
      }
    }

    machines[state] = bruteForce;
  }

  function init(options) {

    overScale = options.size / bmpSize;
    con.log("state of origin init", options, overScale);
    output.setSize(bmpSize * overScale, bmpSize * overScale);

    initState(QLD, 52, -0.02, 0.9, 3);
    initState(NSW, 6, 0.23, 0.9, 2);
    loop();
  }

  function loop() {
    machines.NSW();
    machines.QLD();
    if (complete.NSW && complete.QLD) {
      progress("render:complete", output.canvas)
    } else {
      progress("render:progress", (progressions.NSW + progressions.QLD) / 2);
      setTimeout(loop, 1);
    }
  }

  var experiment = {
    stage: output.canvas,
    init: init
  }

  return experiment;

};

if (isNode) {
  module.exports = state_of_origin_52_6();
} else {
  define("state_of_origin_52_6", state_of_origin_52_6);
}