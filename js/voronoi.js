var con = console;

// con.log(colours); // colours is colours.js

// voronoi code was largely lifted from http://rosettacode.org/wiki/Voronoi_diagram
// c ported to javascript

var dot = 1;
var N_SITES = 1 + frand(200);
var site = [];
var rgb = [];
// var edges = [];
var regions = [];
var size_x = 500, size_y = 500;
var width = size_x * dot, height = size_y * dot;


var thisScale = 0.5 + frand(13);
var lineScale = 0.5;
var lineSize = 1;
var lineGap = 4;

var varyRotation = Math.random() > 0.5 ? Math.PI * 2 : Math.PI * 0.2;
var varyPerRegion = Math.random() > 0.5;
var varyPerLine = Math.random() > 0.5;
var varyDuotone = Math.random() > 0.5;

if (varyDuotone) {
	colours.setRandomPalette(0); // this sets black and white (or greys really.)
}




function frand(x) {
	return Math.random() * x;;
}


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

		d = sq2(x1, x2, y1, y2); // flip this for manhattan... 

		if (!k || d < dist) {
			dist = d;
			ret = k;
		}
	}
	return ret;
}


/*
// see if a pixel is different from any neighboring ones 
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



// count number of colours neighbouring a pixel 
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



var AA_RES = 4; // average over 4x4 supersampling grid
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
*/


function gen_map()
{
	var i, j, k, nearest = [], color;

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

			// not really interested in antialiasing.
			// ... but the at edge function is fascinatingly rudimentary

			var color = rgb[nearest[index]];
			if (at_edge(nearest, i, j)) {

				if (at_corner(nearest, i, j) > 2) {
					// edges[ nearest[index] ].push([j,i]);
					color = [255,255,255];
				} else {
					color = [0,0,0];
				}

				// color = [0,0,0];
				// color = aa_color(i, j);
				// color = color.map(function(v) { return v * 1.5} );

			}
			*/



		}
	}

	/* draw regions / sites */
	for (k = 0; k < N_SITES; k++) {

		var r, region = regions[k];

		var pattern = createPattern();

		var regionCanvas = createCanvas(width, height);

		regionCanvas.ctx.globalCompositeOperation = "source-over";
		regionCanvas.ctx.fillStyle = "red";

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
		for (i = site[k][1] - 1; i <= site[k][1] + 1; i++) {
			for (j = site[k][0] - 1; j <= site[k][0] + 1; j++) {
				ctx.fillStyle = "blue";
				var centreMarker = 2;
				var x = site[k][0] * dot;
				var y = site[k][1] * dot;
				ctx.fillRect(x - centreMarker / 2, y - centreMarker / 2, centreMarker, centreMarker);
			}
		}
		*/
	}

}

/*
function gen_edges() {
	// somwhat failed attempt at getting polygons from pixels, but vertices were out of order, so i gave up.
	// a more intelligent approach is required to get vectors. 
	var k, l;
	for (k = 0; k < N_SITES; k++) {
		var edge = edges[k];

		ctx.beginPath();
		ctx.lineWidth = 10;
		ctx.strokeStyle = "blue";

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
*/


for (var k = 0; k < N_SITES; k++) {

	site[k] = [];
	site[k][0] = frand(size_x);
	site[k][1] = frand(size_y);

	// edges[k] = [];
	regions[k] = [];

	// rgb[k] = [];
	// rgb[k][0] = frand(256);
	// rgb[k][1] = frand(256);
	// rgb[k][2] = frand(256);
}


function createPattern() {
	var canvas = createCanvas(width, height);
	var ctx = canvas.ctx;
	// puts the canvas centre so the whole area has a pattern
	ctx.translate(width / 2, height / 2);
	ctx.rotate(frand(varyRotation));
	ctx.translate(-width / 2, -height / 2);

	if (varyDuotone) {
		colours.setColourIndex(1);
		ctx.fillStyle = colours.getCurrentColour();
	} else {
		ctx.fillStyle = colours.getRandomColour();
	}

	var half = width / 2;
	var padding = Math.sqrt( half * half * 2) - half; // the gaps between the corner when rotated 45 degrees

	ctx.fillRect(-padding, -padding, width + padding * 2, height + padding * 2);

	if (varyPerRegion) {
		lineScale = 0.5 + frand(thisScale);
		lineSize = 1 + frand(10) * lineScale;
		lineGap = 2 + frand(3) * lineScale;
	}

	var colour;
	if (varyDuotone) {
		colour = colours.getNextColour();
	}
	var y = -padding;
	while(y < height + padding) {
		if (varyPerLine) {		
			lineSize = 1 + frand(10) * lineScale;
			lineGap = 2 + frand(3) * lineScale;
		}
		if (!varyDuotone) {
			colour = colours.getRandomColour();
		}
		ctx.fillStyle = colour;
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
