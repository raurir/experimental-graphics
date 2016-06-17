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

	var sw = 800, sh = 800;
	var bmp = dom.canvas(sw, sh);
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
			if (depth > 4) return;
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
					// con.log("drawNext", iterations, "parent:", len, "triangle");
					var newPont = lerp(copied[0], copied[2], rand.getNumber(0.5, 0.6));
					copied.push(newPont);
					// con.log(newPont, copied[1], copied[2]);
					// drawNext({points: copied, colour: parent.colour});
					// drawPolygon(copied, parent.colour, true);
					slicerStart = 1;
					slicerEnd = 3;
				} else {
					con.log("drawNext", iterations, "parent:", len, "fail");
				}
			}

			var newArrays = splitPolygon(copied, slicerStart, slicerEnd);
			var pointsA = newArrays[0], pointsB = newArrays[1];
			var colourA = "rgba(255,255,0,0.5)", colourB = "rgba(0,255,255,0.5)";
			var colourA = rand.random() < 0.95 ? colours.mutateColour(parent.colour, 10) : colours.getNextColour();
			var colourB = rand.random() < 0.95 ? colours.mutateColour(parent.colour, 10) : colours.getNextColour();

			// drawPolygon(pointsA, {fillStyle: colourA});
			// drawPolygon(pointsB, {fillStyle: colourB});

			var insetPointsA = drawInset(pointsA, 5);
			var insetPointsB = drawInset(pointsB, 5);

			drawPolygon(insetPointsA, {fillStyle: colourA});//"rgba(0, 0, 0, 0.5)"});
			drawPolygon(insetPointsB, {fillStyle: colourB});//"rgba(0, 0, 0, 0.5)"});

			drawNext({points: pointsA, colour: colourA, depth: depth});
			drawNext({points: pointsB, colour: colourB, depth: depth});

			// drawPolygon(parent.points, "rgba(0,255,255,0.3)", false, 7);
		}
		stack.push(delayedDraw);
	}

	function drawPolygon(points, options) {
		bmp.ctx.beginPath();
		for (var i = 0; i < points.length; i++) {
			var p = points[i];
			bmp.ctx[i == 0 ? "moveTo" : "lineTo"](p.x, p.y);
		};
		bmp.ctx.closePath();
		if (options.lineWidth && options.strokeStyle) {
			bmp.ctx.strokeStyle = options.strokeStyle;
			bmp.ctx.lineWidth = options.lineWidth;
			bmp.ctx.stroke();
		}
		if (options.fillStyle) {
			bmp.ctx.fillStyle = options.fillStyle;
			bmp.ctx.fill();
		}
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
		// drawLine(p0, p1, 'red', 1);
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
		// bmp.ctx.drawCircle(parrallel0.x, parrallel0.y, 4);
		// bmp.ctx.fill();
		// bmp.ctx.beginPath();
		// bmp.ctx.drawCircle(parrallel1.x, parrallel1.y, 4);
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
			// bmp.ctx.beginPath();
			// bmp.ctx.fillStyle = "yellow";
			// bmp.ctx.drawCircle(intersection.x, intersection.y, 5);
			// bmp.ctx.fill();
			insetPoints.push(intersection);
		}
		return insetPoints;
	}

	var perf = (function() {
		var stacks = {};
		return {
			start: function(id) {
				// id = id || 0;
				stacks[id] = {
					timeStart: new Date().getTime()
				};
			},
			end: function(id) {
				// id = id || 0;
				stacks[id].timeEnd = new Date().getTime();
				var time = stacks[id].timeEnd - stacks[id].timeStart;
				con.log("performance", id, time);
				stacks[id].timeProcessing = time;
			}
		}
	})();


	function init() {
		// colours.getRandomPalette();
		// generateParent();

		var offset = 10;
		var points = [{x: 100, y: 200}, {x: 400, y: 400}, {x: 500, y: 200}];//, {x:120, y:40}];
		while (points.length < 1000000) {
			points.push({x: Math.random() * sw, y: Math.random() * sh});
		}
		var point = null;
		addEventListener("keydown", function(e) {
			con.log(e.which);
			switch (e.which) {
				case 38 : offset += 1; break;
				case 40 : offset -= 1; break;
			}
			redraw();
		});
		addEventListener("mousemove", function(e) {
			perf.start("mousemove");
			point = {x: e.x, y: e.y};
			redraw();
			perf.end("mousemove");
		});
		addEventListener("click", function(e) {
			redraw();
		});
		function redraw() {
			perf.start("redraw");
			bmp.ctx.clearRect(0, 0, sw, sh);
			// drawInset(points, offset);
			if (point) {
				perf.start("geom.pointInPolygon");
				var inside = geom.pointInPolygon(points, point);
				perf.end("geom.pointInPolygon");

				perf.start("drawPolygon");
				// drawPolygon(points, {fillStyle: inside ? "green" : "red"});
				perf.end("drawPolygon");
				bmp.ctx.beginPath();
				bmp.ctx.fillStyle = "yellow";
				bmp.ctx.drawCircle(point.x, point.y, 5);
				bmp.ctx.fill();
			}
			perf.end("redraw");
		}
		redraw();

		// drawNext({colour: colours.getNextColour()});
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