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
const getRotationRange = (sides) => {
	const rotationRange = 90 - (180 * (sides - 2)) / sides || 45;
	return ((rotationRange * 3) / 180) * Math.PI;
};

const recursive_polygon = () => () => {
	const r = rand.instance();
	const c = colours.instance(r);
	var progress;
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
			cur: 0,
		},
		background: {
			type: "Boolean",
			label: "Background",
			cur: true,
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
	const {ctx} = bmp;

	var backgroundColour;
	var insetDistance;
	var insetLocked;
	var insetLockedValue;
	var insetThreshold;
	var depthLocked;
	var maxDepth;
	var mutateAmount;
	var mutateThreshold;
	var sides;
	var splitEdgeRatioLocked;
	var splitLongest;
	var wonky;
	var isSierpinski;

	const generateParent = () => {
		const colour = c.getRandomColour();
		let i = 0;
		const angles = [];
		while (angles.length < sides) {
			angles.push((i / sides) * Math.PI * 2);
			i++;
		}
		// angles.sort();
		const points = angles.map((angle) => {
			const radius = wonky ? r.getNumber(0.4, 0.45) : 0.45;
			const x = Math.sin(angle) * radius;
			const y = Math.cos(angle) * radius;
			return {x, y};
		});

		drawNext({points, colour, depth: 0});
	};

	var iterations = 0;
	const drawNext = (parent) => {
		const depth = parent.depth + 1;
		if (depth > maxDepth) return;
		iterations++;
		if (iterations > 10000) return;
		let copied = parent.points.slice();
		const len = copied.length;
		let slicerStart, slicerEnd;
		if (len > 3) {
			const offset = r.getInteger(0, len);
			// shift array around offset
			const shifted = copied.splice(0, offset);
			copied = copied.concat(shifted);
			slicerStart = 0; // always slice from 0, no need to randomise this, array has been shifted around.
			slicerEnd = r.getInteger(2, len - 2);
		} else {
			// len is 3

			if (isSierpinski) {
				var half01 = geom.lerp(copied[0], copied[1], wonky ? r.getNumber(0.4, 0.6) : 0.5);
				var half12 = geom.lerp(copied[1], copied[2], wonky ? r.getNumber(0.4, 0.6) : 0.5);
				var half20 = geom.lerp(copied[2], copied[0], wonky ? r.getNumber(0.4, 0.6) : 0.5);

				var centreTriangle = [half01, half12, half20];
				if (settings.background.cur) {
					drawPolygon(centreTriangle, {fillStyle: backgroundColour});
				} else {
					bmp.ctx.globalCompositeOperation = "destination-out";
					drawPolygon(centreTriangle, {fillStyle: "black"});
					bmp.ctx.globalCompositeOperation = "source-over";
				}
				drawSplit(parent, [copied[0], half01, half20], depth);
				drawSplit(parent, [copied[1], half12, half01], depth);
				drawSplit(parent, [copied[2], half20, half12], depth);
			} else {
				const edge = splitLongest ? getLongest(copied) : r.getInteger(0, 2); // pick which edge to split
				const splitRatio = splitEdgeRatioLocked ? splitEdgeRatioLocked : r.getNumber(0.1, 0.9);
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
		}

		if (!isSierpinski) {
			const [arrayA, arrayB] = splitPolygon(copied, slicerStart, slicerEnd);
			drawSplit(parent, arrayA, depth);
			drawSplit(parent, arrayB, depth);
		}
	};

	const drawSplit = (parent, points, depth) => {
		const colour = mutateThreshold && r.random() < mutateThreshold ? c.mutateColour(parent.colour, mutateAmount) : c.getRandomColour();
		const inset = insetLocked ? insetLockedValue : r.random() > insetThreshold;

		drawPolygon(points, {
			fillStyle: colour,
			strokeStyle: colour,
			lineWidth: 0,
		});

		if (inset) {
			const insetPoints = geom.insetPoints(points, insetDistance);
			if (insetPoints) {
				const inOrder = geom.polygonsSimilar(points, insetPoints);
				if (inOrder) {
					if (settings.background.cur) {
						drawPolygon(insetPoints, {fillStyle: backgroundColour});
					} else {
						ctx.globalCompositeOperation = "destination-out";
						drawPolygon(insetPoints, {fillStyle: "black"});
						ctx.globalCompositeOperation = "source-over";
					}
				}
			}
		}

		// shall we go deeper?
		if (depthLocked || r.random() > 0.2) {
			drawNext({points, colour, depth});
		}
	};

	const fillAndStroke = ({lineWidth, strokeStyle, fillStyle}) => {
		if (lineWidth && strokeStyle) {
			ctx.strokeStyle = strokeStyle;
			ctx.lineWidth = lineWidth;
			ctx.stroke();
		}
		if (fillStyle) {
			ctx.fillStyle = fillStyle;
			ctx.fill();
		}
	};

	const drawPolygon = (points, options) => {
		ctx.beginPath();
		points.forEach(({x, y}, i) => {
			ctx[i == 0 ? "moveTo" : "lineTo"](x * size, y * size);
		});
		ctx.closePath();
		fillAndStroke(options);
		// points.forEach((p, i) => {
		// 	ctx.fillStyle = "#FFF";
		// 	ctx.font = '18px Helvetica';
		// 	ctx.fillText("p" + i, p.x, p.y);
		// });
	};

	const getLength = (a, b) => {
		const dx = a.x - b.x,
			dy = a.y - b.y;
		return Math.hypot(dx, dy);
	};

	const getLongest = (points) => {
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

	const init = (options) => {
		progress =
			options.progress ||
			(() => {
				console.log("recursive_polygon - no progress defined");
			});
		size = options.size;
		sw = options.sw || size;
		sh = options.sh || size;
		r.setSeed(options.seed);
		c.getRandomPalette();
		bmp.setSize(sw, sh);

		settings.rotation.cur = r.getInteger(0, 9);
		settings.background.cur = r.getInteger(0, 4) > 3;
		if (options.settings) {
			settings = options.settings;
		}
		progress("settings:initialised", settings);

		// bias sides towards low polys.
		sides = 3 + Math.round(r.random() * r.random() * r.random() * 28);
		if (sides === 3) {
			isSierpinski = r.random() > 0.8;
		}
		if (sides < 5) {
			wonky = r.random() > 0.8;
		}
		insetDistance = r.getNumber(0.001, 0.02);
		mutateThreshold = r.getInteger(0, 1) && r.getNumber(0, 1); // 0 or any number `between 0 and 1`, since `between 0 and 1` does not include 0!
		mutateAmount = r.getNumber(5, 30);
		maxDepth = r.getInteger(1, 8);
		depthLocked = r.getNumber(0, 1) > 0.5;
		splitLongest = r.random() > 0.5;
		splitEdgeRatioLocked = r.random() > 0.5 ? 0.5 : false;
		insetLocked = r.random() > 0.5;
		if (insetLocked) {
			insetLockedValue = r.random() > 0.5;
		} else {
			insetThreshold = r.random() * 0.5;
		}

		const startAngle = (settings.rotation.cur / settings.rotation.max) * getRotationRange(sides);

		backgroundColour = c.getRandomColour();
		if (settings.background.cur) {
			ctx.fillStyle = backgroundColour;
			ctx.fillRect(0, 0, sw, sh);
		} else {
			ctx.clearRect(0, 0, sw, sh);
		}
		ctx.save();
		ctx.translate(sw * 0.5, sh * 0.5);
		ctx.rotate(startAngle);
		generateParent();
		progress("render:complete", bmp.canvas);
		ctx.restore();
	};

	const update = (settings, seed) => {
		init({progress, seed, size, settings});
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
