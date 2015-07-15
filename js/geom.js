var geom = (function() {

  // most of these functions have been copied / ported

  // alternative
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



  // http://www.softwareandfinance.com/Turbo_C/Intersection_Two_lines_EndPoints.html might be more suitable.

  function intersectionAnywhere(p0, p1, p2, p3) {

    // con.log("intersectionAnywhere", p0, p1, p2, p3);

    var m1, c1, m2, c2, x1, y1, x2, y2, dx, dy;

    x1 = p0.x;
    y1 = p0.y;
    x2 = p1.x;
    y2 = p1.y;

    dx = x2 - x1;
    dy = y2 - y1;

    m1 = dy / dx;
    // y = mx + c
    // intercept c = y - mx
    c1 = y1 - m1 * x1; // which is same as y2 - slope * x2

    x1 = p2.x;
    y1 = p2.y;
    x2 = p3.x;
    y2 = p3.y;

    dx = x2 - x1;
    dy = y2 - y1;

    m2 = dy / dx;
    // y = mx + c
    // intercept c = y - mx
    c2 = y1 - m2 * x1; // which is same as y2 - slope * x2

    // con.log("Equation of line1: Y = %.2fX %c %.2f\n", m1, (c1 < 0) ? ' ' : '+',  c1);
    // con.log("Equation of line2: Y = %.2fX %c %.2f\n", m2, (c2 < 0) ? ' ' : '+',  c2);

    if(m1 - m2 == 0) {
      // con.log("intersectionAnywhere: no intercept");
      return null
    } else {
      var intersection_X = (c2 - c1) / (m1 - m2);
      var intersection_Y = m1 * intersection_X + c1;
      // con.log("intersectionAnywhere:", intersection_X, intersection_Y);
      return {x: intersection_X, y: intersection_Y};
    }
}









  return {
    intersectionAnywhere: intersectionAnywhere,
    intersectionBetweenPoints: intersectionBetweenPoints
  }

})();

if(typeof module !== 'undefined') module.exports = geom;