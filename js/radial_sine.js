var sw = window.innerWidth, sh = window.innerHeight;
var bmp = dom.canvas(sw,sh);
var ctx = bmp.ctx;
var rays, colourInner, colourOuter, colourBG, oscillators, oscs;

document.body.appendChild(bmp.canvas);

function generate() {
  colours.getRandomPalette();
  colourBG = colours.getRandomColour();
  colourInner = colours.getNextColour();
  colourOuter = colours.getNextColour();

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

  render();
}

function oscillate(rotation, time) {
  var t = 0;
  for (var o = 0; o < oscillators; o++) {
    t += (Math.sin(oscs[o].offset + time * oscs[o].speed + rotation * oscs[o].phase) + 1) / 2;
  }
  return t / oscillators;
}

function render(time) {
  ctx.fillStyle = colourBG;
  ctx.fillRect(0, 0, sw, sh);

  var minDimension = (sw > sh ? sh : sw);
  var innerRadius = minDimension / 2 * 0.2;
  var outerRadius = minDimension / 2 * 0.8;
  var lineWidth = innerRadius * Math.tan(1 / rays / 2 * Math.PI * 2);

  function renderLine(rotation, s, e, w, colour) {
    ctx.save();

    ctx.translate(sw / 2, sh / 2);
    ctx.rotate(rotation);

    ctx.beginPath();
    ctx.fillStyle = colour;

    // ctx.lineWidth = 3;
    // ctx.strokeStyle = colour;

    ctx.moveTo(s, -w);
    ctx.lineTo(s + e, -w);
    ctx.arc(s + e, 0, w, -Math.PI / 2, Math.PI / 2, false);
    ctx.lineTo(s + e, w);
    ctx.lineTo(s, w);
    ctx.arc(s, 0, w, Math.PI / 2, -Math.PI / 2, false);

    // ctx.stroke();
    ctx.fill();
    ctx.closePath();

    ctx.restore();
  }

  for (var i = 0; i < rays; i++) {
    var frac = i / rays;
    var rotation = frac * Math.PI * 2;
    var xs = innerRadius;
    var xe = oscillate(rotation, time) * outerRadius;
    renderLine(rotation, xs, xe, lineWidth * 0.5, colourInner);
    xs = xs + xe + lineWidth * 4;
    xe = oscillate(rotation + 0.34, time) * outerRadius;
    renderLine(rotation, xs, xe, lineWidth * 0.8, colourOuter);
  }

}

bmp.canvas.addEventListener("click", generate);

window.addEventListener("resize", function() {
  bmp.canvas.width = sw = window.innerWidth;
  bmp.canvas.height = sh = window.innerHeight;
  render();
});

generate();
animate(0);

function animate(time) {
  requestAnimationFrame(animate);
  render(time);
}
