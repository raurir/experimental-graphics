/* eslint-disable no-console */
/* eslint-disable indent */
const isNode = typeof module !== "undefined";

if (isNode) {
	// var rand = require("./rand.js");
	// var dom = require("./dom.js");
	// var colours = require("./colours.js");
	// var geom = require("./geom.js");
}

// prettier-ignore
const SHAPE_L  =




{"0":{"blocks":[
[1, 1], [0, 1]],
"points":[{"x":0
,y: 0},{"x":2,y:
0},{"x":2,"y":2}
        ,{"x":1,
        "y":2},{
        "x":1, y
        :1},{"x"
        :0,"y":1




        }]},"1":
        {blocks:
        [[0, 1],
        [1, 1]],
        "points"
:[{"x":1,"y":0},
{"x":2,"y":0},{x
:2,"y":2},{"x":0
,"y":2},{"x":0,y
:1},{"x":1,"y":1




}]},"2":
{blocks:
[[1, 0],
[1, 1]],
"points"
:[{"x":0,"y":0},
{"x":1,"y":0},{x
:1,"y":1},{"x":2
,"y":1},{"x":2,y
:2},{"x":0,y:2}]




},"3":{"blocks":
[[1, 1], [1,0]],
"points":[{"x":0
,"y":0},{"x":2,y
:0},{"x":2,"y":1
},{"x":1
,"y":1},
{x:1, y:
2},{x:0,
y:2}]}};

/*

^ homage to @aemkei

indeed 'points' are no longer needed but the original idea with dotLine and hashPolygon (removed)
needed to draw around the perimeter

*/

const tessellation = () => () => {
	const r = rand.instance();
	const c = colours.instance(r);

	const bmp = dom.canvas(1, 1);
	const ctx = bmp.ctx;
	const backgroundColour = "#000";

	let progress;
	let sh;
	let sw;
	let size;

	let attempt = 0;
	let maxAttempts = 1e5;

	let blocks;
	let block;

	let occupied;
	let spots = [];
	let spotId = 1;

	let settings = {};

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
			ctx.fillRect(Math.floor(x * block * sw - 2), Math.floor(y * block * sw - 2), 4, 4);
		}
	};

	const isBusy = (nextOccupied, x, y) => {
		if (x < 0) return 0;
		if (x > blocks - 1) return 0;
		if (y < 0) return 0;
		if (y > blocks - 1) return 0;
		const index = y * blocks + x;
		return nextOccupied[index];
	};

	const testNeighbours = (nextOccupied) => {
		return nextOccupied.some((occupied, positionIndex) => {
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
	};

	const getBlocks = (shapeBlocks, position) => {
		const blocks = []; // shapeBlocks.reduce blah blah
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
		for (var i = 0; i < 2; i++) {
			for (var j = 0; j < 2; j++) {
				const x = position.x + j;
				const y = position.y + i;

				if (x < 0) continue;
				if (x > blocks - 1) continue;
				if (y < 0) continue;
				if (y > blocks - 1) continue;

				const col = shapeBlocks[i][j];
				if (col === 0) continue;

				const blockIndex = y * blocks + x;
				if (test[blockIndex] > 0) {
					return false;
				}
				test[blockIndex] = spotId;
			}
		}

		const problem = testNeighbours(test);
		if (problem) {
			return false;
		}

		occupied = test;
		return true;
	};

	const drawPolygon = (points, {lineWidth, strokeStyle, fillStyle}) => {
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

		// const len = points.length;
		// const dotFillStyle = `rgba(0,0,0,${r.getInteger(50, 255)}`;
		// for (var i = 0; i < len; i++) {
		//   dotLine(polygon.ctx, [points[i], points[(i + 1) % len]], {fillStyle: dotFillStyle});
		// }

		return polygon;
	};

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
			// fillStyle: c.getRandomColour(),
			lineWidth: 0.1,
			strokeStyle: "#000",
		});

		const x = (position.x / blocks) * sw;
		const y = (position.y / blocks) * sh;

		ctx.save();
		ctx.translate(x - sw / 2, y - sh / 2);
		ctx.drawImage(polygon.canvas, 0, 0);
		ctx.restore();

		// center point
		// ctx.fillStyle = "white";
		// ctx.fillRect(0 - 10, 0 - 10, 20, 20);

		const sp = getBlocks(shape.blocks, position);
		spots.push({id: spotId, blocks: sp});
		spotId++;

		// !! invalid due to restore() above.
		// draw ids of each spot
		// ctx.font = "12px Helvetica";
		// ctx.fillStyle = "white";
		// sp.forEach(({x, y}) => {
		//   ctx.fillText(spotId, ((x + 0.4) / blocks) * sw, ((y - 1) / blocks) * sw + 40);
		// });

		return true;
	};

	let complete = false;

	const getPosFromRadial = (ratioComplete) => {
		const p = ratioComplete * 50;
		const diagonal = Math.ceil(Math.hypot(blocks / 2, blocks / 2)); // + 2);
		const r = p * blocks * 0.04;

		if (r > diagonal) {
			complete = true;
		}

		const a = (p / (1 + r * -0)) * 20;
		const x = Math.floor(blocks / 2 + Math.sin(a) * r);
		const y = Math.floor(blocks / 2 + Math.cos(a) * r);

		// const r = p * 0.5;
		// const a = (z / 180) * Math.PI * 137.5;

		return {x, y};
	};

	const jitter = (rot, pos) => {
		let go = true;
		for (var x = -1; x < 2 && go; x++) {
			for (var y = -1; y < 2 && go; y++) {
				for (var r = 0; r < 4 && go; r++) {
					go = !drawShape((rot + r) % 4, {x: pos.x + x, y: pos.y + y});
				}
			}
		}
	};

	const drawSet = () => {
		// console.log("drawSet");
		attempt++;
		const ratioComplete = attempt / maxAttempts;
		const occComplete = occupied.filter((b) => b > 0).length / occupied.length === 1;

		if (complete || occComplete) {
			console.log("complete");
			return;
		}
		if (ratioComplete >= 1) {
			// does it happen? hmmm, stop recursion
			return;
		}

		const pos = getPosFromRadial(ratioComplete);
		const rot = r.getInteger(0, 3);
		jitter(rot, pos);

		// const {x, y} = pos;
		// ctx.fillStyle = "red";
		// ctx.fillRect((x / blocks) * sw, (y / blocks) * sw, 4, 4);
		// progress("render:complete", bmp.canvas);

		if (attempt % 100 === 0) {
			// progress("render:progress", ratioComplete);
			setTimeout(() => drawSet(), 10);
			// console.log(occupied);
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
		bmp.setSize(sw, sh);

		c.getRandomPalette();

		const ranges = [];
		for (var i = 8; i < size / 8; i++) {
			const d = size / i;
			if (Math.round(d) === d) {
				ranges.push(d);
			}
		}
		// console.log(ranges);

		blocks = ranges[r.getInteger(0, ranges.length - 1)];
		block = 1 / blocks;

		// console.log(blocks, block);

		occupied = new Array(blocks * blocks).fill(0);

		progress("settings:initialised", settings);

		ctx.fillStyle = backgroundColour;
		ctx.fillRect(0, 0, sw, sh);
		ctx.translate(sw / 2, sh / 2); // compensated for in drawImage
		ctx.rotate(r.getNumber(0, Math.PI * 2));
		const scale = r.getNumber(1.3, 1.6);
		ctx.scale(scale, scale);

		drawSet();
	};

	const update = (settings, seed) => {
		console.log("update", settings);
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
