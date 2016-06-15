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
	addEventListener("click", function() {
		if (stack[0]) stack[0]();
	});
	var stack = [];
	var iterations = 0;
	function drawNext(parent) {
		setTimeout(delayedDraw, 10);
		function delayedDraw() {
			// bmp.ctx.clearRect(0, 0, sw, sh);
			stack.shift();
			var depth = parent.depth + 1;
			if (depth > 8) return;
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
					// drawPoints(copied, parent.colour, true);
					slicerStart = 1;
					slicerEnd = 3;
				} else {
					con.log("drawNext", iterations, "parent:", len, "fail");
				}
			}

			var newArrays = splitPolygon(copied, slicerStart, slicerEnd);
			var pointsA = newArrays[0], pointsB = newArrays[1];
			// var colourA = "rgba(255,255,0,0.2)", colourB = "rgba(0,255,255,0.2)";
			var colourA = rand.random() < 0.95 ? colours.mutateColour(parent.colour, 10) : colours.getNextColour();
			var colourB = rand.random() < 0.95 ? colours.mutateColour(parent.colour, 10) : colours.getNextColour();

			drawPoints(pointsA, colourA, true);
			drawPoints(pointsB, colourB, true);

			drawNext({points: pointsA, colour: colourA, depth: depth});
			drawNext({points: pointsB, colour: colourB, depth: depth});

			// drawPoints(parent.points, "rgba(0,255,255,0.3)", false, 7);
		}
		stack.push(delayedDraw);
	}

	function drawPoints(points, colour, fill, lineWidth) {
		bmp.ctx.strokeStyle = colour;
		bmp.ctx.lineWidth = lineWidth ? lineWidth : 1.5;
		// bmp.ctx.lineCap = "round";
		// bmp.ctx.lineCap = "square";
		// con.log(bmp.ctx.lineCap);
		bmp.ctx.beginPath();
		for (var i = 0; i < points.length; i++) {
			var p = points[i];
			bmp.ctx[i == 0 ? "moveTo" : "lineTo"](p.x, p.y);
		};
		bmp.ctx.closePath();
		bmp.ctx.stroke();
		// if (fill) {
		if (rand.random() > 0.9) {
			// return;
			// bmp.ctx.fillStyle = colour;
			// bmp.ctx.fill();
		}
		// if (lineWidth) {
		// 	for (i = 0; i < points.length; i++) {
		// 		var p = points[i];
		// 		bmp.ctx.fillStyle = "#FFF";
		// 		bmp.ctx.font = '18px Helvetica';
		// 		bmp.ctx.fillText("p" + i, p.x, p.y);
		// 	};
		// }

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
		drawPoints(points, colour);
		drawNext({points: points, colour: colour, depth: 0});
	}


	function init() {
		// colours.getRandomPalette();
		// generateParent();

		drawPoints([
			{x: 100, y: 200},
			{x: 500, y: 200},
			{x: 400, y: 400}
		], 'red', false, 1);

		drawPoints([
			{x: 300, y: 250},
			{x: 250, y: 400}
		], 'green', false, 1);

		var intersection = geom.intersectionAnywhere(
			{x: 100, y: 200},
			{x: 400, y: 400},
			{x: 300, y: 250},
			{x: 250, y: 400}
		);

		con.log(intersection);

		bmp.ctx.fillStyle = "blue";
		bmp.ctx.drawCircle(intersection.x, intersection.y, 10);
		bmp.ctx.fill();

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