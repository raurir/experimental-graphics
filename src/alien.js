var isNode = typeof module !== "undefined";

if (isNode) {
	var con = console;
	var rand = require('./rand.js');
	var dom = require('./dom.js');
	var colours = require('./colours.js');
}

var alien = function() {
	var stage = dom.canvas(1, 1);
	var ctx = stage.ctx;
	var centre;

	const numberOfRows = 10;
	const numberOfColumns = 10;
	const cellSize = Math.ceil(rand.getInteger(20, 60) / numberOfColumns);
	const halfColumns = numberOfColumns / 2;
	const canvasWidth = cellSize * (numberOfColumns + 2);
	const canvasHeight = cellSize * (numberOfRows + 2);

	function init(options) {
		size = options.size;
		sw = options.sw || size;
		sh = options.sh || size;
		stage.setSize(sw, sh);
		centre = sh / 2;
		colours.getRandomPalette();
		render();
	}

	function render() {
		const aliens = manyAliens();
		con.log(aliens)
		aliens.x.forEach((x, xi) => {
			aliens.y.forEach((y) => {
				const img = oneAlien();
				ctx.drawImage(img, centre + x * canvasWidth, centre + y * canvasHeight);
			});
			progress("render:progress", xi / aliens.x.length);
		});
		progress("render:complete", stage.canvas);
	}

	function oneAlien() {
		const grid = [];

		let lineSize = rand.getInteger(0, 3); // either draw no line
		if (lineSize) lineSize = cellSize / lineSize; // or fraction of cell size

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
					drawCell(row, column, colourLine, lineSize);
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

	function manyAliens() {
		function r( m ) { return ~~(Math.random() * m + 1)};
		function q() {
			var l = r(11), g = r(5), a = [], i = 0;
			while ( i < l ) {
				j = i * g;
				a.push( j );
				if ( i ) a.unshift(-j)
				i++;
			}
			return a;
		}
	  return { x: q(), y: q() };
	}

	var experiment = {
		init: init,
		render: render,
		stage: stage.canvas
	};

	return experiment;
};

if (isNode) {
	module.exports = alien();
} else {
	define("alien", alien);
}
