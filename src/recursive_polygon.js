const isNode = typeof module !== "undefined";
if (isNode) {
	var colours = require("./colours.js");
	var dom = require("./dom.js");
	var geom = require("./geom.js");
	var rand = require("./rand.js");
}

const splitPolygon = (array, start, end) => {
	const copy = array.slice();
	const chunk1 = copy.slice(0, start + 1);
	const chunk3 = copy.splice(end, array.length - end);
	const chunk2 = array.slice().splice(start, end - start + 1);
	const arrayA = chunk1.concat(chunk3);
	const arrayB = chunk2;
	return [arrayA, arrayB];
};

// copied from polygon_slice, see comments there.
const getRotationRange = sides => {
	const rotationRange = 90 - (180 * (sides - 2)) / sides || 45;
	return ((rotationRange * 3) / 180) * Math.PI;
};

const recursive_polygon = () => {
	var size = 500;
	var sw = size;
	var sh = size;

	var settings = {
		// copied from polygon_slice
		rotation: {
			type: "Number",
			label: "Rotation",
			min: 0,
			max: 9,
			cur: 0
		},
		// maxDepth: {
		// 	type: "Number",
		// 	label: "Max Depth",
		// 	min: 2,
		// 	max: 8,
		// 	cur: 2
		// }
	};


	const bmp = dom.canvas(sw, sh);

	var insetDistance;
	var insetLocked;
	var insetLockedValue;
	var insetThreshold;
	var maxDepth;
	var mutateAmount;
	var mutateThreshold;
	var sides;
	var splitEdgeRatioLocked;
	var splitLongest;
	var wonky;

	const generateParent = () => {
		const colour = colours.getNextColour();
		con.log("generateParent", colour);
		let i = 0;
		const cx = 0.5;
		const cy = 0.5;
		const points = [];
		const angles = [];
		while (angles.length < sides) {
			angles.push(i / sides);
			i++;
		}
		// angles.sort();
		const startAngle =
			(settings.rotation.cur / settings.rotation.max) *
			getRotationRange(sides);
		for (i = 0; i < angles.length; i++) {
			const angle = startAngle + angles[i] * Math.PI * 2;
			const radius = wonky ? rand.getNumber(0.4, 0.45) : 0.45;
			const x = cx + Math.sin(angle) * radius;
			const y = cy + Math.cos(angle) * radius;
			points.push({ x: x * sw, y: y * sh });
		}

		drawNext({ points: points, colour: colour, depth: 0 });
	};

	var iterations = 0;
	const drawNext = parent => {
		const depth = parent.depth + 1;
		if (depth > maxDepth) return;
		iterations++;
		if (iterations > 10000) return;
		let copied = parent.points.slice();
		const len = copied.length;
		let slicerStart, slicerEnd;
		if (len > 3) {
			const offset = rand.getInteger(0, len);
			// shift array around offset
			const shifted = copied.splice(0, offset);
			copied = copied.concat(shifted);
			slicerStart = 0; // always slice from 0, no need to randomise this, array has been shifted around.
			slicerEnd = rand.getInteger(2, len - 2);
		} else {
			// len is 3
			const edge = splitLongest
				? getLongest(copied)
				: rand.getInteger(0, 2); // pick which edge to split
			const splitRatio = splitEdgeRatioLocked
				? splitEdgeRatioLocked
				: rand.getNumber(0.1, 0.9);
			let newPoint;
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
		}

		const [arrayA, arrayB] = splitPolygon(copied, slicerStart, slicerEnd);
		drawSplit(parent, arrayA, depth);
		drawSplit(parent, arrayB, depth);
	};

	const drawSplit = (parent, points, depth) => {
		const colour =
			mutateThreshold && rand.random() < mutateThreshold
				? colours.mutateColour(parent.colour, mutateAmount)
				: colours.getNextColour();
		const inset = insetLocked
			? insetLockedValue
			: rand.random() > insetThreshold;

		drawPolygon(points, {
			fillStyle: colour,
			strokeStyle: colour,
			lineWidth: 0
		});

		if (inset) {
			const insetPoints = geom.insetPoints(points, insetDistance);
			if (insetPoints) {
				const inOrder = pointsInOrder(points, insetPoints);
				if (inOrder) {
					// only knock out the inset if the points are in the same order
					// see comment near fn:`pointsInOrder`
					bmp.ctx.globalCompositeOperation = "destination-out";
					drawPolygon(insetPoints, { fillStyle: "black" });
					bmp.ctx.globalCompositeOperation = "source-over";
				}
			}
		}

		// shall we dance?
		if (rand.random() > 0.2) {
			drawNext({ points: points, colour: colour, depth: depth });
		}
	};

	const fillAndStroke = ({ lineWidth, strokeStyle, fillStyle }) => {
		if (lineWidth && strokeStyle) {
			bmp.ctx.strokeStyle = strokeStyle;
			bmp.ctx.lineWidth = lineWidth;
			bmp.ctx.stroke();
		}
		if (fillStyle) {
			bmp.ctx.fillStyle = fillStyle;
			bmp.ctx.fill();
		}
	};

	const drawPolygon = (points, options) => {
		bmp.ctx.beginPath();
		for (var i = 0; i < points.length; i++) {
			var p = points[i];
			bmp.ctx[i == 0 ? "moveTo" : "lineTo"](p.x, p.y);
		}
		bmp.ctx.closePath();
		fillAndStroke(options);
		// points.forEach((p, i) => {
		// 	bmp.ctx.fillStyle = "#FFF";
		// 	bmp.ctx.font = '18px Helvetica';
		// 	bmp.ctx.fillText("p" + i, p.x, p.y);
		// });
	};

	const getLength = (a, b) => {
		const dx = a.x - b.x,
			dy = a.y - b.y;
		return Math.hypot(dx, dy);
	};

	const getLongest = points => {
		var len = 0,
			edgeIndex = null;
		for (var i = 0, il = points.length; i < il; i++) {
			var p0 = points[i];
			var p1 = points[(i + 1) % il];
			var p0p1Len = getLength(p0, p1);
			if (p0p1Len > len) {
				len = p0p1Len;
				edgeIndex = i;
			}
		}
		return edgeIndex;
	};

	const getDelta = (a, b) => {
		return {
			x: a.x - b.x,
			y: a.y - b.y
		};
	};

	/*
	when insetting a polygon if the inset amount exceeds a certain (arbitrary?) value
	the inset shape no longer represents the outer shape in a visually pleasing fashion.
	originally i tried comparing the gradientof all sides, but gradient ab equals gradient ba.
	next i just compared the dx and the dy or every point and its next,
	if the deltas between all points of the two polygons (the original and the inset)
	were of the same sign, the polygons are similar
	https://www.reddit.com/user/raurir/comments/9mo1b9/insetting_polygon_issue/
	https://i.redd.it/5pjqdydk15r11.jpg
	*/
	const pointsInOrder = (pointsA, pointsB) => {
		if (pointsA.length != pointsB.length) {
			con.warn(
				"pointsInOrder invalid arrays, not equal in length!",
				pointsA,
				pointsB
			);
			return false;
		}
		for (let i = 0, il = pointsA.length; i < il; i++) {
			const pA0 = pointsA[i];
			const pA1 = pointsA[(i + 1) % il];
			const pB0 = pointsB[i];
			const pB1 = pointsB[(i + 1) % il];

			const dA = getDelta(pA0, pA1);
			const dB = getDelta(pB0, pB1);

			// how else would you like to write this?
			if (dA.x < 0 && dB.x < 0) {
			} else if (dA.x > 0 && dB.x > 0) {
			} else if (dA.x == 0 && dB.x == 0) {
			} else {
				return false;
			}

			if (dA.y < 0 && dB.y < 0) {
			} else if (dA.y > 0 && dB.y > 0) {
			} else if (dA.y == 0 && dB.y == 0) {
			} else {
				return false;
			}
		}
		return true;
	};

	const init = options => {
		size = options.size;
		sw = options.sw || size;
		sh = options.sh || size;
		bmp.setSize(sw, sh);

		settings.rotation.cur = rand.getInteger(0, 9);
		con.log("settings.rotation.cur", settings.rotation.cur)
		if (options.settings) {
			settings = options.settings;
		}
		progress("settings:initialised", settings);

		// bias sides towards low polys.
		sides =
			3 + Math.round(rand.random() * rand.random() * rand.random() * 28);
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

		colours.getRandomPalette();
		generateParent();
		progress("render:complete", bmp.canvas);
	};

	const update = settings => {
		init({ size, settings });
	};

	return {
		init,
		settings,
		stage: bmp.canvas,
		update,
	};
};

if (isNode) {
	module.exports = recursive_polygon();
} else {
	define("recursive_polygon", recursive_polygon);
}
