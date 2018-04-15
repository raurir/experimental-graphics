var sw = 400, sh = 400;
var bmp = dom.canvas(sw,sh);

var ctx = bmp.ctx;
var cx = sw / 2;
var cy = sh / 2;
var frame = 0;

function newLine() {

  // ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, sw, sh);

  var dot = 70, cols = 9, rows = 13;

  var gap, rotation;

  var phaseLength = 100;
  var phases = 4;

  var anim = frame % (phaseLength * phases);
  var phase = Math.floor(anim / phaseLength);

  anim = (anim - phase * phaseLength) / phaseLength;

  switch(phase) {
    case 0:
      gap = 1 - anim;
      rotation = 1;
      break;
    case 1:
      gap = 0;
      rotation = 1 - anim;
      break;
    case 2:
      gap = anim;
      rotation = 0;
      break;
    case 3:
      gap = 1;
      rotation = anim;
      break;
  }

  var angle = rotation * 30 / 360 * Math.PI * 2;
  var cos = dot * Math.cos(angle);
  var sin = dot * Math.sin(angle);

  function drawCube(x, y, face) {

    // if (y > sh + 20) y -= (sh);

    /*

        b
       / \
      /   \
     /     \
    a       c
    |\     /|
    | \   / |
    |  \ /  |
    f   g   d
     \  |  /
      \ | /
       \|/
        e

    */

    var ax = x,
      ay = y,

      bx = x + cos * rotation,
      by = y - sin,

      cx = x + cos + cos * rotation,
      cy = y,

      dx = cx,
      dy = y + dot,

      ex = x + cos,
      ey = y + sin + dot,

      fx = x,
      fy = y + dot,

      gx = ex,
      gy = y + sin;

    // ctx.strokeStyle = "#222"
    // ctx.lineWidth = 10;
    // ctx.lineCap = "round";
    ctx.beginPath();
    switch(face) {
      case 0:
        ctx.fillStyle = "#444";
        // ctx.strokeStyle = "#000";
        ctx.moveTo(ax, ay);
        ctx.lineTo(gx, gy);
        ctx.lineTo(ex, ey);
        ctx.lineTo(fx, fy);
        break;
      case 1:
        ctx.fillStyle = "#666";
        // ctx.strokeStyle = "#f0f";
        ctx.moveTo(gx, gy);
        ctx.lineTo(cx, cy);
        ctx.lineTo(dx, dy);
        ctx.lineTo(ex, ey);
        break;
      case 2:
        ctx.fillStyle = "#888";
        // ctx.strokeStyle = "#0ff";
        ctx.moveTo(ax, ay);
        ctx.lineTo(gx, gy);
        ctx.lineTo(cx, cy);
        ctx.lineTo(bx, by);
        break;
    }

    ctx.closePath();
    ctx.fill();
    // ctx.stroke();

  }

  var gapX = gapY = 0.4 + gap * 0.6;
  for (var i = 0; i < cols; i++) {
    var x = -10 + i * cos * 2 * gapX;
    for (var j = rows - 1; j > -1; j--) {
      var y = -300 + j * dot * 2 * gapY + i * sin * 2 * gapY;
      drawCube(x, y, 1);
      drawCube(x, y, 2);
      drawCube(x, y, 0);
    }
  }

  frame += 0.5;
  requestAnimationFrame(newLine)
}

document.body.appendChild(bmp.canvas);

newLine();