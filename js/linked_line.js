const linked_line = function() {

	const size = 7; // has to be odd, want the maze to start and end in the middle of a bouding wall.
	const wid = size;
	const hei = size;
	const block = 2; // this has to be 2, since we're drawing a maze with lines between points rather than filling/carving.
	const blockZoom = 16;
	const sw = (wid + 0.5) * block;
	const sh = (hei + 0.5) * block;
	const swZ = (wid + 0.5) * block * blockZoom;
	const shZ = (hei + 0.5) * block * blockZoom;
	const bmp = dom.canvas(sw, sh);
	const bmpZ = dom.canvas(swZ, shZ);
	const bmpW = dom.canvas(swZ, shZ);
	const bmpR = dom.canvas(swZ, shZ);
	const ctx = bmp.ctx;
	const ctxZ = bmpZ.ctx;
	const ctxW = bmpW.ctx;
	const ctxR = bmpR.ctx;

	document.body.appendChild(bmpZ.canvas);
	document.body.appendChild(bmpW.canvas);
	document.body.appendChild(bmpR.canvas);

	const debug = dom.element("div");
	document.body.appendChild(debug);

	var occupied = {
		array: [],
		// twoD: [],
		oneD: [],
		neighbourless: []

	};
	var backup = {};
	const store = () => {
		backup.array = occupied.array.slice();
		backup.oneD = occupied.oneD.slice();
		backup.neighbourless = occupied.neighbourless.slice();
		// backup.twoD = occupied.twoD.slice();
	}
	const restore = () => {
		occupied.array = backup.array.slice();
		occupied.oneD = backup.oneD.slice();
		occupied.neighbourless = backup.neighbourless.slice();
		// occupied.twoD = backup.twoD.slice();
	}

	const makeItem = (options) => {
		const x = (options.x == undefined) ? rand.random() : options.x;
		const y = (options.y == undefined) ? rand.random() : options.y;
		let item = {
			x,
			y,
			surrounded: false,
			prev: options.prev,
			next: options.next
		}

		// occupied.twoD[y][x] = item;
		occupied.oneD[y * wid + x] = item;
		occupied.array.push(item);
		occupied.neighbourless.push(item);

		return item;
	}

	var first, last;

	const getIndex = (x, y) => y * wid + x;
	const getXY = (index) => {
		return {x: index % sw, y: Math.floor(index / sw)};
	}

	const init = () => {
		for (var y = 0; y < hei; y++) {
			for (var x = 0; x < wid; x++) {
				occupied.oneD.push(-1);
				ctx.fillRect(x * block - 2 + block / 2, y * block - 2 + block / 2, 4, 4);
			}
		}

		var newItem, lastItem;
		for (var i = 0; i < hei; i++) {
			if (i < hei / 2) {
				x = i;
				y = hei / 2 - 0.5;//rand.getInteger(0, wid - 1);
			} else {
				x = wid / 2 - 0.5;
				y = i;
			}
			if (i == 0) { // first
				newItem = makeItem({x, y});
				first = newItem;
			} else{
				newItem = makeItem({x, y, prev: lastItem});
				lastItem.next = newItem;
			}
			lastItem = newItem;
		}
		last = newItem;
		// con.log(occupied.oneD);
		// con.log(occupied.twoD);
		render(0);
	}

	const checkSurrounded = (item) => {
		for (var i = -1; i < 2; i++) {
			for (var j = -1; j < 2; j++) {
				//if (i == 0 && j == 0) continue; // same as item.
				var x = item.x + i, y = item.y + j;
				if (x >= 0 && x < wid && y >= 0 && y < hei) {
					var index = getIndex(x, y);
					// con.log(occupied.oneD[index])
					if (occupied.oneD[index] === -1) return false;
				}
			}
		}
		// con.log("surrounded")x`x``
		item.surrounded = true;
		return true;
	}


	const checkDir = (x, y, dir) => {
		switch(dir) {
			case 0 /* up */ : y--; break;
			case 1 /* right */ : x++; break;
			case 2 /* down */ : y++; break;
			case 3 /* left */ : x--; break;
		}
		var index = getIndex(x, y);

		// ctx.fillStyle = "red";
		// ctx.fillRect(x * block - 1 + block / 1, y * block - 1 + block / 1, 2, 2);

		return {
			// ok: !!(occupied.twoD[y] && occupied.twoD[y][x] === -1),
			ok: x >= 0 && x < wid && y >= 0 && y < hei && occupied.oneD[index] === -1,
			x,
			y
		};
	}

	const checkPoints = (...points) => {
		for (var i = 0, il = points.length - 1; i < il; i++) {
			var p0 = points[i], p1 = points[i + 1];
			if (Math.abs(p0.x - p1.x) !== 0 && Math.abs(p0.y - p1.y) !== 0) {
				return false;
			}
		}
		// TODO this condition!
		if (points[0].x === points[1].x && points[1].x === points[2].x ) return false ;//&& points[2].x === points[3].x) return false;
		if (points[0].y === points[1].y && points[1].y === points[2].y ) return false ;//&& points[2].y === points[3].y) return false;

		return true;
	}


	const insertItemAnywhere = () => {
		var index = rand.getInteger(0, occupied.array.length - 1);
		var item = occupied.array[index];
		if (!item) return;
		debug.innerHTML = `item ${occupied.array.length}`;

		var surrounded = checkSurrounded(item);
		if (surrounded) {
			occupied.array.splice(index, 1);
			return;
		}

		if (item && item.next && item.prev) {
			insertItemAfter(item);
		} else {
			// console.log("null", item);
		}
	}


	const insertItemAfter = afterItem => {

		store();

		var prev = afterItem;
		var next = afterItem.next;

		// con.log(afterItem)
		var x = afterItem.x;
		var y = afterItem.y;
		var startDir = rand.getInteger(0, 3);
		var nextDir = rand.getInteger(0, 3);

		var pending0 = checkDir(x, y, startDir);
		var pending1 = checkDir(pending0.x, pending0.y, nextDir);
		var inline = checkPoints(prev, pending0, pending1, next);

		if (pending0.ok && pending1.ok && inline) {

			// con.log("pending0", pending0, pending1)
			var newItem0 = makeItem({x: pending0.x, y: pending0.y});

			var newItem1 = makeItem({x: pending1.x, y: pending1.y});

			prev.next = newItem0;

			newItem0.prev = prev;
			newItem0.next = newItem1;

			newItem1.prev = newItem0;
			newItem1.next = next;

			next.prev = newItem1;

			// checkSurrounded(prev);
			// checkSurrounded(newItem0);
			// checkSurrounded(newItem1);
			// checkSurrounded(next);

		} else {
			restore();
		}

	}

	const extractWalls = () => {
		// discover a more efficient method of drawing walls rather than block by block
		// let's use rectangles.

		var pixels = ctx.getImageData(0, 0, sw, sh).data;

		ctxW.fillStyle = "#fff";
		ctxW.fillRect(0, 0, sw, sh);

		var walls = [];
		// get pixels to discover what is to be drawn, make an array of blocks.
		for (var i = 0, j = 0, il = pixels.length; i < il; i += 4, j++) {
			var xy = getXY(j);
			var r = pixels[i]; // var g = pixels[i + 1], b = pixels[i + 2], a = pixels[i + 3];
			if (r == 255) {
				ctxW.fillStyle = "#f00";
				ctxW.fillRect(xy.x, xy.y, 1, 1);
				walls.push(xy);
			}
		}

		// find rows within array.
		var wallrects = [];
		var row = -1;
		var w;
		for (i = 0, il = walls.length; i < il; i++) {
			w = walls[i];
			if (row != w.y) { // new row - add a block
				row = w.y;
				wallrects.push({x: w.x, y: w.y, w:1, h: 1});
			} else { // check if the previous x is the same...
				if (walls[i - 1].x == w.x - 1) { // if it's the same block widen it.
					wallrects[wallrects.length - 1].w ++;
				} else {
					wallrects.push({x: w.x, y: w.y, w: 1, h: 1}); // add a new one.
				}
			}
		}

		// find columns within array
		for (i = 0, il = wallrects.length; i < il; i++) {
			var w0 = wallrects[i];
			for (var j = i + 1; j < il; j++) {
				var w1 = wallrects[j];
				if (w0 && w1) {
					if (w0.x == w1.x && w0.w == w1.w && w0.y + w0.h == w1.y) {
						wallrects[i].h++;
						wallrects[j] = null;
					}
				}
			}
		}
		// remove nulls. didn't splice above
		wallrects = wallrects.filter((item) => item);

		// debug render
		ctxR.fillStyle = "#fff";
		ctxR.fillRect(0, 0, swZ, shZ);

		for (i = 0, il = wallrects.length; i < il; i++) {
			w = wallrects[i];
			if (w) {
				ctxR.beginPath();
				ctxR.rect((w.x * blockZoom) + 2, (w.y * blockZoom) + 2, (w.w * blockZoom) - 4, (w.h * blockZoom) - 4);
				ctxR.lineWidth = 1;
				ctxR.lineStyle = "rgba(0,0,0,0.02)";
				ctxR.closePath();
				ctxR.stroke();
			}
		}

		window.walls = walls;
		window.wallrects = wallrects;
		// JSON.stringify(walls)

	}


	ctxZ.scale(blockZoom, blockZoom);
	ctxZ.imageSmoothingEnabled = false;
	ctxW.scale(blockZoom, blockZoom);
	ctxW.imageSmoothingEnabled = false;

	var arrLen = 0, done = 0;

	const render = (time) => {

		ctx.fillStyle = "#fff";
		ctx.fillRect(0, 0, sw, sh);

		for (var i = 0; i < 40; i++) insertItemAnywhere();

		ctx.beginPath();
		ctx.lineWidth = block / 2;
		var item = first;
		while(item) {
			var x = (item.x + 3 / 4) * block;
			var y = (item.y + 3 / 4) * block;

			if (item == first) {
				ctx.moveTo(x - block, y); // hack to draw off screen.
			} else if (!item.next) { // hack last one
				ctx.lineTo(x, y);
				ctx.lineTo(x, y + block);
			} else {
				ctx.lineTo(x, y);
			}

			// ctx.fillStyle = item.surrounded ? "#f77" : "#7f7";
			// ctx.fillRect(x - 1, y - 1, 2, 2);

			// console.log(item);
			item = item.next;
		}
		ctx.stroke();

		ctxZ.drawImage(bmp.canvas, 0, 0);

		// some dodgy logic to know if we're done yet.
		if (arrLen === occupied.array.length) { done++; } else { arrLen = occupied.array.length; done = 0; }

		if (done < 100) {
			requestAnimationFrame(render);
			// setTimeout(render, 1000);
		} else {
			extractWalls();
		}



	}

	return {
		stage: bmp.canvas,
		init: init
	}

};

define("linked_line", linked_line);