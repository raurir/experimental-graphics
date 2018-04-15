// https://codepen.io/raurir/pen/MoppPE/

//  convert -delay 1  *.png animation.gif

const con = console;
const dom = require("./dom.js");
const fs = require("fs");

const size = 300;
const centre = size / 2;
const gridY = 12;
const gridX = gridY * 4;
const thirty = Math.PI / 6;
const sinThirty = Math.sin(thirty);
const cosThirty = Math.cos(thirty);

const c = dom.canvas(size, size);
const ctx = c.ctx;

var unit = 90;

const saveFile = (canvas, frame, cb) => {
  const filename = '/../export/' + (String(frame).length == 1 ? "0" : "") + frame + '.png';
  canvas.toBuffer((err, buf) => {
    if (err) {
      con.log("saveFile err", err);
    } else {
      fs.writeFile(__dirname + filename, buf, () => {
        con.log("saveFile success", typeof buf, __dirname + filename);
        cb();
      });
    }
  });
}



const draw = (x, y) => {
  const drawLeaf = (angle) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(sinThirty * unit, cosThirty * unit);
    ctx.lineTo(0, cosThirty * unit * 2);
    ctx.lineTo(-sinThirty * unit, cosThirty * unit);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
  drawLeaf(thirty * 1);
  drawLeaf(thirty * 5);
  drawLeaf(thirty * 9);
}

const frames = 32, loops = 3;
const render = (frame) => {

  //time *= 6;
  // requestAnimationFrame(render);
  var scale = Math.sin(frame / frames * Math.PI * 2 - Math.PI / 2) + 1.98; // 2 is perfect here, but no to harmony.
  //scale *= 0.1;
  unit = 51;//(Math.sin(time * 0.0002) + 2) * 30;
  var angle = Math.floor(frame / frames) * Math.PI * 2 / 3 / 4; //Math.sin(time * 0.0001 * Math.PI);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = "#d11"; // this is mistabishi red https://www.youtube.com/watch?v=is-HVxmUELQ
  ctx.save();
  ctx.translate(centre, centre);
  ctx.rotate(angle);
  ctx.translate(-centre, -centre);
  var gx = 0;
  while (gx++ < gridX) {
    var gy = 0;
    while (gy++ < gridY) {
      var x = centre + (gx - gridX / 2) * cosThirty * unit * scale,
          y = centre + ((gx % 2 * 3) + (gy - gridY / 2) * 6) * sinThirty * unit * scale;
      draw(x, y);
    }
  }
  ctx.restore();
  saveFile(c.canvas, frame, () => {
    frame++;
    if (frame < frames * loops) {
      render(frame);
    }
  });
}
render(0);