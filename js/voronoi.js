var con = console;

var dot = 2;
var N_SITES = 30
var site = [];
var rgb = [];

var size_x = 150, size_y = 150;

function sq2(x, y)
{
	return x * x + y * y;
}

function nearest_site(x, y)
{
	var k, ret = 0;
	var d, dist = 0;
	for (k = 0; k < N_SITES; k++) {
		d = sq2(x - site[k][0], y - site[k][1]);
		if (!k || d < dist) {
			dist = d;
			ret = k;
		}
	}
	return ret;
}

/* see if a pixel is different from any neighboring ones */
function at_edge(color, y, x)
{
	var i, j, c = color[y * size_x + x];
	for (i = y - 1; i <= y + 1; i++) {
		if (i < 0 || i >= size_y) continue;

		for (j = x - 1; j <= x + 1; j++) {
			if (j < 0 || j >= size_x) continue;
			if (color[i * size_x + j] != c) return 1;
		}
	}
	return 0;
}

var AA_RES = 4; /* average over 4x4 supersampling grid */
function aa_color(y, x)
{
	var i, j, n, r = 0, g = 0, b = 0, xx, yy;
	for (i = 0; i < AA_RES; i++) {
		yy = y + 1. / AA_RES * i + .5;
		for (j = 0; j < AA_RES; j++) {
			xx = x + 1. / AA_RES * j + .5;
			n = nearest_site(xx, yy);
			r += rgb[n][0];
			g += rgb[n][1];
			b += rgb[n][2];
		}
	}
	return [
		r / (AA_RES * AA_RES),
		g / (AA_RES * AA_RES),
		b / (AA_RES * AA_RES)
	];
}

function gen_map()
{
	var i, j, k, nearest = [];//size_y * size_x;
	var ptr, buf, color;

	var ptr = [];

	// ptr = buf = 3 * size_x * size_y;
	for (i = 0; i < size_y; i++) {
		for (j = 0; j < size_x; j++) {
			nearest[i * size_x + j] = nearest_site(j, i);
		}
	}

	for (i = 0; i < size_y; i++) {
		for (j = 0; j < size_x; j++) {

			var index = i * size_x + j;

			var color;
			if (!at_edge(nearest, i, j)) {
				color = rgb[nearest[index]];
			} else {
				color = [0,0,0] //aa_color(i, j);
			}

			ctx.fillStyle = "rgba(" + ~~color[0] + "," + ~~color[1] + "," + ~~color[2] + ",1)";

      var x = j;
      var y = i;
      ctx.fillRect(x * dot, y * dot, dot, dot);

		}
	}

	/* draw sites */
	for (k = 0; k < N_SITES; k++) {
		color = (rgb[k][0]*.25 + rgb[k][1]*.6 + rgb[k][2]*.15) > 80 ? 0 : 255;

		var cr = ~~rgb[k][0];
		var cg = ~~rgb[k][1];
		var cb = ~~rgb[k][2];

		for (i = site[k][1] - 1; i <= site[k][1] + 1; i++) {
			for (j = site[k][0] - 1; j <= site[k][0] + 1; j++) {

				ctx.fillStyle = "rgba(" + color + "," + color + "," + color + ",1)";
        var centreMarker = 2;
        var x = site[k][0] * dot;
        var y = site[k][1] * dot;
        ctx.fillRect(x - centreMarker / 2, y - centreMarker / 2, centreMarker, centreMarker);

			}
		}
	}



	// con.log("P6\n%d %d\n255\n", size_x, size_y);
	// con.log(buf, size_y * size_x * 3, 1);

	// con.log(site)
}

var RAND_MAX = 1;
function frand(x) {
	var rand = Math.random() * x;
	return rand;
}

var k;
for (k = 0; k < N_SITES; k++) {

	site[k] = [];
	site[k][0] = frand(size_x);
	site[k][1] = frand(size_y);

	rgb[k] = [];
	rgb[k][0] = frand(256);
	rgb[k][1] = frand(256);
	rgb[k][2] = frand(256);
}

var d = document;
var can = d.createElement("canvas");
can.width = size_x * dot;
can.height = size_y * dot;
d.body.appendChild(can);
var ctx = can.getContext("2d");

gen_map();
