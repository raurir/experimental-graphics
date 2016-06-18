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

	// rand.setSeed(3152156569);

	var sw = 800, sh = 800;
	var bmp = dom.canvas(sw, sh);
	var insetDistance;
	// addEventListener("click", function() {
	// 	if (stack[0]) stack[0]();
	// });


	var stack = [];
	var iterations = 0;
	function drawNext(parent) {
		setTimeout(delayedDraw, 10);
		function delayedDraw() {
			// bmp.ctx.clearRect(0, 0, sw, sh);
			stack.shift();
			var depth = parent.depth + 1;
			if (depth > 7) return;
			iterations ++;
			if (iterations > 4000) return;
			var copied = parent.points.slice();
			var len = copied.length;
			var slicerStart, slicerEnd;
			if (len > 3) {
				var offset = rand.getInteger(0, len);
				// shift array around offset
				var shifted = copied.splice(0, offset);
				copied = copied.concat(shifted);
				slicerStart = 0; // always slice from 0, no need to randomise this, array has been shifted around.
				slicerEnd = rand.getInteger(2, len - 2);
				// con.log("drawNext", iterations, "parent:", len, slicerStart, slicerEnd, "split to", pointsA.length, pointsB.length);
			} else {
				if (len == 3) {

					// var edge = 1;//rand.getInteger(0, 2); // pick which edge to split
					var edge = getLongest(copied);

					// con.log(edge);
					var splitRatio = 0.5; //rand.getNumber(0.1, 0.9));
					var newPoint;
					switch (edge) {
						case 0:
							newPoint = lerp(copied[0], copied[1], splitRatio);
							copied.splice(1, 0, newPoint);
							slicerStart = 1;
							slicerEnd = 3;
							break;
						case 1:
							newPoint = lerp(copied[1], copied[2], splitRatio);
							copied.splice(2, 0, newPoint);
							slicerStart = 0;
							slicerEnd = 2;
							break;
						case 2:
							newPoint = lerp(copied[2], copied[0], splitRatio);
							copied.push(newPoint);
							slicerStart = 1;
							slicerEnd = 3;
					}

					// drawPoint(copied[0], {fillStyle: "red"});
					// drawPoint(copied[1], {fillStyle: "green"});
					// drawPoint(copied[2], {fillStyle: "blue"});
					// drawPoint(newPoint, {fillStyle: "orange"});
					// con.log("drawNext", iterations, "parent:", len, "triangle");


					// con.log(newPoint, copied[1], copied[2]);
					// drawNext({points: copied, colour: parent.colour});
					// drawPolygon(copied, parent.colour, true);
				} else {
					con.log("drawNext", iterations, "parent:", len, "fail");
				}
			}

			var newArrays = splitPolygon(copied, slicerStart, slicerEnd);
			drawSplit(parent, newArrays[0], depth);
			drawSplit(parent, newArrays[1], depth);
			// drawPolygon(parent.points, "rgba(0,255,255,0.3)", false, 7);
		}
		stack.push(delayedDraw);
	}

	function drawSplit(parent, points, depth) {
		// var colourA = "rgba(255,255,0,0.5)", colourB = "rgba(0,255,255,0.5)";
		var colour = rand.random() > 0.95 ? colours.mutateColour(parent.colour, 10) : colours.getNextColour();
		// drawPolygon(points, {lineWidth: 1, strokeStyle: colour});
		var inset = true;//rand.random() > 0.5;
		if (inset) {
			var insetPoints = drawInset(points, insetDistance);
			if (insetPoints) {
				drawPolygon(points, {fillStyle: colour, strokeStyle: colour, lineWidth: 1});
				drawPolygon(insetPoints, {fillStyle: "black"});
				drawNext({points: points, colour: colour, depth: depth});
			}
		} else {
			drawPolygon(points, {fillStyle: colour, strokeStyle: colour, lineWidth: 1});
		}
	}

	function fillAndStroke(options) {
		if (options.lineWidth && options.strokeStyle) {
			bmp.ctx.strokeStyle = options.strokeStyle;
			bmp.ctx.lineWidth = options.lineWidth;
			bmp.ctx.stroke();
		}
		if (options.fillStyle) {
			bmp.ctx.fillStyle = options.fillStyle;
			bmp.ctx.fill();
		}
	}

	function drawPolygon(points, options) {
		bmp.ctx.beginPath();
		for (var i = 0; i < points.length; i++) {
			var p = points[i];
			bmp.ctx[i == 0 ? "moveTo" : "lineTo"](p.x, p.y);
		};
		bmp.ctx.closePath();
		fillAndStroke(options);
		// for (i = 0; i < points.length; i++) {
		// 	var p = points[i];
		// 	bmp.ctx.fillStyle = "#FFF";
		// 	bmp.ctx.font = '18px Helvetica';
		// 	bmp.ctx.fillText("p" + i, p.x, p.y);
		// };
	}

	function drawLine(p0, p1, colour, lineWidth) {
		bmp.ctx.strokeStyle = colour;
		bmp.ctx.lineWidth = lineWidth;
		bmp.ctx.beginPath();
		bmp.ctx.moveTo(p0.x, p0.y);
		bmp.ctx.lineTo(p1.x, p1.y);
		bmp.ctx.stroke();
	}

	function generateParent() {
		var colour = colours.getNextColour()
		// con.log("generateParent");
		var i = 0;
		var cx = 0.5;//rand.random();
		var cy = 0.5;//rand.random();
		var sides = rand.getInteger(3, 8);
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
		// drawPolygon(points, {strokeStyle: colour, lineWidth: 4});
		drawNext({points: points, colour: colour, depth: 0});
	}

	function getLongest(points) {
		function getLength(p0, p1) {
			var dx = p0.x - p1.x, dy = p0.y - p1.y;
			return Math.sqrt(dx * dx + dy * dy);
		}
		var len = 0, edgeIndex = null;
		for (var i = 0, il = points.length; i < il; i++) {
			var p0 = points[i];
			var p1 = points[(i + 1) % il];
			var p0p1Len = getLength(p0, p1);
			if (p0p1Len > len) {
				len = p0p1Len;
				edgeIndex = i;
			}
		};
		con.log(edgeIndex);
		return edgeIndex;
	}

	// http://stackoverflow.com/questions/17195055/calculate-a-perpendicular-offset-from-a-diagonal-line
	function perp(a, b, distance){
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


	function getParallelPoints(p0, p1, offset) {
		// drawLine(p0, p1, 'red', 4);
		var per = perp(p0, p1, offset);
		var parrallel0 = {
			x: p0.x + per.x,
			y: p0.y + per.y
		};
		var parrallel1 = {
			x: p1.x + per.x,
			y: p1.y + per.y
		};
		// drawLine(parrallel0, parrallel1, 'green', 1);
		// bmp.ctx.fillStyle = "green";
		// bmp.ctx.beginPath();
		// bmp.ctx.drawCircle(parrallel0.x, parrallel0.y, 1.5);
		// bmp.ctx.fill();
		// bmp.ctx.beginPath();
		// bmp.ctx.drawCircle(parrallel1.x, parrallel1.y, 1.5);
		// bmp.ctx.fill();
		return [parrallel0, parrallel1];
	}


	function drawInset(points, offset) {
		var parallels = [], insetPoints = [];
		for (var i = 0, il = points.length; i < il; i++) {
			var pp0 = points[i];
			var pp1 = points[(i + 1) % il]; // wrap back to 0 at end of loop!
			// con.log(i, pp0, pp1);
			parallels.push(getParallelPoints(pp0, pp1, offset));
		};
		// con.log(parallels.length);
		for (i = 0, il = parallels.length; i < il; i++) {
			var parallel0 = parallels[i]; // start of line
			var parallel1 = parallels[(i + 1) % il]; // end of line
			var intersection = geom.intersectionAnywhere(
				parallel0[0],
				parallel0[1],
				parallel1[0],
				parallel1[1]
			);
			// con.log(intersection);
			var inside = geom.pointInPolygon(points, intersection);
			if (inside) {
				insetPoints.push(intersection);
			} else {
				// drawPolygon(points, {lineWidth: 1, strokeStyle: "blue"});
				con.warn("fail");
				// return null; // bail, we can't inset this shape!
			}
			// drawPoint(intersection);
		}

		return insetPoints;
	}

	function drawPoint(p, options) {
		// con.log("drawPoint", p);
		bmp.ctx.beginPath();
		bmp.ctx.drawCircle(p.x, p.y, 5);
		fillAndStroke(options);
	}

	function init() {
		insetDistance = rand.getNumber(2, 25);
		colours.getRandomPalette();
		generateParent();
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