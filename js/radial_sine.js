var sw = window.innerWidth, sh = window.innerHeight;
var bmp = dom.canvas(sw,sh);
var ctx = bmp.ctx;
var layers, rays, colourLayers, lengthLayers, colourBG, oscillators, oscs;

document.body.appendChild(bmp.canvas);

function generate() {
  colours.getRandomPalette();
  colourBG = "#000000"; // colours.getRandomColour();
  colourInner = colours.getNextColour();
  colourOuter = colours.getNextColour();

  layers = ~~(1 + Math.random() * 4);
  colourLayers = [];
  lengthLayers = [0];
  for (var l = 0; l < layers; l++) {
    colourLayers.push(colours.getNextColour());
    lengthLayers.push(Math.random()); // push in random lengths, sort afterwards.
  }
  lengthLayers.sort();
  lengthLayers[layers] = 1; 
  // lengthLayers = [0.1, 0.2, 0.5, 1];
  colourLayers = ["rgba(255,0,0,0.3)", "rgba(0,255,0,0.3)", "rgba(255,0,255,0.3)", "rgba(255,255,0,0.3)"]

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
  ctx.fillStyle = colourBG;
  ctx.fillRect(0, 0, sw, sh);

  var minDimension = (sw > sh ? sh : sw);
  var innerRadius = minDimension / 2 * 0.2;
  var outerRadius = minDimension / 2 * 1;
  var maxRadius = (outerRadius - innerRadius);
  var lineWidth = innerRadius * Math.tan(1 / rays / 2 * Math.PI * 2); // ensure inner lines don't meet.

  // con.log("innerRadius, outerRadius", innerRadius, outerRadius, maxRadius, lengthLayers);

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
    for (var l = 0; l < layers; l++) {
      xs = innerRadius + oscillate(rotation, time) * maxRadius * lengthLayers[l] + lineWidth * 2;
      xe = innerRadius + oscillate(rotation, time) * maxRadius * lengthLayers[l + 1] - lineWidth * 2;
      renderLine(rotation, xs, xe, lineWidth, colourLayers[l]);
    }
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
