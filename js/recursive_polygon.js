var isNode = (typeof module !== 'undefined');

if (isNode) {
  // var rand = require('./rand.js');
  var dom = require('./dom.js');
  // var colours = require('./colours.js');
}

var recursive_polygon = function() {

	var sw = 600, sh = 600;
	var bmp = dom.canvas(sw, sh);
	// bmp.ctx.clearRect(0, 0, sw, sh);

	var iterations = 0;
	function drawNext(parent, thread) {
		setTimeout(delayedDraw, 100);
		function delayedDraw() {
			iterations ++;
			if (iterations > 3000) return;
			var i;
			if (parent && parent.points) {
				con.log("drawNext", parent.points.length, thread);
				if (parent.points.length > 3) {

					var slicerStart = rand.getInteger(1, parent.points.length - 2);
					var slicerEnd = rand.getInteger(slicerStart, parent.points.length);
					var newArrays = splitArray(parents.points, slicerStart, slicerEnd);
					var pointsA = newArrays[0];
					var pointsB = newArrays[1];

					// con.log(parent.points.length, slicerStart, slicerEnd);
					// con.log(pointsA.length, pointsB.length, pointsA, pointsB);
					var colourA = "red";//colours.mutateColour(parent.colour, 20);
					var colourB = "green"; colours.mutateColour(parent.colour, 20);

					drawPoints(pointsA, colourA, true);
					drawPoints(pointsB, colourB, true);

					drawNext({points: pointsA, colour: colourA}, thread);
					drawNext({points: pointsB, colour: colourB}, thread + 1);

				} else {
					if (parent.points.length == 3) {
						drawPoints(parent.points, parent.colour, true);
					} else {
						// drawPoints(parent.points, parent.colour);
					}
				}
			} else {
				i = 0;
				var cx = 0.5;//rand.random();
				var cy = 0.5;//rand.random();
				var sides = 24;//rand.getInteger(15, 68);
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
					var x = cx + Math.sin(angle) * 0.4;//rand.random() / 2;
					var y = cy + Math.cos(angle) * 0.4;//rand.random() / 2;
					// bmp.ctx.fillRect(x * sw - 2, y * sh - 2, 4, 4);
					points.push({x: x * sw, y: y * sh});
				};
				drawPoints(points, parent.colour);
				drawNext({points: points, colour: parent.colour}, thread);
			}
		}
	}

	function drawPoints(points, colour, fill) {
		bmp.ctx.strokeStyle = colour;
		bmp.ctx.lineWidth = 0.5;
		bmp.ctx.beginPath();
		for (var i = 0; i < points.length; i++) {
			var p = points[i];
			bmp.ctx[i == 0 ? "moveTo" : "lineTo"](p.x, p.y);
		};
		bmp.ctx.closePath();
		bmp.ctx.stroke();
		if (fill) {
			bmp.ctx.fillStyle = colour;
			bmp.ctx.fill();
		}
	}

	function init() {
		drawNext({colour: colours.getNextColour()}, 0);
		con.log(iterations);
		iterations =0;
		drawNext({colour: "red"});

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