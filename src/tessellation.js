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
	const backgroundColour = "#0f0";

	let progress;
	let sh;
	let sw;
	let size;

	let attempt = 0;
	let maxAttempts = 2e4;

	let blocks;
	let block;

	let occupied;
	let spots = [];
	let spotId = 1;

	let settings = {};

	const dots = [];

	const dotLine = (
		ctx,
		[a, b],
		{
			//lineWidth, strokeStyle,
			fillStyle,
		},
	) => {
		const dx = a.x - b.x;
		const dy = a.y - b.y;
		const jumps = Math.ceil(Math.hypot(dx, dy) / 0.35);
		ctx.fillStyle = fillStyle;
		for (var i = 0; i < jumps; i++) {
			const {x, y} = geom.lerp(a, b, i / jumps);
			dots.push({x, y});
			ctx.fillRect(x * block * sw - 2, y * block * sw - 2, 4, 4);
		}
	};

	const isBusy = (nextOccupied, x, y) => {
		if (x < 0) return 0;
		if (x > blocks - 1) return 0;
		if (y < 0) return 0;
		if (y > blocks - 1) return 0;
		const index = y * blocks + x;
		return nextOccupied[index] > 0;
	};

	const testNeighbours = (nextOccupied) => {
		// console.log(nextOccupied);
		// const test = nextOccupied.some(({occupied, x, y}, subIndex) => {
		const test = nextOccupied.some((occupied, positionIndex) => {
			const x = positionIndex % blocks;
			const y = Math.floor(positionIndex / blocks);

			if (occupied === 0) {
				// this block is empty
				const top = isBusy(nextOccupied, x, y - 1);
				const topRight = isBusy(nextOccupied, x + 1, y - 1);
				const right = isBusy(nextOccupied, x + 1, y);
				const bottomRight = isBusy(nextOccupied, x + 1, y + 1);
				const bottom = isBusy(nextOccupied, x, y + 1);
				const bottomLeft = isBusy(nextOccupied, x - 1, y + 1);
				const left = isBusy(nextOccupied, x - 1, y);

				const isSingleBlock = left && right && top && bottom;
				if (isSingleBlock) {
					return true;
				}
				// check horizontal 2 blocks
				const isHorizontalDouble = top && topRight && bottomRight && bottom;
				if (isHorizontalDouble) {
					return true;
				}
				// check vertical 2 blocks
				const isVerticalDouble = right && bottomRight && bottomLeft && left;
				if (isVerticalDouble) {
					return true;
				}
			}
			return false;
		});
		// console.log(test);
		return test; // > ;
	};

	const getBlocks = (shapeBlocks, position) => {
		const blocks = [];
		for (var i = 0; i < shapeBlocks.length; i++) {
			const row = shapeBlocks[i];
			for (var j = 0; j < row.length; j++) {
				if (row[j] === 1) {
					const x = position.x + j;
					const y = position.y + i;
					blocks.push({x, y});
				}
			}
		}
		return blocks;
	};

	const testPolygon = (shapeBlocks, position) => {
		const test = occupied.slice();
		const testZone = [];
		let t = 0;
		for (var i = -2; i < 4; i++) {
			for (var j = -2; j < 4; j++) {
				const x = position.x + j;
				const y = position.y + i;

				if (x < 0) continue;
				if (x > blocks - 1) continue;
				if (y < 0) continue;
				if (y > blocks - 1) continue;

				const testIndex = y * blocks + x;

				testZone[t] = {occupied: test[testIndex], x, y};

				if (i > -1 && i < 2 && j > -1 && j < 2) {
					const col = shapeBlocks[i][j];
					if (col === 0) continue;
					// const x = position.x + j;
					// const y = position.y + i;

					const blockIndex = y * blocks + x;
					if (test[blockIndex] > 0) {
						// console.log("bailing");
						return false;
					}
					test[blockIndex] = spotId;
					testZone[t] = {occupied: spotId, x, y};
				}
				t++;
			}
		}

		// console.log(testZone);
		const problem = testNeighbours(test);
		if (problem) {
			return false;
		}

		occupied = test.slice();
		return true;
	};

	// copied from recursive_polygon
	const drawPolygon = (points, {lineWidth, strokeStyle, fillStyle}) => {
		if (!points || points.length < 2) {
			return;
		}

		const polygon = dom.canvas(2 * block * sw, 2 * block * sw);
		// document.body.appendChild(polygon.canvas);
		polygon.ctx.beginPath();
		points.forEach(({x, y}, i) => {
			polygon.ctx[i == 0 ? "moveTo" : "lineTo"](x * block * sw, y * block * sh);
		});
		polygon.ctx.closePath();

		const gradient = polygon.ctx.createLinearGradient(0, 0, r.getNumber(block, 2 * block), r.getNumber(block, 2 * block));
		gradient.addColorStop(0, fillStyle);
		gradient.addColorStop(1, c.mutateColour(fillStyle, 20));

		polygon.ctx.fillStyle = gradient;
		polygon.ctx.fill();

		polygon.ctx.strokeStyle = strokeStyle;
		polygon.ctx.lineWidth = lineWidth;
		polygon.ctx.stroke();

		const len = points.length;
		const dotFillStyle = `#000${r.getInteger(10, 16).toString(16)}`;
		for (var i = 0; i < len; i++) {
			dotLine(polygon.ctx, [points[i], points[(i + 1) % len]], {fillStyle: dotFillStyle});
		}

		return polygon;
	};

	/*
	const populated = [];
	// the origianl idea. sucked.
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
	*/

	const drawShape = (rotation, position) => {
		const shape = SHAPE_L[rotation];

		const ok = testPolygon(shape.blocks, position);
		if (!ok) {
			// drawPolygon(shape.points, {fillStyle: "#f0f"});
			// console.log("failing");
			return false;
		}

		const polygon = drawPolygon(shape.points, {
			fillStyle: c.getNextColour(),
			lineWidth: 0.1,
			strokeStyle: "#000",
		});

		ctx.save();
		ctx.translate((position.x / blocks) * sw, (position.y / blocks) * sh);
		ctx.drawImage(polygon.canvas, 0, 0);
		ctx.restore();

		const sp = getBlocks(shape.blocks, position);
		spots.push({id: spotId, blocks: sp});
		spotId++;

		// ctx.font = "12px Helvetica";
		// ctx.fillStyle = "white";
		// sp.forEach(({x, y}) => {
		// 	ctx.fillText(spotId, ((x + 0.4) / blocks) * sw, ((y - 1) / blocks) * sw + 40);
		// });

		return true;
	};

	const getPosFromUnoccupied = () => {
		// :option 1 - pick from onoccupied spots
		const unoccupiedPos = occupied
			.map((b, index) => ({index, occupied: b})) // convert to list of position indexes.
			.filter(({occupied}) => occupied === 0); // list only available slots
		const unoccupiedPosIndex = r.getInteger(0, unoccupiedPos.length - 1);
		const positionIndex = unoccupiedPos[unoccupiedPosIndex].index;
		const x = positionIndex % blocks;
		const y = Math.floor(positionIndex / blocks);
		return {x, y};
	};

	const getPosFromLeadingEdge = (ratioComplete) => {
		// :option 2 - anywhere
		const x = r.getInteger(0, (blocks - 2) * ratioComplete + 1);
		const y = r.getInteger(0, (blocks - 2) * ratioComplete + 1);
		return {x, y};
	};

	const getPosFromWithinOccupied = () => {
		// :option 3 - pick occupied and shift up or down, relies on drawing one in top left first
		const occupiedPos = occupied
			.map((b, index) => ({index, occupied: b})) // convert to list of position indexes.
			.filter(({occupied}) => occupied > 0); // list only occupied slots
		const occupiedPosIndex = r.getInteger(0, occupiedPos.length - 1);

		const position = occupiedPos[occupiedPosIndex];
		const positionIndex = position ? position.index : 0;
		const x = positionIndex % blocks;
		const y = Math.floor(positionIndex / blocks);

		const dir = r.getInteger(0, 3);
		const xd = dir === 0 ? 1 : dir === 2 ? -1 : 0;
		const yd = dir === 1 ? 1 : dir === 3 ? -1 : 0;

		const checkNext = (x, y) => {
			x += xd;
			y += yd;
			// console.log("checkNext", xd, yd, xn, yn);
			if (x < 0) return false;
			if (y < 0) return false;
			if (x > blocks - 1) return false;
			if (y > blocks - 1) return false;
			if (isBusy(occupied, x, y)) {
				return checkNext(x, y);
			}
			// console.log("Ok", xn, yn);
			return {x, y};
		};

		return checkNext(x, y);
	};

	const getPosFromRadial = (ratioComplete) => {
		const p = ratioComplete * 9;
		const r = ((p * blocks) / 2) * 0.1;
		const a = p * 20;
		const x = Math.round(blocks / 2 + Math.sin(a) * r);
		const y = Math.round(blocks / 2 + Math.cos(a) * r);
		return {x, y};
	};

	const drawSet = () => {
		// console.log("drawSet");
		attempt++;
		const ratioComplete = attempt / maxAttempts;
		const occComplete = occupied.filter((b) => b > 1).length / occupied.length;
		// console.log(occComplete);

		// if (ratioComplete >= 1) {
		if (ratioComplete >= 1) {
			console.log("all done... spots:", spots.length, "occupied:", occupied.filter((b) => b === 0).length);
			// cleanUp();
			// attempt = 0;
			// drawSet();
			return;
		}

		const pos = getPosFromRadial(ratioComplete);

		if (!pos) {
			console.log("not pos");
			drawSet();
			return;
		}
		const rot = r.getInteger(0, 3);
		!drawShape(rot, pos) && //
			!drawShape((rot + 1) % 4, pos) &&
			!drawShape((rot + 2) % 4, pos) &&
			!drawShape((rot + 3) % 4, pos);

		// console.log(pos);
		// hashPolygon();

		// progress("render:complete", bmp.canvas);

		if (attempt % 100 === 0) {
			// progress("render:progress", ratioComplete);
			setTimeout(() => drawSet(), 10);
			// console.log(occupied);
		} else {
			drawSet();
		}
	};

	const clear = (spot) => {
		spot.blocks.forEach(({x, y}) => {
			const pi = y * blocks + x;
			occupied[pi] = 0;
			ctx.fillStyle = backgroundColour;
			ctx.fillRect((x / blocks) * sw, (y / blocks) * sh, block * sw, block * sh);
		});
	};

	const cleanUp = () => {
		const {x, y} = getPosFromUnoccupied();
		// ctx.fillStyle = "red";
		// ctx.fillRect((x / blocks) * sw, (y / blocks) * sh, block * sw, block * sh);
		const top = isBusy(occupied, x, y - 1);
		const right = isBusy(occupied, x + 1, y);
		const bottom = isBusy(occupied, x, y + 1);
		const left = isBusy(occupied, x - 1, y);
		const ids = [top, right, bottom, left].filter((id) => Boolean(id) && r.getNumber(0, 1) > 0.5);
		const found = spots.filter((spot) => ids.includes(spot.id));
		found.forEach(clear);
		const newSpots = spots.filter((spot) => ids.includes(spot.id) === false);
		spots = newSpots;
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

		blocks = r.getInteger(6, 48);
		block = 1 / blocks;
		occupied = new Array(blocks * blocks).fill(0);

		bmp.setSize(sw, sh);

		progress("settings:initialised", settings);

		ctx.fillStyle = backgroundColour;
		ctx.fillRect(0, 0, sw, sh);

		// drawShape(0, {x: 0, y: 0});
		// drawShape(r.getInteger(0, 3), {x: -1, y: -1});
		// drawShape(0, {x: Math.floor(0.5 * blocks), y: Math.floor(0.5 * blocks)});

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
