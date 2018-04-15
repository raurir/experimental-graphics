var con = con || console;
var geom = (function() {

  // most of these functions have been copied / ported

  // alternative
  // compared algorithm: https://flupe.github.io/blog/2016/07/29/intersection-of-two-segments/
  // is the same as below including peformance.
  function intersectionBetweenPoints(p0, p1, p2, p3) {

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

  // get the equation of a line that goes through two points, ie slope and intercept.
  // doesn't currently deal with divide by zero!
  function linearEquationFromPoints(p0, p1) {
    var dx = p1.x - p0.x;
    var dy = p1.y - p0.y;
    // occasionally finding an irregularity - turns out dx was 0.0000000000003141611368683772161603
    // which for all intents and purposes is 0.
    if (dx == 0 || dx > -0.000001 && dx < 0.000001) {
      con.warn("divide by zero error in geom.linearEquationFromPoints");
      // equation is in the form x = number, rather than y = mx + c
      return {
        c: null,
        m: dy > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY,
        x: p0.x // so define x intercept, equation is x = p0.x
      }
    }
    var m = dy / dx;
    // y = mx + c
    // intercept c = y - mx
    var c = p0.y - m * p0.x; // which is same as p1.y - slope * p1.x
    return {
      c: c,
      m: m
    }
  }

  // http://www.softwareandfinance.com/Turbo_C/Intersection_Two_lines_EndPoints.html might be more suitable.
  function intersectionAnywhere(p0, p1, p2, p3) {
    var intersectionX, intersectionY;
    // con.log("intersectionAnywhere", p0, p1, p2, p3);
    var line0 = linearEquationFromPoints(p0, p1);
    var line1 = linearEquationFromPoints(p2, p3);
    var isLine1Vertical = line0.c === null;
    var isLine2Vertical = line1.c === null;

    if (isLine1Vertical && isLine2Vertical) { // both vertical!, no intercept
      return null;
    } else if (isLine1Vertical) { // handle equations that don't match y = mx + c - lines that are vertical
      intersectionX = line0.x;
      intersectionY = line1.m * intersectionX + line1.c;
    } else if (isLine2Vertical) {
      intersectionX = line1.x;
      intersectionY = line0.m * intersectionX + line0.c;
    } else {
      if (line0.m - line1.m == 0) {
        // con.log("intersectionAnywhere: no intercept");
        return null;
      } else {
        intersectionX = (line1.c - line0.c) / (line0.m - line1.m);
        intersectionY = line0.m * intersectionX + line0.c;
        // con.log("intersectionAnywhere:", intersection_X, intersection_Y);
      }
    }
    if (intersectionY == 0) {
      con.log("intersectionY IS 0!", isLine1Vertical, isLine2Vertical, line0, line1);
      con.log("intersectionY p0 p1", p0, p1);
      con.log("intersectionY p2 p3", p2, p3);
    }

    return {
      x: intersectionX,
      y: intersectionY
    };
  }

  // from https://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
  // also implemented [here](https://github.com/substack/point-in-polygon/blob/master/index.js), but i require points as {x,y}
  // tests show polygon with 10,000,000 points takes < 200ms, 1e6 < 20ms
  function pointInPolygon(polygon, point) {
    var nvert = polygon.length;
    if (nvert && nvert >= 3 && point.x !== undefined && point.y !== undefined) {
      var testx = point.x;
      var testy = point.y;
      var i, j, c = false;
      for (i = 0, j = nvert-1; i < nvert; j = i++) {
        var vxi = polygon[i].x;
        var vyi = polygon[i].y;
        var vxj = polygon[j].x;
        var vyj = polygon[j].y;
        if (((vyi>testy) != (vyj>testy)) && (testx < (vxj-vxi) * (testy-vyi) / (vyj-vyi) + vxi)) {
          c = !c;
        }
      }
      return c;
    } else {
      if (nvert < 3) {
        con.warn("pointInPolygon error - polygon has less than 3 points", polygon);
      } else {
        con.warn("pointInPolygon error - invalid data vertices:", nvert, "polygon:", polygon, "point:", point);
      }
      return null
    }

  }


  function linearInterpolate(a, b, ratio) {
    return {
      x: a.x + (b.x - a.x) * ratio,
      y: a.y + (b.y - a.y) * ratio
    };
  }


  // http://stackoverflow.com/questions/17195055/calculate-a-perpendicular-offset-from-a-diagonal-line
  function perpendincularPoint(a, b, distance){
    var p = {
      x: a.x - b.x,
      y: a.y - b.y
    };
    var n = {
      x: -p.y,
      y: p.x
    };
    var normalisedLength = Math.sqrt((n.x * n.x) + (n.y * n.y));
    n.x /= normalisedLength;
    n.y /= normalisedLength;
    return {
      x: distance * n.x,
      y: distance * n.y
    };
  }

  function parallelPoints(p0, p1, offset) {
    var per = perpendincularPoint(p0, p1, offset);
    var parrallel0 = {
      x: p0.x + per.x,
      y: p0.y + per.y
    };
    var parrallel1 = {
      x: p1.x + per.x,
      y: p1.y + per.y
    };
    return [parrallel0, parrallel1];
  }


  function insetPoints(points, offset) {
    var parallels = [], insets = [];
    for (var i = 0, il = points.length; i < il; i++) {
      var pp0 = points[i];
      var pp1 = points[(i + 1) % il]; // wrap back to 0 at end of loop!
      // con.log(i, pp0, pp1);
      parallels.push(parallelPoints(pp0, pp1, offset));
    };
    con.log("parallels.length", parallels.length);
    for (i = 0, il = parallels.length; i < il; i++) {
      var parallel0 = parallels[i]; // start of line
      var parallel1 = parallels[(i + 1) % il]; // end of line
      var intersection = intersectionAnywhere(
        parallel0[0],
        parallel0[1],
        parallel1[0],
        parallel1[1]
      );
      con.log("intersection", intersection);
      var inside = pointInPolygon(points, intersection);
      if (inside) {
        insets.push(intersection);
      } else {
        // drawPolygon(points, {lineWidth: 1, strokeStyle: "blue"});
        con.warn("geom.insetPoints fail, not inside");
        return null; // bail, we can't inset this shape!
      }
      // drawPoint(intersection);
    }
    return insets;
  }




  return {
    insetPoints: insetPoints,
    intersectionAnywhere: intersectionAnywhere,
    intersectionBetweenPoints: intersectionBetweenPoints,
    lerp: linearInterpolate,
    linearEquationFromPoints: linearEquationFromPoints,
    parallelPoints: parallelPoints,
    perpendincularPoint: perpendincularPoint,
    pointInPolygon: pointInPolygon,
  }

})();

if(typeof module !== 'undefined') module.exports = geom;