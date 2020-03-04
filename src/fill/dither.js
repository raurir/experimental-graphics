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
	if (checkSettings !== "baseRotation\nvaryRotation") {
		console.warn("fillDither argument `settings` is not ok... received:", checkSettings);
	}

	const {baseRotation, varyRotation} = settings;

	const half = size / 2;
	const padding = Math.sqrt(half * half * 2) - half; // the gaps between the corner when rotated 45 degrees
	const min = -padding;
	const max = size + padding * 2;

	const stage = dom.canvas(size, size);
	const {ctx, canvas} = stage;
	// document.body.appendChild(canvas);

	ctx.translate(half, half);
	ctx.rotate(baseRotation + r.getNumber(0, varyRotation));
	ctx.translate(-half, -half);

	// ctx.fillStyle = "#f00";
	// ctx.fillRect(half - 25, half - 25, 50, 50);

	// draw background
	const bg = "white"; //c.getRandomColour();
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
		6, // cross hatches
	];
	// const shape = shapes[r.getInteger(0, shapes.length - 1)];
	const shape = 1;
	const diamondScale = r.getNumber(0.5, 1);

	const alternate = r.getNumber(0, 1) > 0.5;

	const fg = "#F4502B"; //c.getRandomColour(true);
	ctx.fillStyle = fg;
	ctx.strokeStyle = fg;

	let i;
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
				ctx.drawCircle(x + wiggleX, y + wiggleY, Math.pow(ditherAmount, 2) / 10);
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
				for (i = 0; i < ditherAmount * 5; i++) {
					const xd = x + Math.random() * xJump;
					const yd = y + Math.random() * yJump;
					ctx.fillRect(xd, yd, 2, 2);
				}
			} else if (shape === 5) {
				// dither - alg 2, randomly fill all cells.
				const blocksize = 2;
				const blocks = jump / blocksize;
				for (i = 0; i < Math.pow(blocks, 2); i++) {
					if (Math.random() > ditherRatio) continue;
					const overlap = 0.3; // slight bleed
					const xd = x + (i % blocks) * blocksize;
					const yd = y + Math.floor(i / blocks) * blocksize;
					ctx.fillRect(xd - overlap, yd - overlap, blocksize + overlap * 2, blocksize + overlap * 2);
				}
			} else if (shape === 6) {
				// dither - crosshatches
				for (i = 0; i < ditherAmount; i++) {
					const angle = r.getNumber(0, Math.PI * 2);
					const distance = ditherRatio * jump * 3;
					const d1 = r.getNumber(1, 1) * Math.sin(angle) * distance;
					const d2 = r.getNumber(1, 1) * Math.cos(angle) * distance;

					const xs = x + xJump / 2 - d1;
					const ys = y + yJump / 2 - d2;
					const xe = x + xJump / 2 + d1;
					const ye = y + xJump / 2 + d2;

					const isForeground = r.random() < ditherRatio;

					ctx.strokeStyle = isForeground ? fg : bg;
					ctx.lineWidth = isForeground ? 4 : 2;
					ctx.beginPath();
					ctx.moveTo(xs, ys);
					ctx.lineTo(xe, ye);
					ctx.stroke();
				}
			} else if (shape === 80) {
				// failed but nice
				// dither - crosshatches
				/*for (i = 0; i < 2; i++) {
					const xs = x + xJump / 2;
					const ys = y + yJump / 2; // + r.getNumber(0, yJump);
					const angle = rand.getNumber(0, Math.PI * 2);
					const xe = xs; // + r.getNumber(0, Math.sin(angle) * ditherRatio * jump * 3);
					const ye = ys + r.getNumber(0, Math.cos(angle) * ditherRatio * jump * 3);
					ctx.lineWidth = 2;
					ctx.beginPath();
					ctx.moveTo(xs, ys);
					ctx.lineTo(xe, ye);
					ctx.stroke();
				}*/
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
