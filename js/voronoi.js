var con = console;

// con.log(colours)

colours.setRandomPalette(0);

var dot = 1;
var N_SITES = 1 + frand(200);
var site = [];
var rgb = [];

var edges = [];
var regions = [];

var size_x = 550, size_y = 550;

var width = size_x * dot, height = size_y * dot;

function sq2(x1, x2, y1, y2)
{
	var dx = x1 - x2, dy = y1 - y2;
	return dx * dx + dy * dy;
}

function manhattan(x, x2, y, y2) {
	return Math.abs(x - x2) + Math.abs(y - y2);
}

function minkowsky(X1, X2, Y1, Y2) {
	return (Math.abs(X2 - X1) * 3 + Math.abs(Y2-Y1) * 3) * 0.33
}

function nearest_site(x1, y1)
{
	var k, ret = 0;
	var d, dist = 0;
	for (k = 0; k < N_SITES; k++) {

		var x2 = site[k][0];
		var y2 = site[k][1];

		d = sq2(x1, x2, y1, y2);

		if (!k || d < dist) {
			dist = d;
			ret = k;
		}
	}
	return ret;
}

/* see if a pixel is different from any neighboring ones */
function at_edge(color, y, x) {
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

/* see if a pixel is different from any neighboring ones */
function at_corner(color, y, x) {
	var colours = [];
	var i, j, c = color[y * size_x + x];
	for (i = y - 1; i <= y + 1; i++) {
		if (i < 0 || i >= size_y) continue;

		for (j = x - 1; j <= x + 1; j++) {
			if (j < 0 || j >= size_x) continue;

			var otherColour = color[i * size_x + j];

			if (colours.indexOf(otherColour) == -1) {
				// colours++;
				colours.push(otherColour);
			}

			// con.log(otherColour, colours)

		}
	}
	return colours.length;
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

			var nearestSite = nearest[index];

			regions[nearestSite].push([j,i]);

			/*
			var color = rgb[nearest[index]];
			if (at_edge(nearest, i, j)) {

				if (at_corner(nearest, i, j) > 2) {

					// edges[ nearest[index] ].push([j,i]);

					color = [255,255,255];
				} else {
					color = [0,0,0];
				}

				//color = [0,0,0] //aa_color(i, j);
				// color = aa_color(i, j);
				// color = color.map(function(v) { return v * 1.5} );

			}
			*/



		}
	}

	/* draw regions */

	/* draw sites */
	// for (k = 0; k < 2; k++) {
	for (k = 0; k < N_SITES; k++) {

		var r, region = regions[k], color = rgb[k];

		var pattern = creatPattern();

		var regionCanvas = createCanvas(width, height);

		regionCanvas.ctx.globalCompositeOperation = "source-over";
		regionCanvas.ctx.fillStyle = "rgba(" + ~~color[0] + "," + ~~color[1] + "," + ~~color[2] + ",1)";

		for (r = 0; r < region.length; r++) {
			var x = region[r][0];
			var y = region[r][1];
			regionCanvas.ctx.fillRect(x * dot, y * dot, dot, dot);
		}
		regionCanvas.ctx.globalCompositeOperation = "source-in";
		regionCanvas.ctx.drawImage(pattern,0,0);

		ctx.drawImage(regionCanvas.canvas,0,0);


		// ctx.drawImage(pattern,0,0);


		/*
		color = (rgb[k][0]*.25 + rgb[k][1]*.6 + rgb[k][2]*.15) > 80 ? 0 : 255;

		var cr = ~~rgb[k][0];
		var cg = ~~rgb[k][1];
		var cb = ~~rgb[k][2];

		for (i = site[k][1] - 1; i <= site[k][1] + 1; i++) {
			for (j = site[k][0] - 1; j <= site[k][0] + 1; j++) {

				ctx.fillStyle = "rgba(" + color + "," + color + "," + color + ",0.1)";
        var centreMarker = 2;
        var x = site[k][0] * dot;
        var y = site[k][1] * dot;
        ctx.fillRect(x - centreMarker / 2, y - centreMarker / 2, centreMarker, centreMarker);

			}
		}
		*/
	}



	// con.log("P6\n%d %d\n255\n", size_x, size_y);
	// con.log(buf, size_y * size_x * 3, 1);

	// con.log(site)
}


function gen_edges() {
	var k, l;
	for (k = 0; k < N_SITES; k++) {
		var edge = edges[k];

	    ctx.beginPath();
	   	ctx.lineWidth = 10;
	   	ctx.strokeStyle = crand();

		for(l = 0; l < edge.length; l++) {

			var x = edge[l][0] * dot;
			var y = edge[l][1] * dot;

			if (l == 0) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
		}
		ctx.closePath();
		ctx.stroke();
	}
}

function crand() {
	return "rgba(" + ~~frand(256) + "," + ~~frand(256) + "," + ~~frand(256) + ",1)";
}
function frand(x) {
	return Math.random() * x;;
}

var k;
for (k = 0; k < N_SITES; k++) {

	site[k] = [];
	site[k][0] = frand(size_x);
	site[k][1] = frand(size_y);

	edges[k] = [];
	regions[k] = [];

	rgb[k] = [];
	rgb[k][0] = frand(256);
	rgb[k][1] = frand(256);
	rgb[k][2] = frand(256);
}

var thisScale = 0.5 + frand(13);


function creatPattern() {
	var canvas = createCanvas(width, height);
	var ctx = canvas.ctx;
	ctx.translate(width / 2, height / 2);
	ctx.rotate(frand(Math.PI * 2));
	// ctx.rotate(1/8 * (Math.PI * 2));
	ctx.translate(-width / 2, -height / 2);

	colours.setColourIndex(1);

	ctx.fillStyle = colours.getCurrentColour();//crand();
	// ctx.fillStyle = colours.getRandomColour();//crand();

	var half = width / 2;

	var padding = Math.sqrt( half * half * 2) - half;

	ctx.fillRect(-padding, -padding, width + padding * 2, height + padding * 2);

	var lineScale = 0.5;// + frand(thisScale);
	var lineSize = 1;// 1 + frand(10) * lineScale;
	var lineGap = 4;// 2+ frand(3) * lineScale;


	var colour = colours.getNextColour();//crand();;
	var y = -padding;
	while(y < height + padding) {
		//lineSize = 1 + frand(10) * lineScale;
		//lineGap = 2 + frand(3) * lineScale;
		// ctx.fillStyle = colours.getRandomColour();//crand();
		ctx.fillStyle = colour;//crand();
		ctx.fillRect(-padding, y, width + padding * 2, lineSize);
		y += lineSize + lineGap;
	}

	return canvas.canvas;
}


function createCanvas(w, h) {
	var c = document.createElement("canvas");
	c.width = w;
	c.height = h;
	var ctx = c.getContext("2d");
	return {
		canvas: c,
		ctx: ctx
	}
}

var canvas = createCanvas(width, height);
document.body.appendChild(canvas.canvas);
var ctx = canvas.ctx;

gen_map();

// gen_edges();
