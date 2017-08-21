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




var recursive_polygon = function() {

	// rand.setSeed(3807252327);

	var sw = 700, sh = 700;
	var bmp = dom.canvas(sw, sh);
	var insetDistance;
	var mutateThreshold;
	var mutateAmount;
	var maxDepth;
	var sides;
	var splitLongest;
	var splitEdgeRatioLocked;
	var insetLocked, insetLockedValue, insetThreshold;
	var wonky;

	function generateParent() {
		var colour = colours.getNextColour()
		// con.log("generateParent");
		var i = 0;
		var cx = 0.5;
		var cy = 0.5;
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
			var radius = wonky ? rand.getNumber(0.4, 0.45) : 0.45;
			var x = cx + Math.sin(angle) * radius;
			var y = cy + Math.cos(angle) * radius;
			// bmp.ctx.fillRect(x * sw - 2, y * sh - 2, 4, 4);
			points.push({x: x * sw, y: y * sh});
		};
		// drawPolygon(points, {strokeStyle: colour, lineWidth: 4});
		drawNext({points: points, colour: colour, depth: 0});
	}

	var iterations = 0;
	function drawNext(parent) {
		// setTimeout(delayedDraw, 10);
		delayedDraw();
		function delayedDraw() {
			// bmp.ctx.clearRect(0, 0, sw, sh);
			var depth = parent.depth + 1;
			// con.log("drawNext", depth, depth > maxDepth, iterations);
			if (depth > maxDepth) return;
			iterations ++;
			if (iterations > 10000) return;
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
			} else { // len is 3
				var edge = splitLongest ? getLongest(copied) : rand.getInteger(0, 2); // pick which edge to split
				// con.log(edge);
				var splitRatio = splitEdgeRatioLocked ? splitEdgeRatioLocked : rand.getNumber(0.1, 0.9);
				var newPoint;
				switch (edge) {
					case 0:
						newPoint = geom.lerp(copied[0], copied[1], splitRatio);
						copied.splice(1, 0, newPoint);
						slicerStart = 1;
						slicerEnd = 3;
						break;
					case 1:
						newPoint = geom.lerp(copied[1], copied[2], splitRatio);
						copied.splice(2, 0, newPoint);
						slicerStart = 0;
						slicerEnd = 2;
						break;
					case 2:
						newPoint = geom.lerp(copied[2], copied[0], splitRatio);
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
			}

			var newArrays = splitPolygon(copied, slicerStart, slicerEnd);
			drawSplit(parent, newArrays[0], depth);
			drawSplit(parent, newArrays[1], depth);
			// drawPolygon(parent.points, "rgba(0,255,255,0.3)", false, 7);
		}
	}

	function drawSplit(parent, points, depth) {
		// var colourA = "rgba(255,255,0,0.5)", colourB = "rgba(0,255,255,0.5)";
		var colour = (mutateThreshold && rand.random() < mutateThreshold) ?
			colours.mutateColour(parent.colour, mutateAmount) : colours.getNextColour();
		// drawPolygon(points, {lineWidth: 1, strokeStyle: colour});
		var inset = insetLocked ? insetLockedValue : rand.random() > insetThreshold;
		if (inset) {
			var insetPoints = geom.insetPoints(points, insetDistance);
			if (insetPoints) {
				drawPolygon(points, {fillStyle: colour, strokeStyle: colour, lineWidth: 1});
				bmp.ctx.globalCompositeOperation = "destination-out";
				drawPolygon(insetPoints, {fillStyle: "black"});
				bmp.ctx.globalCompositeOperation = "source-over";
				drawNext({points: points, colour: colour, depth: depth});
			}
		} else {
			drawPolygon(points, {fillStyle: colour, strokeStyle: colour, lineWidth: 1});
			if (rand.random() > 0.5) { // if it's filled, maybe not continue
				drawNext({points: points, colour: colour, depth: depth});
			}
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
		// con.log(edgeIndex);
		return edgeIndex;
	}

	function drawPoint(p, options) {
		// con.log("drawPoint", p);
		bmp.ctx.beginPath();
		bmp.ctx.drawCircle(p.x, p.y, 5);
		fillAndStroke(options);
	}

	function init() {
		// sides = rand.getInteger(3, 28);
		sides = 3 + Math.round(rand.random() * rand.random() * rand.random() * 28); // want to bias this towards low polys.
		if (sides < 5) {
			wonky = rand.random() > 0.8;
		}
		insetDistance = rand.getNumber(2, 25);
		mutateThreshold = rand.getNumber(0, 1);
		mutateAmount = rand.getNumber(5, 30);
		maxDepth = rand.getInteger(1, 10);
		splitLongest = rand.random() > 0.5;
		splitEdgeRatioLocked = rand.random() > 0.5 ? 0.5 : false;
		insetLocked = rand.random() > 0.5;
		if (insetLocked) {
			insetLockedValue = rand.random() > 0.5;
		} else {
			insetThreshold = rand.random() * 0.5;
		}

		con.log("sides", sides);
		con.log("wonky", wonky);
		con.log("insetDistance", insetDistance);
		con.log("mutateThreshold", mutateThreshold);
		con.log("mutateAmount", mutateAmount);
		con.log("maxDepth", maxDepth);
		con.log("splitLongest", splitLongest);
		con.log("splitEdgeRatioLocked", splitEdgeRatioLocked);
		con.log("insetLocked", insetLocked);
		con.log("insetLockedValue", insetLockedValue);
		con.log("insetThreshold", insetThreshold);

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