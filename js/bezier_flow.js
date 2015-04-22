var con = console;
var isNode = (typeof module !== 'undefined');

if (isNode) {
  // Canvas = require('canvas');
  var rand = require('./rand.js');
  var geom = require('./geom.js');
  var dom = require('./dom.js');
  var colours = require('./colours.js');
}



var bezier_flow = (function() {

var sw = sh = size = 800;

// http://www.gorenje.com/karimrashid/en/products/hobs?c=280789

var bmp = dom.canvas(size,size);
var ctx = bmp.ctx;

var lines, sections, radius, points, lineStyles;

function getPoint(d) {
  return points[(sections + d) % sections];
}

var callback;
function init(_callback) {
  callback = _callback;

  lines = 5;//Math.round(10 + rand.random() * 50);
  sections = Math.round(2 + rand.random() * 3);
  // lines = Math.round(3 + rand.random() * 3);
  // sections = 3;
  radius = 0.4 + rand.random() * 0.2;
  points = [];
  lineStyles = [];

  colours.getRandomPalette();

  for (var l = 0; l < lines; l++) {
    lineStyles[l] = {
      strokeStyle: colours.getRandomColour(),
      lineWidth: 1 // + rand.random() * 13
    }
  }

  for (var p = 0; p < sections; p++) {
    var a = p / sections * Math.PI * 2,
      cx = 0.5 + Math.sin(a) * radius,// + (rand.random() - 0.5) * 0.1,
      cy = 0.5 + Math.cos(a) * radius// + (rand.random() - 0.5) * 0.1;
    createPoint({index: p, cx: cx, cy: cy});
  }
  for (var p = 0; p < sections; p++) {
    points[p].angle();
  }

  ctx.clearRect(0, 0, size, size);
  ctx.lineCap = 'round';
  render();

}

function createPoint(origin) {

  var cx = origin.cx || rand.random(),
    cy = origin.cy || rand.random(),
    a = rand.random() * Math.PI * 2
    gapScale = rand.random() / 3 * 5;

  var gaps = [];
  var total = 0;
  for (var i = 0; i < lines; i++) {
    var gap = (0.1 + rand.random()) * gapScale / lines;
    gaps[i] = total;
    total += gap;
  }

  points.push({
    index: origin.index,
    cx: cx,
    cy: cy,
    a: a,
    total: total,
    gaps: gaps,
    angle: function() {
      var prev = getPoint(this.index - 1);
      var next = getPoint(this.index + 1);
      var dx = next.cx - prev.cx;
      var dy = next.cy - prev.cy;
      this.a = -Math.atan(dy/dx) - (dx > 0 ? Math.PI : 0);

      // var x = cx * size, y = cy * size;
      // ctx.fillStyle = "red";
      // ctx.fillRect(x - 2, y - 2, 4, 4);
      // ctx.strokeStyle = "red";
      // ctx.beginPath();
      // ctx.moveTo(x,y);
      // ctx.lineTo(x + 20 * Math.sin(this.a), y + 20 * Math.cos(this.a));
      // ctx.stroke();

      // ctx.strokeStyle = "yellow";
      // ctx.beginPath();
      // ctx.moveTo(this.cx * size, this.cy * size);
      // ctx.lineTo(prev.cx * size, prev.cy * size);
      // ctx.stroke();

    },
    move: function() {
      // this.a += 0.01;
      this.angle();
    },
    lines: function(i) {
      return [
        cx - Math.sin(this.a) * (-total / 2 + gaps[i]),
        cy - Math.cos(this.a) * (-total / 2 + gaps[i])
      ];
    }
  });

}

function render(j) {

  con.log("render ========================");

  for (var j = 0;j < lines;j++) {

  // if (true) {


    for (var i = 0; i < points.length; i++) {


      var p1 = getPoint(i - 1);
      var p2 = getPoint(i);

      p2.move();

      var m1 = -Math.tan(p1.a);
      var m2 = -Math.tan(p2.a);

      var p1l = p1.lines(j);
      var p2l = p2.lines(j);


      var x1 = p1l[0], y1 = p1l[1], x2 = p2l[0], y2 = p2l[1];

      var c1 = y1 - m1 * x1;
      var c2 = y2 - m2 * x2;

      // var mx = x1 + (x2 - x1) / 2,
      //    my = y1 + (y2 - y1) / 2;


      // point of screen left
      var x1a = -0.1;
      var y1a = m1 * x1a + c1;
      // point of screen right
      var x1b = 1.1;
      var y1b = m1 * x1b + c1;

      // the other lines point of screen left
      var x2a = -0.1;
      var y2a = m2 * x2a + c2;
      // the other lines point of screen left
      var x2b = 1.1;
      var y2b = m2 * x2b + c2;


      // ctx.strokeStyle = "green";
      // ctx.beginPath();
      // ctx.moveTo(x1a * size, y1a * size);
      // ctx.lineTo(x1b * size, y1b * size);
      // ctx.stroke();


      // ctx.strokeStyle = "cyan";
      // ctx.beginPath();
      // ctx.moveTo(x2a * size, y2a * size);
      // ctx.lineTo(x2b * size, y2b * size);
      // ctx.stroke();

      var inter = geom.intersectionAnywhere(
       {x: x1a, y: y1a},
       {x: x1b, y: y1b},
       {x: x2a, y: y2a},
       {x: x2b, y: y2b}
      );

      // console.log(inter);

      // var dot = 4;
      // ctx.fillStyle = "blue";
      // ctx.fillRect(x1 * size - dot, y1 * size - dot, dot * 2, dot * 2);
      // ctx.fillRect(x2 * size - dot, y2 * size - dot, dot * 2, dot * 2);
      // ctx.fillStyle = "yellow";
      // ctx.fillRect(inter.x * size - dot, inter.y * size - dot, dot * 2, dot * 2);

      // ctx.strokeStyle = "brown";
      // ctx.beginPath();
      // ctx.moveTo(x1 * size, y1 * size);
      // ctx.lineTo(inter.x * size, inter.y * size);
      // ctx.lineTo(x2 * size, y2 * size);
      // ctx.stroke();

      ctx.strokeStyle = lineStyles[j].strokeStyle;
      ctx.lineWidth = lineStyles[j].lineWidth * (j + 1) * 0.4;

      ctx.beginPath();
      ctx.moveTo(x1 * size, y1 * size);
      ctx.quadraticCurveTo(inter.x * size, inter.y * size, x2 * size, y2 * size);
      ctx.stroke();

    }
  }



  // requestAnimationFrame(render);
  // j++;
  // if ( j < lines) {
  //   setTimeout(function() { render(j)}, 100);
  // }

  callback("render:complete");

}



var resizeMode = "contain";

var experiment = {
  stage: bmp.canvas,
  resize: function(w,h) {
    sw = w;
    sh = h;
    bmp.canvas.width = sw;
    bmp.canvas.height = sh;
  },
  init: init,
  kill: function() {}
}
// dispatchEvent(new CustomEvent("load:complete", {detail: experiment}));

return experiment;

})();

if (isNode) module.exports = bezier_flow;