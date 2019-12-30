/* eslint-disable no-console */
const isNode = typeof module !== "undefined";

const fillDither = (args) => {
	const {c, r, size, settings} = args;
	const checkArgs = Object.keys(args)
		.sort()
		.join(",");
	if (checkArgs !== "c,r,settings,size") {
		console.warn("fillDither `args` are not ok... received:", checkArgs);
	}

	const checkSettings = Object.keys(settings)
		.sort()
		.join("\n");
	if (
		checkSettings !==
		`baseRotation
lineGap
lineScale
lineSize
overallScale
pointBias
pointMethod
sites
varyDuotone
varyPerLine
varyPerRegion
varyRotation`
	) {
		console.warn("fillDither argument `settings` is not ok... received:", checkSettings);
	}

	const {
		baseRotation, // comment prevents prettier onelining these.
		// lineGap,
		// lineScale,
		// lineSize,
		// overallScale,
		// varyDuotone,
		// varyPerLine,
		// varyPerRegion,
		varyRotation,
	} = settings;

	const half = size / 2;
	const padding = Math.sqrt(half * half * 2) - half; // the gaps between the corner when rotated 45 degrees
	const min = -padding;
	const max = size + padding * 2;

	const stage = dom.canvas(size, size);
	const {ctx, canvas} = stage;
	document.body.appendChild(canvas);

	ctx.translate(half, half);
	ctx.rotate(baseRotation + r.getNumber(0, varyRotation));
	ctx.translate(-half, -half);

	// ctx.fillStyle = "#f00";
	// ctx.fillRect(half - 25, half - 25, 50, 50);

	// draw background
	const bg = c.getRandomColour();
	ctx.fillStyle = bg;
	ctx.fillRect(min, min, max, max);

	// draw dither
	const jump = 10;
	const yJump = jump;
	const xJump = jump;

	const shapes = [
		1, // circle
		2, // square
		3, // diamond
		4, // dither alg 1
		5, // dither alg 2
	];
	const shape = 3; // shapes[r.getInteger(0, shapes.length - 1)];
	const diamondScale = r.getNumber(0.5, 1);

	const alternate = r.getNumber(0, 1) > 0.5;

	const colour = c.getRandomColour(true);
	ctx.fillStyle = colour;

	let y = min;
	let row = 0;
	while (y < max) {
		const ditherRatio = y / size;
		const ditherAmount = ditherRatio * jump;
		if (ditherRatio <= 0) {
			// not visible, don't render anything
			row++;
			y += yJump;
			continue;
		}
		if (ditherRatio >= 1.1) {
			// no discernible detail, flood fill!
			ctx.fillRect(min, y, max - min, max - y);
			break;
		}

		let x = min - (alternate && row % 2 === 0 ? xJump / 2 : 0);
		while (x < max) {
			const wiggleX = r.getNumber(-xJump, xJump) / 2;
			const wiggleY = r.getNumber(-yJump, yJump) / 2;

			if (shape === 1) {
				// circle
				ctx.beginPath();
				ctx.drawCircle(x + wiggleX, y + wiggleY, ditherAmount);
				ctx.closePath();
				ctx.fill();
			} else if (shape === 2) {
				// square
				ctx.fillRect(x + wiggleX, y + wiggleY, ditherAmount, ditherAmount);
			} else if (shape === 3) {
				// diamond
				ctx.save();
				ctx.translate(x + wiggleX, y + wiggleY);
				ctx.scale(diamondScale, 1);
				ctx.rotate(Math.PI / 4);
				ctx.fillRect(0, 0, ditherAmount, ditherAmount);
				ctx.restore();
			} else if (shape === 4) {
				// dither - alg 1, randomly distribute
				for (var i = 0; i < ditherAmount * 5; i++) {
					const xd = x + Math.random() * xJump;
					const yd = y + Math.random() * yJump;
					ctx.fillRect(xd, yd, 2, 2);
				}
			} else if (shape === 5) {
				// dither - alg 1, randomly fill all cells.
				const blocksize = 2;
				const blocks = jump / blocksize;
				for (var j = 0; j < Math.pow(blocks, 2); j++) {
					if (Math.random() > ditherRatio) continue;
					const overlap = 0.3; // slight bleed
					const xd = x + (j % blocks) * blocksize;
					const yd = y + Math.floor(j / blocks) * blocksize;
					ctx.fillRect(xd - overlap, yd - overlap, blocksize + overlap * 2, blocksize + overlap * 2);
				}
			} else if (shape === 6) {
				// dither - alg 1, randomly fill all cells.
				const blocksize = 2;
				const blocks = jump / blocksize;
				for (var j = 0; j < Math.pow(blocks, 2); j++) {
					if (Math.random() > ditherRatio) continue;
					const overlap = 0.3; // slightl bleed
					const xd = x + (j % blocks) * blocksize;
					const yd = y + Math.floor(j / blocks) * blocksize;
					ctx.fillRect(xd - overlap, yd - overlap, blocksize + overlap * 2, blocksize + overlap * 2);
				}
			} else {
				throw new Error("no shape!");
			}
			x += xJump;
		}
		row++;
		y += yJump;
	}

	return canvas;
};

if (isNode) module.exports = fillDither;
