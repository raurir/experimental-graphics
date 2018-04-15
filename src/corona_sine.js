var isNode = (typeof module !== 'undefined');
var con = console;

if (isNode) {
  var rand = require('./rand.js');
  var dom = require('./dom.js');
  var colours = require('./colours.js');
}

var corona_sine = function() {

  var vector = false;

  var settings = {
    layers: {
      label: "Layers",
      min: 1,
      max: 30,
      cur: 0,
      type: "Number"
    },
    rays: {
      label: "Rays",
      min: 12,
      max: 312,
      cur: 0,
      type: "Number"
    },
    background: {
      type: "Boolean",
      label: "Background",
      cur: true
    }
  };

  var size, sw, sh, stage, ctx, inner, bmp;

  if (typeof window != "undefined") {
    sw = window.innerWidth;
    sh = window.innerHeight;
  }

  if (vector) {
    stage = dom.svg("svg", {width:sw, height:sh});
    inner = dom.svg("g");
    stage.appendChild(inner);
    ctx = stage;
    bmp = stage;
  } else {
    var bmp = dom.canvas(100, 100);
    stage = bmp.canvas;
    ctx = bmp.ctx;
  }

  var lastGenerate, colourLayers, lengthLayers, colourBG, oscillators, oscs;

  function init(options) {
    size = options.size;
    sw = options.sw || size;
    sh = options.sh || size;
    bmp.setSize(sw, sh);
    lastGenerate = new Date().getTime();

    settings.layers.cur = ~~(1 + rand.random() * 4);
    settings.rays.cur = ~~(12 + rand.random() * 300);
    if (options.settings) {
      settings = options.settings;
    }

    progress("settings:initialised", settings);

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

    if (vector) {

      var curve = 1.6; // aprox hack to make a bezier like a circle
      var d = [
        "M", start, ",", -width,
        " L", end, -width,
        " C", end + width * curve, ",", -width, " ", end + width * curve, ",", width, " ", end, ",", width,
        // gave up with arc method, wtf?
        // " A", width, ",", width, " 0 0,0 ", width * 2, ",", width * 2,   // ctx.arc(end, 0, width, -Math.PI / 2, Math.PI / 2, false); // draw cap
        " L", end, ",", width,
        " L", start, ",", width,
        " C", start - width * curve, ",", width, " ", start - width * curve, ",", -width, " ", start, ",", -width,
      ].join("");
      var path = dom.svg("path", {
        d: d,
        fill: colour,
        // stroke: "red", "stroke-width": 1,
        transform: "translate(" + [sw / 2, sh / 2] + ") rotate(" + rotation * 180 / Math.PI + ")"
      });
      inner.appendChild(path);

    } else {
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
  }

  function renderRay(frac, time, innerRadius, maxRadius, lineWidth) {
    var layers = settings.layers.cur;
    var rotation = frac * Math.PI * 2;
    var oscLength = oscillate(rotation, time);
    for (var l = 0; l < layers; l++) {
      var start = innerRadius + oscLength * maxRadius * lengthLayers[l] + lineWidth * 2;
      var end = innerRadius + oscLength * maxRadius * lengthLayers[l + 1] - lineWidth * 2;
      renderLine(rotation, start, end, lineWidth, colourLayers[l]);
    }
  }

  function update(s) {
    rand.random();
    rand.random();
    settings = s;
    render();
  }

  function render(time) {
    if (!time) time = 0;

    colours.getRandomPalette();
    colourBG = colours.getRandomColour();

    var layers = settings.layers.cur
    var rays = settings.rays.cur;

    colourLayers = [];
    lengthLayers = [0];//-0.2];
    for (var l = 0; l < layers; l++) {
      colourLayers.push(colours.getNextColour());
      lengthLayers.push(rand.random()); // push in random lengths, sort afterwards.
    }
    lengthLayers.sort();
    lengthLayers[layers] = 1;

    // colourLayers = ["red", "green", "blue", "yellow", "white"];

    oscillators = ~~(1 + rand.random() * 13);
    oscs = [];
    for (var o = 0; o < oscillators; o++) {
      oscs.push({
        offset: rand.random() * Math.PI * 2,
        phase: ~~(rand.random() * 6),
        speed: rand.random() * 0.003
      });
    };

    // con.log("render", time);
    if (settings.background.cur) {
      ctx.fillStyle = colourBG;
      ctx.fillRect(0, 0, sw, sh);
    } else {
      ctx.clearRect(0, 0, sw, sh);
    }

    var minDimension = (sw > sh ? sh : sw);
    var innerRadius = minDimension / 2 * 0.2;
    var outerRadius = minDimension / 2 * 1;
    var maxRadius = (outerRadius - innerRadius);
    var lineWidth = innerRadius * Math.tan(1 / rays / 2 * Math.PI * 2); // ensure inner lines don't meet.

    // ctx.beginPath();
    // ctx.fillStyle = "#666"
    // ctx.drawCircle(sw / 2, sh / 2, outerRadius);
    // ctx.fill();
    // ctx.beginPath();
    // ctx.fillStyle = "#999"
    // ctx.drawCircle(sw / 2, sh / 2, innerRadius);
    // ctx.fill();
    // return;

    var batchSize = 100;
    function renderBatch(batch) {
      // con.log("renderBatch", batch);
      var start = batch * batchSize, end = start + batchSize;
      if (end > rays) end = rays;
      for (var i = start; i < end; i++) {
        var frac = i / rays;
        renderRay(frac, time, innerRadius, maxRadius, lineWidth);
      }
      if (end < rays) {
        progress("render:progress", end / rays);
        setTimeout(function () {
          renderBatch(batch + 1);
        }, 100);
      } else {
        progress("render:complete", stage);
      }
    }
    renderBatch(0);

  }

  function animate(time) {
    requestAnimationFrame(animate);
    render(time);
  }

  var experiment = {
    stage: stage,
    render: render,
    init: init,
    settings: settings,
    update: update
  }

  return experiment;

};

if (isNode) {
  module.exports = corona_sine();
} else {
  define("corona_sine", corona_sine);
}