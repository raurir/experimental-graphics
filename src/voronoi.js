/* eslint-disable no-console */
const isNode = typeof module !== "undefined";
const voronoi = (() => {
	// voronoi code was largely lifted from http://rosettacode.org/wiki/Voronoi_diagram
	// c ported to javascript

	// proper (ie vector) voronoi code is here: https://code.google.com/p/javascript-voronoi/downloads/detail?name=JSVoronoi.zip

	const site = [];
	// var rgb = [];
	// var edges = [];
	const regions = [];
	const bounds = [];

	let dot; // pixel size
	let sites;
	let sizeX, sizeY;
	let width, height;

	let debug = false;

	function init(options) {
		dot = options.dot || 1;
		sites = options.sites || 10;
		sizeX = options.sizeX || 200;
		sizeY = options.sizeY || 200;
		width = sizeX * dot;
		height = sizeY * dot;
		debug = options.debug || false;
		return {
			width,
			height,
		};
	}

	// eslint-disable-next-line no-unused-vars
	function sq2(x1, x2, y1, y2) {
		var dx = x1 - x2,
			dy = y1 - y2;
		return dx * dx + dy * dy;
	}

	// eslint-disable-next-line no-unused-vars
	function manhattan(x, x2, y, y2) {
		return Math.abs(x - x2) + Math.abs(y - y2);
	}
	// eslint-disable-next-line no-unused-vars
	function minkowsky(X1, X2, Y1, Y2) {
		return (Math.abs(X2 - X1) * 3 + Math.abs(Y2 - Y1) * 3) * 0.33;
	}

	function nearest_site(x1, y1) {
		var k,
			ret = 0;
		var d,
			dist = 0;
		for (k = 0; k < sites && site[k]; k++) {
			var x2 = site[k][0];
			var y2 = site[k][1];

			d = sq2(x1, x2, y1, y2); // exchange this for manhattan...

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
		var i, j, c = color[y * sizeX + x];
		for (i = y - 1; i <= y + 1; i++) {
			if (i < 0 || i >= sizeY) continue;

			for (j = x - 1; j <= x + 1; j++) {
				if (j < 0 || j >= sizeX) continue;
				if (color[i * sizeX + j] != c) return 1;
			}
		}
		return 0;
	}



	// count number of colours neighbouring a pixel 
	function at_corner(color, y, x) {
		var colours = [];
		var i, j, c = color[y * sizeX + x];
		for (i = y - 1; i <= y + 1; i++) {
			if (i < 0 || i >= sizeY) continue;

			for (j = x - 1; j <= x + 1; j++) {
				if (j < 0 || j >= sizeX) continue;

				var otherColour = color[i * sizeX + j];

				if (colours.indexOf(otherColour) == -1) {
					// colours++;
					colours.push(otherColour);
				}

				// console.log(otherColour, colours)

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

	function genPoints(pointIterator) {
		if (pointIterator == undefined) return console.warn("need to pass in a pointIterator function, which returns an array");
		for (var k = 0; k < sites; k++) {
			site[k] = pointIterator(k, sites);

			// edges[k] = [];
			regions[k] = [];
			bounds[k] = []; // top, right, bottom, left
		}
	}

	function genMap() {
		let i;
		let j;
		let nearest = [];
		// let color;
		let index;
		let pixels = sizeX * sizeY;

		const a = debug && new Date().getTime();

		for (i = 0; i < sizeY; i++) {
			for (j = 0; j < sizeX; j++) {
				index = i * sizeX + j;
				nearest[index] = nearest_site(j, i);

				if (debug && index % 100000 == 0) console.log("findSites", Math.round((index / pixels) * 100) + "%");
			}
		}

		const b = debug && new Date().getTime();

		debug && console.log("Found sites in", b - a, "ms");

		for (i = 0; i < sizeY; i++) {
			for (j = 0; j < sizeX; j++) {
				index = i * sizeX + j;
				const ns = nearest[index];
				regions[ns].push([j, i]);

				if (bounds[ns][0] == undefined) {
					bounds[ns][0] = i;
				} else if (i < bounds[ns][0]) {
					bounds[ns][0] = i;
				}
				if (bounds[ns][1] == undefined) {
					bounds[ns][1] = j;
				} else if (j > bounds[ns][1]) {
					bounds[ns][1] = j;
				}
				if (bounds[ns][2] == undefined) {
					bounds[ns][2] = i;
				} else if (i > bounds[ns][2]) {
					bounds[ns][2] = i;
				}
				if (bounds[ns][3] == undefined) {
					bounds[ns][3] = j;
				} else if (j < bounds[ns][3]) {
					bounds[ns][3] = j;
				}

				if (debug && index % 100000 == 0) console.log("generatingRegion", Math.round((index / pixels) * 100) + "%");

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

		const c = debug && new Date().getTime();

		debug && console.log("Generated regions in", c - b, "ms");

		// sites = 1;

		calcRegionBounds();
	}

	/*
	function gen_edges() {
		// somwhat failed attempt at getting polygons from pixels, but vertices were out of order, so i gave up.
		// a more intelligent approach is required to get vectors.
		var k, l;
		for (k = 0; k < sites; k++) {
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

	function drawRegions(renderRegion) {
		const a = debug && new Date().getTime();
		if (renderRegion == undefined) console.warn("need to pass in a renderRegion function.");
		// for (var k = 3; k < 4; k++) {
		for (var k = 0; k < sites; k++) {
			// for (var k = 0; k < 1; k++) {
			renderRegion(regions[k], bounds[k]);
			// debug && console.log("drawRegions", Math.round((k / sites) * 100) + "%");
		}
		const b = debug && new Date().getTime();

		debug && console.log("Regions drawn in", b - a, "ms - av time per region:", (b - a) / sites);
	}

	function drawSites(ctx) {
		for (var k = 0; k < sites; k++) {
			ctx.fillStyle = "blue";
			var centreMarker = 2;
			var x = site[k][0] * dot;
			var y = site[k][1] * dot;
			ctx.fillRect(x - centreMarker / 2, y - centreMarker / 2, centreMarker, centreMarker);
		}
	}

	function calcRegionBounds() {
		for (var k = 0; k < sites; k++) {
			bounds[k] = {
				// overwriting bounds... no need for xmax or ymax at this point.
				x: bounds[k][3] * dot,
				y: bounds[k][0] * dot,
				width: (bounds[k][1] - bounds[k][3]) * dot,
				height: (bounds[k][2] - bounds[k][0]) * dot,
			};
		}
	}
	function drawRegionBounds(ctx) {
		for (var k = 0; k < sites; k++) {
			ctx.fillStyle = "rgba(0,0,255,0.2)";
			var b = bounds[k];
			ctx.fillRect(b.x, b.y, b.width, b.height);
		}
	}

	return {
		drawRegionBounds,
		drawRegions,
		drawSites,
		genMap,
		genPoints,
		init,
	};
})();
if (isNode) module.exports = voronoi;
