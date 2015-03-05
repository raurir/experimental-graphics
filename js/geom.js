var geom = (function() {

	// http://www.softwareandfinance.com/Turbo_C/Intersection_Two_lines_EndPoints.html might be more suitable.

	// alternative
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


	return {
		intersection: intersection
	}

})();

if(typeof module !== 'undefined') module.exports = geom;