const linked_line = function() {

	const wid = 16, hei = 16, block = 10;
	const sw = (wid + 0.5) * block;
	const sh = (hei + 0.5) * block;
	const bmp = dom.canvas(sw, sh);
	const ctx = bmp.ctx;

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
		return {x: index % wid, y: Math.floor(index / wid)};
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
				y = hei / 2;//rand.getInteger(0, wid - 1);
			} else {
				x = wid / 2;
				y = i;
			}
			if (i == 0) { // first
				newItem = makeItem({x, y});
				first = newItem;
			} else{
				var n = makeItem({x, y, prev: lastItem});
				lastItem.next = n;
				newItem = n;
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

		if (points[0].x === points[1].x && points[1].x === points[2].x ) return false ;//&& points[2].x === points[3].x) return false;
		if (points[0].y === points[1].y && points[1].y === points[2].y ) return false ;//&& points[2].y === points[3].y) return false;

		return true;
	}


	const insertItemAnywhere = () => {
		var index = rand.getInteger(0, occupied.array.length - 1);
		var item = occupied.array[index];
		if (!item) return;
		debug.innerHTML = `item ${index} ${item} ${occupied.array.length}`;

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

	const render = (time) => {
		requestAnimationFrame(render);
		// setTimeout(render, 1000);


		ctx.fillStyle = "#ddd";
		ctx.fillRect(0, 0, sw, sh);

		for (var i = 0; i < 40; i++) insertItemAnywhere();

		// ctx.fillStyle = "#bbb";
		// for (var i = 0; i < wid * hei; i++) {
		// 	var xy = getXY(i);
		// 	ctx.fillRect(xy.x * block + 1, xy.y * block + 1, block - 2, block - 2);
		// }

		ctx.beginPath();
		ctx.lineWidth = block / 2;
		var item = first;
		while(item) {
			var x = item.x * block + block * 3 / 4,
				y = item.y * block + block * 3 / 4;

			// ctx.fillStyle = item.surrounded ? "#f77" : "#7f7";
			// ctx.fillRect(x - 2, y - 2, 4, 4);

			if (item == first) {
				ctx.moveTo(x, y);
			} else {
				ctx.lineTo(x, y);
			}
			// console.log(item);
			item = item.next;
		}
		ctx.stroke();
	}

	return {
		stage: bmp.canvas,
		init: init
	}

};

define("linked_line", linked_line);