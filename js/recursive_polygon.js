var isNode = (typeof module !== 'undefined');

if (isNode) {
  // var rand = require('./rand.js');
  var dom = require('./dom.js');
  // var colours = require('./colours.js');
}


function splitPolygon(array, start, end) {
	var copy = array.slice();
	var chunk1 = copy.slice(0, start + 1);
	// console.log("chunk1", chunk1);
	var chunk3 = copy.splice(end, array.length - end);
	// console.log("chunk3", chunk3);
	var chunk2 = array.slice().splice(start, end - start + 1);
	var array1 = chunk1.concat(chunk3);
	var array2 = chunk2;
	return [
		array1,
		array2
	];
}

function lerp(a, b, ratio) {
	return {
		x: a.x + (b.x - a.x) * ratio,
		y: a.y + (b.y - a.y) * ratio
	};
}



var recursive_polygon = function() {

	var sw = 600, sh = 600;
	var bmp = dom.canvas(sw, sh);
	// bmp.ctx.clearRect(0, 0, sw, sh);

	var iterations = 0;
	function drawNext(parent) {
		setTimeout(delayedDraw, 500);
		function delayedDraw() {
			iterations ++;
			if (iterations > 10) return;
			var i;
			if (parent && parent.points) {
				var copied = parent.points.slice();
				var len = copied.length;
				if (len > 3) {
					var offset = rand.getInteger(0, len);
					// shift array around offset
					var shifted = copied.splice(0, offset);
					copied = copied.concat(shifted);

					var slicerStart = 0; // always slice from 0 don't need randomise this now, array has been shifted around.
					var slicerEnd = rand.getInteger(2, len - 2);

					var newArrays = splitPolygon(copied, slicerStart, slicerEnd);
					var pointsA = newArrays[0], pointsB = newArrays[1];

					var colourA = "rgba(255,0,0,0.2)", colourB = "rgba(0,0,255,0.2)";
					// var colourA = colours.mutateColour(parent.colour, 20), colourB = colours.mutateColour(parent.colour, 20);

					con.log("drawNext", iterations, "parent:", len, slicerStart, slicerEnd, "split to", pointsA.length, pointsB.length);

					drawPoints(pointsA, colourA, true);
					drawPoints(pointsB, colourB, true);

					drawNext({points: pointsA, colour: colourA});
					// drawNext({points: pointsB, colour: colourB});

				} else {
					if (len == 3) {
						con.log("drawNext", iterations, "parent:", len, "triangle");

						var newPont = lerp(copied[1], copied[2], rand.getNumber(0.2, 0.8));
						copied.push(newPont);
						// con.log(newPont, copied[1], copied[2]);

						drawNext({points: copied, colour: parent.colour});
						drawPoints(copied, parent.colour, true);

					} else {
						// drawNext({points: copied, colour: parent.colour});
						con.log("drawNext", iterations, "parent:", len, "fail");
					}
				}
			} else {
				con.log("drawNext", iterations, "god");
				i = 0;
				var cx = 0.5;//rand.random();
				var cy = 0.5;//rand.random();
				var sides = 6;//rand.getInteger(15, 68);
				var points = [];
				var angles = [];
				while(angles.length < sides) {
					// angles.push(rand.random());
					angles.push(i / sides);
					i++;
				};
				angles.sort();
				for (i = 0; i < angles.length; i++) {
					var angle = angles[i] * Math.PI * 2;
					var x = cx + Math.sin(angle) * rand.getNumber(0.4, 0.4);
					var y = cy + Math.cos(angle) * rand.getNumber(0.4, 0.4);
					// bmp.ctx.fillRect(x * sw - 2, y * sh - 2, 4, 4);
					points.push({x: x * sw, y: y * sh});
				};
				drawPoints(points, parent.colour);
				drawNext({points: points, colour: parent.colour});
			}
		}
	}

	function drawPoints(points, colour, fill) {
		bmp.ctx.strokeStyle = colour;
		bmp.ctx.lineWidth = 1.5;
		bmp.ctx.beginPath();
		for (var i = 0; i < points.length; i++) {
			var p = points[i];
			bmp.ctx[i == 0 ? "moveTo" : "lineTo"](p.x, p.y);
		};
		bmp.ctx.closePath();
		bmp.ctx.stroke();
		if (fill) {
			// return;
			bmp.ctx.fillStyle = colour;
			bmp.ctx.fill();
		}
	}

	function init() {
		colours.getRandomPalette();
		drawNext({colour: colours.getNextColour()});
		// con.log(iterations);
		// iterations =0;
		// drawNext({colour: "red"});

		progress("render:complete", bmp.canvas);
	}

	return {
		stage: bmp.canvas,
		init: init,
		settings: {}
	}

};

if (isNode) {
  module.exports = recursive_polygon();
} else {
  define("recursive_polygon", recursive_polygon);
}