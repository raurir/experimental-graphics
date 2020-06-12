/* eslint-disable no-console */
const isNode = typeof module !== "undefined";

if (isNode) {
	// var rand = require("./rand.js");
	// var dom = require("./dom.js");
	// var colours = require("./colours.js");
	// var geom = require("./geom.js");
}

const SHAPE_L = {
	0: {
		blocks: [
			//
			[1, 1],
			[0, 1],
		],
		points: [
			//
			{x: 0, y: 0},
			{x: 2, y: 0},
			{x: 2, y: 2},
			{x: 1, y: 2},
			{x: 1, y: 1},
			{x: 0, y: 1},
		],
	},
	1: {
		blocks: [
			//
			[0, 1],
			[1, 1],
		],
		points: [
			//
			{x: 1, y: 0},
			{x: 2, y: 0},
			{x: 2, y: 2},
			{x: 0, y: 2},
			{x: 0, y: 1},
			{x: 1, y: 1},
		],
	},
	2: {
		blocks: [
			//
			[1, 0],
			[1, 1],
		],
		points: [
			//
			{x: 0, y: 0},
			{x: 1, y: 0},
			{x: 1, y: 1},
			{x: 2, y: 1},
			{x: 2, y: 2},
			{x: 0, y: 2},
		],
	},
	3: {
		blocks: [
			//
			[1, 1],
			[1, 0],
		],
		points: [
			//
			{x: 0, y: 0},
			{x: 2, y: 0},
			{x: 2, y: 1},
			{x: 1, y: 1},
			{x: 1, y: 2},
			{x: 0, y: 2},
		],
	},
};

const tessellation = () => () => {
	const r = rand.instance();
	const c = colours.instance(r);

	const bmp = dom.canvas(1, 1);
	const ctx = bmp.ctx;

	let progress;
	let sh;
	let sw;
	let size;

	let attempt = 0;
	let maxAttempts = 1e6;

	let blocks = 32;
	let block = 1 / blocks;

	let occupied = new Array(blocks * blocks).fill(0);

	var settings = {};

	const dots = [];

	const dotLine = (
		[a, b],
		{
			//lineWidth, strokeStyle,
			fillStyle,
		},
	) => {
		const dx = a.x - b.x;
		const dy = a.y - b.y;
		const jumps = Math.ceil(Math.hypot(dx, dy) / 0.0288);
		for (var i = 0; i < jumps; i++) {
			const {x, y} = geom.lerp(a, b, i / jumps);
			dots.push({x, y});
			ctx.fillStyle = fillStyle;
			ctx.fillRect(x * sw - 3, y * sh - 3, 6, 6);
		}
	};

	const isBusy = (nextOccupied, x, y) => {
		if (x < 0) return false;
		if (x > blocks - 1) return false;
		if (y < 0) return false;
		if (y > blocks - 1) return false;
		const index = y * blocks + x;
		return nextOccupied[index] === 1;
	};

	const testNeighbours = (nextOccupied) => {
		const hmm = nextOccupied.some((o, i) => {
			if (o === 0) {
				// this block is empty, coordinates are:
				const x = i % blocks;
				const y = Math.floor(i / blocks);

				/*
				TL  T   TR  TR2
				L       R   R2  R3
				BL  B   BR  BR2
				B2L B2  B2R
            B3
				*/

				const top = isBusy(nextOccupied, x, y - 1);
				const topRight = isBusy(nextOccupied, x + 1, y - 1);
				const topRightPlusTwo = isBusy(nextOccupied, x + 2, y - 1);
				const right = isBusy(nextOccupied, x + 1, y);
				const rightPlusTwo = isBusy(nextOccupied, x + 2, y);
				const rightPlusThree = isBusy(nextOccupied, x + 3, y);
				const bottomRight = isBusy(nextOccupied, x + 1, y + 1);
				const bottomRightPlusTwo = isBusy(nextOccupied, x + 2, y + 1);
				const bottomPlusTwoRight = isBusy(nextOccupied, x + 2, y + 1);
				const bottom = isBusy(nextOccupied, x, y + 1);
				const bottomPlusTwo = isBusy(nextOccupied, x, y + 2);
				const bottomPlusThree = isBusy(nextOccupied, x, y + 3);
				const bottomPlusTwoLeft = isBusy(nextOccupied, x - 1, y + 2);
				const bottomLeft = isBusy(nextOccupied, x - 1, y + 1);
				const left = isBusy(nextOccupied, x - 1, y);

				if (right || bottom) {
					return true;
				}

				/*
				const isSingleBlock = left && right && top && bottom;
				// console.log("allBusy", allBusy);
				if (isSingleBlock) {
					return true;
				}
				// check horizontal 2 blocks
				const isHorizontalDouble = top && topRight && bottomRight && bottom && left;
				if (isHorizontalDouble) {
					return true;
				}
				// check vertical 2 blocks
				const isVerticalDouble = top && right && bottomRight && bottomLeft && left;
				if (isVerticalDouble) {
					return true;
				}
				*/

				/*
				// check horizontal 3 blocks
				const isHorizontalTriple = top && topRight && topRightPlusTwo && rightPlusThree && bottomRightPlusTwo && bottomRight && bottom && left;
				if (isHorizontalTriple) {
					return true;
				}

				// check vertical 3 blocks
				const isVerticalTriple = top && right && bottomRight && bottomPlusTwoRight && bottomPlusThree && bottomPlusTwoLeft && bottomLeft && left;
				if (isVerticalTriple) {
					return true;
				}
				*/
			}
			return false;
		});
		// console.log("nextOccupied", nextOccupied, hmm);
		return hmm;
	};

	const testPolygon = (shapeBlocks, position) => {
		// console.log("------");
		const test = occupied.slice();
		// shapeBlocks.forEach((row, rowIndex) => {
		for (var i = 0; i < shapeBlocks.length; i++) {
			const row = shapeBlocks[i];
			for (var j = 0; j < row.length; j++) {
				const col = row[j];
				if (col === 1) {
					const x = position.x + j;
					const y = position.y + i;
					// console.log(x, y);
					// console.log(x,y)
					const blockIndex = y * blocks + x;
					if (test[blockIndex] === 1) {
						// console.log("bailing");
						return false;
					}
					test[blockIndex] = 1;
				}
			}
		}
		const problem = testNeighbours(test);
		if (problem) {
			return false;
		}

		occupied = test;
		return true;
	};

	// copied from recursive_polygon
	const drawPolygon = (points, {lineWidth, strokeStyle, fillStyle}) => {
		if (!points || points.length < 2) {
			return;
		}

		// console.log(points);
		const len = points.length;
		ctx.beginPath();
		// ctx.lineCap = "round";
		// ctx.lineJoin = "round";
		points.forEach(({x, y}, i) => {
			ctx[i == 0 ? "moveTo" : "lineTo"](x * sw, y * sh);
		});
		ctx.closePath();
		if (fillStyle) {
			ctx.fillStyle = fillStyle;
			ctx.fill();
		}
		if (lineWidth && strokeStyle) {
			ctx.strokeStyle = strokeStyle;
			ctx.lineWidth = lineWidth * size;
			ctx.stroke();
		}
		for (var i = 0; i < len; i++) {
			dotLine([points[i], points[(i + 1) % len]], {fillStyle: "#000"});
		}
	};

	const populated = [];
	const hashPolygon = () => () => {
		const startIndex = r.getInteger(0, dots.length);
		const otherIndex = r.getInteger(0, dots.length);

		let aIncrementing = startIndex;
		let aDecrementing = startIndex + 1;
		let bIncrementing = otherIndex;
		let bDecrementing = otherIndex + 1;
		let iterations = 0;
		const maxIterations = 20;
		while (populated.length < dots.length && iterations < maxIterations) {
			aIncrementing++;
			aDecrementing--;
			bIncrementing++;
			bDecrementing--;

			const pAInc = dots[(aIncrementing + dots.length) % dots.length];
			const pBDec = dots[(bDecrementing + dots.length) % dots.length];

			const pBInc = dots[(bIncrementing + dots.length) % dots.length];
			const pADec = dots[(aDecrementing + dots.length) % dots.length];

			ctx.fillStyle = "red";
			ctx.fillRect(pAInc.x * sw - 2, pAInc.y * sh - 2, 4, 4);

			ctx.beginPath();
			ctx.strokeStyle = "red";
			ctx.lineWidth = 3;
			ctx.moveTo(pAInc.x * sw, pAInc.y * sh);
			ctx.lineTo(pBDec.x * sw, pBDec.y * sh);
			ctx.stroke();

			ctx.fillStyle = "blue";
			ctx.fillRect(pBInc.x * sw - 2, pBInc.y * sh - 2, 4, 4);

			ctx.beginPath();
			ctx.strokeStyle = "blue";
			ctx.lineWidth = 3;
			ctx.moveTo(pBInc.x * sw, pBInc.y * sh);
			ctx.lineTo(pADec.x * sw, pADec.y * sh);
			ctx.stroke();

			populated.push("d");
			iterations++;
		}
		// console.log("finished", dots, populated);
	};

	const drawShape = (rotation, position) => {
		const {blocks, points} = SHAPE_L[rotation];

		const ok = testPolygon(blocks, position);
		if (!ok) {
			return false;
		}
		ctx.save();
		ctx.scale(block, block);
		ctx.translate(position.x * sw, position.y * sh);
		// ctx.rotate((rotation / 4) * TAU);

		drawPolygon(points, {
			fillStyle: c.getNextColour(),
			lineWidth: 0.1,
			strokeStyle: "#0003",
		});
		ctx.restore();
		return true;
	};

	const drawSet = (rotation) => {
		attempt++;
		const ratioComplete = attempt / maxAttempts;
		// console.log(attempt);
		if (attempt > maxAttempts) {
			console.log("all done...");
			return;
		}
		// drawShape(0, {x: 0, y: 0});

		// :option 1 - pick from onoccupied spots
		// const unoccupiedPos = occupied
		// 	.map((b, index) => ({index, occupied: b})) // convert to list of position indexes.
		// 	.filter(({occupied}) => occupied === 0); // list only available slots
		// const unoccupiedPosIndex = r.getInteger(0, unoccupiedPos.length - 1);
		// const positionIndex = unoccupiedPos[unoccupiedPosIndex].index;
		// const x = positionIndex % blocks;
		// const y = Math.floor(positionIndex / blocks);

		// :option 2 - anywhere
		// const x = r.getInteger(0, (blocks - 2) * ratioComplete + 1);
		// const y = r.getInteger(0, (blocks - 2) * ratioComplete + 1);

		// :option 3 - pick occupied and shift up or down, relies on drawing one in top left first
		const occupiedPos = occupied
			.map((b, index) => ({index, occupied: b})) // convert to list of position indexes.
			.filter(({occupied}) => occupied === 1); // list only occupied slots
		const occupiedPosIndex = r.getInteger(0, occupiedPos.length - 1);
		const positionIndex = occupiedPos[occupiedPosIndex].index;
		const xp = positionIndex % blocks;
		const yp = Math.floor(positionIndex / blocks);

		const checkNext = (xd, yd) => {
			const xn = xp + xd;
			const yn = yp + yd;
			if (xn > blocks) return false;
			if (yn > blocks) return false;
			if (isBusy(xn, yn)) {
				console.log("trying again");
				return checkNext(xn + xd, yn + yd);
			}
			return {x: xn, y: yn};
		};

		const xd = r.getInteger(0, 1); // go right
		const yd = xd ? 0 : 1; //         or down
		const ok = checkNext(xd, yd);
		if (!ok) {
			drawSet();
			return "no good";
		}
		const {x, y} = ok;

		// const x = r.getInteger(0, (blocks - 2) * ratioComplete + 1);
		// const y = r.getInteger(0, (blocks - 2) * ratioComplete + 1);

		const pos = {x, y};
		// const rot = typeof rotation !== "undefined" ? rotation : r.getInteger(0, 3);
		const rot = r.getInteger(0, 3);

		drawShape(rot, pos);
		/*
		if (!ok) {
			ok = drawShape((r + 1) % 4, p);
			if (!ok) {
				ok = drawShape((r + 2) % 4, p);
				if (!ok) {
					drawShape((r + 3) % 4, p);
				}
			}

			return;
		}
		*/
		// hashPolygon();

		// progress("render:complete", bmp.canvas);

		if (attempt % 1000 === 0) {
			// progress("render:progress", ratioComplete);
			setTimeout(() => drawSet(), 10);
		} else {
			drawSet();
		}
	};

	const init = (options) => {
		progress =
			options.progress ||
			(() => {
				console.log("tessellation - no progress defined");
			});
		r.setSeed(options.seed);
		size = options.size;
		sw = options.sw || size;
		sh = options.sh || size;
		c.getRandomPalette();
		bmp.setSize(sw, sh);

		progress("settings:initialised", settings);

		const backgroundColour = "#333";
		ctx.fillStyle = backgroundColour;
		ctx.fillRect(0, 0, sw, sh);

		drawShape(3, {x: 0, y: 0});

		drawSet();
	};

	const update = (settings, seed) => {
		// console.log("update", settings);
		init({progress, seed, size, settings});
	};

	return {
		stage: bmp.canvas,
		init,
		settings,
		update,
	};
};
if (isNode) {
	module.exports = tessellation();
} else {
	define("tessellation", tessellation);
}
