define("frame_inverse", function() {
	var sw = window.innerWidth;
	var sh = window.innerHeight;
	var maxSize = rand.getInteger(100, 300);
	var minSize = rand.getInteger(4, 10);
	var maxBoxes = Math.floor(sw * sh / 200);
	var cols = colours.getRandomPalette();
	var canvas = dom.canvas(sw, sh);
	var ctx = canvas.ctx;
	var pixels = [];
	var boxes = 0;
	var renders = 0;

	var f = rand.getNumber(0, 1);
	var force = null;
	var VERTICAL = 1,
		HORIZONTAL = 2,
		SQUARE = 3;
	if (f > 0.9) {
		force = VERTICAL;
	} else if (f > 0.8) {
		force = HORIZONTAL;
	} else if (f > 0.7) {
		force = SQUARE;
	}

	var i = 0;
	while (i < sw) {
		pixels[i] = [];
		var j = 0;
		while (j < sh) {
			pixels[i][j] = 0;
			j++;
		}
		i++;
	}

	function getPixel(x, y) {
		return pixels[x][y];
	}
	function draw(x, y, w, h, colour) {
		ctx.fillStyle = colour;
		ctx.fillRect(x, y, w, h);
		var iw = x + w;
		var jh = y + h;
		var i = x;
		while (i < iw) {
			var j = y;
			while (j < jh) {
				pixels[i][j] = colour;
				j++;
			}
			i++;
		}
		boxes++;
	}

	function go() {
		if (boxes < maxBoxes) {
			if (renders % 20) {
				requestAnimationFrame(go);
				for (var t = 0; t < 2000; t++) {
					hitit();
				}
			} else {
				progress("render:progress", boxes / maxBoxes);
				setTimeout(go, 200); // have a breather
			}
		} else {
			progress("render:complete", canvas.canvas);
		}
		renders++;
	}

	function hitit() {
		var i = rand.getInteger(0, sw - 1);
		var j = rand.getInteger(0, sh - 1);

		var targColor = getPixel(i, j);

		var dimLarge = rand.getNumber(minSize, maxSize);
		var dimSmall = rand.getNumber(1, minSize);
		var sizeX = dimLarge;
		var sizeY = dimSmall;
		switch (force) {
			case HORIZONTAL:
				// leave as is...
				break;
			case VERTICAL:
				sizeX = dimSmall;
				sizeY = dimLarge;
				break;
			case SQUARE:
				sizeX = dimLarge;
				sizeY = dimLarge;
				break;
			default:
				if (rand.getNumber(0, 1) > 0.5) {
					// flip them
					sizeX = dimSmall;
					sizeY = dimLarge;
				}
		}

		if (i + sizeX > sw || j + sizeY > sh) {
			return;
		}

		var k = i;
		while (k < i + sizeX) {
			var l = j;
			while (l < j + sizeY) {
				if (getPixel(k, l) != targColor) {
					return false;
				}
				l++;
			}
			k++;
		}

		sizeX -= 2;
		sizeY -= 2;
		if (sizeX >= 1 && sizeY >= 1) {
			var xp = i + 1;
			var yp = j + 1;
			// var rot = Math.random() * 0.05 - 0.025; // Math.PI * 0.25 +\
			col = cols[parseInt(Math.random() * 5)];
			// alpha = 0.7;
			// var blend = BlendMode.ADD;
			draw(xp, yp, sizeX, sizeY, col);
		}
	}

	function init() {
		var bg = colours.getRandomColour();
		cols.splice(cols.indexOf(bg), 1);
		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, sw, sh);
		go();
	}
	return {
		init: init,
		stage: canvas.canvas
	};
});
