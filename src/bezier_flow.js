var con = console;
var isNode = (typeof module !== 'undefined');

if (isNode) {
  // Canvas = require('canvas');
  var rand = require('./rand.js');
  var geom = require('./geom.js');
  var dom = require('./dom.js');
  var colours = require('./colours.js');
}



var bezier_flow = function() {

  var settings = {
    renderlimit: {
      min: 1,
      max: Number.POSITIVE_INFINITY,
      cur: 1
    }
  };

  var sw, sh, size;

  // http://www.gorenje.com/karimrashid/en/products/hobs?c=280789

  var bmp = dom.canvas(100, 100);
  var ctx = bmp.ctx;
  var lines, sections, points, lineStyles, exponential, scalePerLine;

  function getPoint(d) {
    return points[(sections + d) % sections];
  }

  function init(options) {
    con.log("init called", rand.getSeed());
    size = options.size;
    sw = size;
    sh = size;
    bmp.setSize(sw, sh);
    lines = rand.getInteger(100, 500);
    settings.renderlimit.max = lines;
    settings.renderlimit.cur = lines;// / 2;
    sections = rand.getInteger(3, 6);
    con.log("sections", sections);

    exponential = rand.random() > 0.5;
    scalePerLine = rand.random() > 0.5;
    constantBaseLine = rand.random() > 0.5;

    points = [];
    lineStyles = [];

    colours.getRandomPalette();

    function baseLineWidth() { return 1 + rand.random() * 3; }
    var fixedConstantBaseLine = baseLineWidth();

    for (var l = 0; l < lines; l++) {
      lineStyles[l] = {
        strokeStyle: colours.getRandomColour(),
        lineWidth: constantBaseLine ? fixedConstantBaseLine : baseLineWidth()
      }
    }

    var baseAngle = 0.0001 + rand.random() * Math.PI;

    /*
    var angles = [];
    while (angles.length < sections) {
      angles.push(rand.random());
    }
    angles.sort();
    con.log(angles);
    */
    var angleVariance = 1 / sections * 0.1;


    for (var p = 0; p < sections; p++) {
      // var a = baseAngle + angles[p] * Math.PI * 2;

      var radius = 0.3 + rand.random() * 0.1;
      var a = baseAngle + (p / sections + rand.getNumber(-angleVariance, angleVariance)) * Math.PI * 2;

      var cx = 0.5 + Math.sin(a) * radius;// + (rand.random() - 0.5) * 0.1;
      var cy = 0.5 + Math.cos(a) * radius;// + (rand.random() - 0.5) * 0.1;
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

    var cx = origin.cx || rand.random();
    var cy = origin.cy || rand.random();
     // a = rand.random() * Math.PI * 2
    var gapScale = rand.random() * 0.7 / lines;

    var gaps = [];
    var total = 0;
    for (var i = 0; i < lines; i++) {
      var gap = (0.1 + rand.random()) * gapScale;
      gaps[i] = total;
      total += gap * (exponential ? Math.pow(2, 1 + (i * 0.2)) * 0.1 : 1);
    }

    // con.log(gaps);

    points.push({
      index: origin.index,
      cx: cx,
      cy: cy,
      a: null,//a,
      total: total,
      gaps: gaps,
      angle: function() {
        var prev = getPoint(this.index - 1);
        var next = getPoint(this.index + 1);
        var dx = next.cx - prev.cx;
        var dy = next.cy - prev.cy;


        this.a = -Math.atan(dy / dx) - (dx < 0 ? 0 : Math.PI);

        // con.log("angle", dy, dx, this.a, -Math.atan(dy/dx));
        // con.log("angle", next.cx, prev.cx);
        // var dot = 14;
        // var x = cx * size, y = cy * size;
        // ctx.fillStyle = "red";
        // ctx.fillRect(x - dot / 2, y - dot / 2, dot, dot);
        // ctx.lineWidth = 1;
        // ctx.strokeStyle = "green";
        // ctx.beginPath();
        // ctx.moveTo(x, y);
        // ctx.lineTo(x + 120 * Math.sin(this.a), y + 120 * Math.cos(this.a));
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
        // var r = gaps[i] - total / 2;
        // var r = gaps[i];
        var r = gaps[i] - 0.2;
        return [
          cx - Math.sin(this.a) * r,
          cy - Math.cos(this.a) * r
        ];
      }
    });

  }

  function render() {

    ctx.clearRect(0, 0, sw, sh);

    con.log("render ========================", settings.renderlimit.cur);

    for (var j = 0; j < settings.renderlimit.cur; j++) {

      // con.log(j);

    // if (true) {


      for (var i = 0, il = points.length; i < il; i++) {


        var p1 = getPoint(i - 1);
        var p2 = getPoint(i);

        p2.move();

        // con.log("p1", p1, p2.move);

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

        // var err = 5;
        // ctx.strokeStyle = "green";
        // ctx.beginPath();
        // ctx.moveTo(x1a * size - err, y1a * size - err);
        // ctx.lineTo(x1b * size - err, y1b * size - err);
        // ctx.stroke();

        // ctx.strokeStyle = "cyan";
        // ctx.beginPath();
        // ctx.moveTo(x2a * size + err, y2a * size + err);
        // ctx.lineTo(x2b * size + err, y2b * size + err);
        // ctx.stroke();

        var inter = geom.intersectionAnywhere(
         {x: x1a, y: y1a},
         {x: x1b, y: y1b},
         {x: x2a, y: y2a},
         {x: x2b, y: y2b}
        );

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
        ctx.lineWidth = lineStyles[j].lineWidth * (scalePerLine ? (j + 1) * 0.1 : 1);
        // ctx.strokeStyle = "rgba(255,255,255,0.2)";
        // ctx.lineWidth = 2;

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

    con.log("render complete called");
    progress("render:complete", bmp.canvas);

  }



  // var resizeMode = "contain";

  var experiment = {
    stage: bmp.canvas,
    init: init,
    settings: settings,
    render: render
  }

  return experiment;

}


if (isNode) {
  module.exports = bezier_flow();
} else {
  define("bezier_flow", bezier_flow);
}