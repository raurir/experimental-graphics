/* eslint-disable no-console */
const isNode = typeof module !== "undefined";

const fillStripes = (args) => {
	const {c, r, size, settings} = args;
	const checkArgs = Object.keys(args)
		.sort()
		.join(",");
	if (checkArgs !== "c,r,settings,size") {
		console.warn("fillStripes `args` are not ok... received:", checkArgs);
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
		console.warn("fillStripes argument `settings` is not ok... received:", checkSettings);
	}

	const {
		baseRotation, // comment prevents prettier onelining these.
		lineGap,
		lineScale,
		lineSize,
		overallScale,
		varyDuotone,
		varyPerLine,
		varyPerRegion,
		varyRotation,
	} = settings;

	// console.log('dom.canvas, size', size);
	const half = size / 2;
	const stage = dom.canvas(size, size);
	// canvas.canvas.style.border = '2px solid black'
	const {ctx, canvas} = stage;
	// document.body.appendChild(canvas);
	// puts the canvas centre so the whole area has a pattern
	// ctx.save();
	ctx.translate(half, half);
	ctx.rotate(baseRotation + r.getNumber(0, varyRotation));
	ctx.translate(-half, -half);

	if (varyDuotone) {
		c.setColourIndex(1);
		ctx.fillStyle = c.getCurrentColour();
	} else {
		ctx.fillStyle = c.getRandomColour();
	}

	const padding = Math.sqrt(half * half * 2) - half; // the gaps between the corner when rotated 45 degrees

	// draw bg. not good for shirts!!!
	ctx.fillRect(-padding, -padding, size + padding * 2, size + padding * 2);

	let lsc = lineScale;
	let lsi = lineSize;
	let lg = lineGap;
	if (varyPerRegion) {
		lsc = 0.5 + r.getNumber(0, overallScale);
		lsi = 1 + r.getNumber(0, 10) * lsc;
		lg = 2 + r.getNumber(0, 3) * lsc;
	}

	var colour;
	if (varyDuotone) {
		colour = c.getNextColour();
	}
	var y = -padding;
	while (y < size + padding) {
		if (varyPerLine) {
			lsi = 1 + r.getNumber(0, 10) * lsc;
			lg = 2 + r.getNumber(0, 3) * lsc;
		}
		if (!varyDuotone) {
			colour = c.getRandomColour();
		}
		ctx.fillStyle = colour;
		ctx.fillRect(-padding, y, size + padding * 2, lsi);
		y += lsi + lg;
	}
	return canvas;
};

if (isNode) module.exports = fillStripes;
