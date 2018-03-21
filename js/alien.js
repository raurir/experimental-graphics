var isNode = typeof module !== "undefined";

var alien = function() {
	var stage = dom.canvas(1, 1);
	var ctx = stage.ctx;
	var centre;

	function init(options) {
		size = options.size;
		sw = options.sw || size;
		sh = options.sh || size;
		stage.setSize(sw, sh);
		centre = sh / 2;
		colours.getRandomPalette();
		spokes = rand.getInteger(2, 40) * 2;

		render();
	}

	function render() {
		const img = alien();
		ctx.drawImage(img, centre - img.width / 2, centre - img.height / 2);
	}

	function alien() {
		const grid = [];

		const cellSize = 30;
		const numberOfRows = 10;
		const numberOfColumns = 10;

		const halfColumns = numberOfColumns / 2;

		const canvasWidth = cellSize * (numberOfColumns + 2);
		const canvasHeight = cellSize * (numberOfRows + 2);

		const bmp = dom.canvas(canvasWidth, canvasHeight);

		function seed() {
			for (var row = 0; row < numberOfRows; row++) {
				grid[row] = [];
				for (let column = 0; column < halfColumns; column++) {
					grid[row][column] = createSeedCell(column);
				}
			}
		}

		function createSeedCell(probability) {
			const chance = Math.random();
			const cutoff = (probability + 1) / (halfColumns + 1);
			return chance < cutoff;
		}

		function drawGrid() {
			let column, row;
			const colourLine = colours.getNextColour();
			const colourFill = colours.getNextColour();
			for (row = 0; row < numberOfRows; row++) {
				for (column = 0; column < numberOfColumns; column++) {
					// drawCell(row, column, colourLine, 10);
				}
			}
			for (row = 0; row < numberOfRows; row++) {
				for (column = 0; column < numberOfColumns; column++) {
					drawCell(row, column, colourFill || colours.getNextColour(), 0);
				}
			}
		}

		function drawCell(y, x, fillStyle, strokeWidth) {
			let colReflected;
			if (x >= halfColumns) {
				colReflected = numberOfColumns - x - 1;
			} else {
				colReflected = x;
			}

			const isOn = grid[y][colReflected];

			if (isOn) {
				bmp.ctx.fillStyle = fillStyle;
				bmp.ctx.fillRect(
					(1 + x) * cellSize - strokeWidth,
					(1 + y) * cellSize - strokeWidth,
					cellSize + strokeWidth * 2,
					cellSize + strokeWidth * 2
				);
			}
		}

		seed();
		drawGrid();
		return bmp.canvas;
	}

	var experiment = {
		init: init,
		render: render,
		stage: stage.canvas
	};

	progress("render:complete", stage.canvas);

	return experiment;
};

if (isNode) {
	module.exports = alien();
} else {
	define("alien", alien);
}
