(function() {
var sw = sh = size = 600;

var bmp = dom.canvas(size,size);
var ctx = bmp.ctx;

var lines = 13, sections = 2, points = [];


function createPoint() {

  var cx = Math.random(),
      cy = Math.random(),
      a = Math.random() * Math.PI * 2;
  var gaps = [];
  var total = 0;
  for (var i = 0; i < lines; i++) {
    var gap = Math.random() * 0.05;
    gaps[i] = total;
    total += gap;
  }


  var point = {
    cx: cx,
    cy: cy,
    a: a,
    total: total,
    gaps: gaps,
    lines: []
  };

  for (var i = 0; i < lines; i++) {
    var x = cx - Math.sin(a) * (total / 2 + gaps[i]),
      y = cy - Math.cos(a) * (total / 2 + gaps[i]);
    point.lines[i] = [x,y];
  }

  points.push(point);

}

for (var p = 0; p < sections; p++) {
  createPoint();
}



ctx.lineWidth = 1;

for (var i = 1; i < points.length; i++) {

  var p1 = points[i-1];
  var p2 = points[i];

  var m1 = -Math.tan(p1.a);
  var m2 = -Math.tan(p2.a);

  con.log("m1", m1, p1.a)

  for (var j = 0;j < lines;j++) {

    var x1 = p1.lines[j][0], y1 = p1.lines[j][1],
      x2 = p2.lines[j][0], y2 = p2.lines[j][1];

    var c1 = y1 - m1 * x1;
    var c2 = y2 - m2 * x2;

    // var mx = x1 + (x2 - x1) / 2,
    //    my = y1 + (y2 - y1) / 2;


    // point of screen left
    var x1a = -0.1 * 1e6;
    var y1a = m1 * x1a + c1;
    // point of screen right
    var x1b = 1.1 * 1e6;
    var y1b = m1 * x1b + c1;

    // the other lines point of screen left
    var x2a = -0.1 * 1e6;
    var y2a = m2 * x2a + c2;
    // the other lines point of screen left
    var x2b = 1.1 * 1e6;
    var y2b = m2 * x2b + c2;


    ctx.strokeStyle = "green";
    ctx.beginPath();
    ctx.moveTo(x1a * size, y1a * size);
    ctx.lineTo(x1b * size, y1b * size);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x2a * size, y2a * size);
    ctx.lineTo(x2b * size, y2b * size);
    ctx.stroke();




    var inter = intersection(
     {x: x1a, y: y1a},
     {x: x1b, y: y1b},
     {x: x2a, y: y2a},
     {x: x2b, y: y2b}
    );

    // console.log(inter);

    var dot = 4;
    ctx.fillStyle = "blue";
    ctx.fillRect(x1 * size - dot, y1 * size - dot, dot * 2, dot * 2);
    ctx.fillRect(x2 * size - dot, y2 * size - dot, dot * 2, dot * 2);
    ctx.fillStyle = "yellow";
    ctx.fillRect(inter.x * size - dot, inter.y * size - dot, dot * 2, dot * 2);

    ctx.strokeStyle = "red";
    ctx.beginPath();

    // ctx.moveTo(x1 * size, y1 * size);
    // ctx.lineTo(inter.x * size, inter.y * size);
    // ctx.lineTo(x2 * size, y2 * size);

    ctx.moveTo(x1 * size, y1 * size);
    ctx.quadraticCurveTo(inter.x * size, inter.y * size, x2 * size, y2 * size);

    ctx.stroke();

  }
}

























// http://www.softwareandfinance.com/Turbo_C/Intersection_Two_lines_EndPoints.html might be more suitable.

function intersection(p0, p1, p2, p3) {

    var p0_x = p0.x,
    p0_y = p0.y,
    p1_x = p1.x,
    p1_y = p1.y,
    p2_x = p2.x,
    p2_y = p2.y,
    p3_x = p3.x,
    p3_y = p3.y;

    if (p0_x == p2_x && p0_y == p2_y) return null; // if first point is same as third point
    if (p0_x == p3_x && p0_y == p3_y) return null; // if first point is same as fourth point
    if (p1_x == p2_x && p1_y == p2_y) return null; // if second point is same as third point
    if (p1_x == p3_x && p1_y == p3_y) return null; // if second point is same as fourth point


    var s1_x, s1_y, s2_x, s2_y;
    s1_x = p1_x - p0_x;     s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;     s2_y = p3_y - p2_y;

    var s, t;
    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        // Collision detected
        return {
          x: p0_x + (t * s1_x),
          y: p0_y + (t * s1_y)
        }
    }

    return null; // No collision
}







var resizeMode = "contain";

var meandering = {
  stage: bmp.canvas,
  resize: function(w,h) {
    // sw = w;
    // sh = h;
    // bmp.canvas.width = sw;
    // bmp.canvas.height = sh;
  },
  init: function() {},
  kill: function() {}
}

dispatchEvent(new CustomEvent("load:complete", {detail:meandering}));

})();