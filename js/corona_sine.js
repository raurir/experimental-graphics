var isNode = (typeof module !== 'undefined');

var corona_sine = function() {

  var sw = window.innerWidth, sh = window.innerHeight;
  var bmp = dom.canvas(sw,sh);
  var ctx = bmp.ctx;
  var lastGenerate, layers, rays, colourLayers, lengthLayers, colourBG, oscillators, oscs;

  function generate() {
    lastGenerate = new Date().getTime();
    colours.getRandomPalette();
    colourBG = colours.getRandomColour();

    layers = ~~(1 + Math.random() * 4);
    colourLayers = [];
    lengthLayers = [-0.2];
    for (var l = 0; l < layers; l++) {
      colourLayers.push(colours.getNextColour());
      lengthLayers.push(Math.random()); // push in random lengths, sort afterwards.
    }
    lengthLayers.sort();
    lengthLayers[layers] = 1;

    // colourLayers = ["red", "green", "blue", "yellow", "white"];

    rays = ~~(10 + Math.random() * 300);
    oscillators = ~~(1 + Math.random() * 13);
    oscs = [];
    for (var o = 0; o < oscillators; o++) {
      oscs.push({
        offset: Math.random() * Math.PI * 2,
        phase: ~~(Math.random() * 6),
        speed: Math.random() * 0.003
      });
    };
    render(0);
  }

  function oscillate(rotation, time) {
    var t = 0;
    for (var o = 0; o < oscillators; o++) {
      t += (Math.sin(oscs[o].offset + time * oscs[o].speed + rotation * oscs[o].phase) + 1) / 2;
    }
    return t / oscillators;
  }

  function renderLine(rotation, start, end, width, colour) {
    if (end - start < width / 4) return;

    // con.log("rotation, start, end, width, colour", rotation, start, end, width, colour);

    ctx.save();

    ctx.translate(sw / 2, sh / 2);
    ctx.rotate(rotation);

    ctx.beginPath();
    ctx.fillStyle = colour;

    ctx.moveTo(start, -width);
    ctx.lineTo(end, -width);
    ctx.arc(end, 0, width, -Math.PI / 2, Math.PI / 2, false); // draw cap
    ctx.lineTo(end, width);
    ctx.lineTo(start, width);
    ctx.arc(start, 0, width, Math.PI / 2, -Math.PI / 2, false); // draw cap

    ctx.fill();
    ctx.closePath();

    ctx.restore();
  }



  function render(time) {
    // con.log("render", time);
    ctx.fillStyle = colourBG;
    ctx.fillRect(0, 0, sw, sh);

    var minDimension = (sw > sh ? sh : sw);
    var innerRadius = minDimension / 2 * 0.2;
    var outerRadius = minDimension / 2 * 1;
    var maxRadius = (outerRadius - innerRadius);
    var lineWidth = innerRadius * Math.tan(1 / rays / 2 * Math.PI * 2); // ensure inner lines don't meet.

    // con.log("innerRadius, outerRadius", innerRadius, outerRadius, maxRadius, lengthLayers, colourLayers);

    // ctx.beginPath();
    // ctx.fillStyle = "#666"
    // ctx.drawCircle(sw / 2, sh / 2, outerRadius);
    // ctx.fill();
    // ctx.beginPath();
    // ctx.fillStyle = "#999"
    // ctx.drawCircle(sw / 2, sh / 2, innerRadius);
    // ctx.fill();
    // return;

    for (var i = 0; i < rays; i++) {
      var frac = i / rays;
      var rotation = frac * Math.PI * 2;
      var oscLength = oscillate(rotation, time);
      for (var l = 0; l < layers; l++) {
        var start = innerRadius + oscLength * maxRadius * lengthLayers[l] + lineWidth * 2;
        var end = innerRadius + oscLength * maxRadius * lengthLayers[l + 1] - lineWidth * 2;
        renderLine(rotation, start, end, lineWidth, colourLayers[l]);
      }
    }

  }

  bmp.canvas.addEventListener("click", generate);

  // window.addEventListener("resize", );
  function resize() {
    bmp.canvas.width = sw = window.innerWidth;
    bmp.canvas.height = sh = window.innerHeight;
    render(0);
  }

  // generate();
  // animate(0);

  function animate(time) {
    requestAnimationFrame(animate);
    // if (Math.random() > 0.99 && new Date().getTime() - lastGenerate > 3000) {
    //   generate();
    // }
    render(time);
  }

  var experiment = {
    stage: bmp.canvas,
    inner: null,
    resize: resize,
    init: generate,
    kill: function() {}
  }

  progress("render:complete", bmp.canvas);

  return experiment;

};

if (isNode) {
  module.exports = corona_sine();
} else {
  define("corona_sine", corona_sine);
}