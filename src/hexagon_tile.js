var con = console;
var isNode = typeof module !== "undefined";

if (isNode) {
	// Canvas = require('canvas');
	var rand = require("./rand.js");
	var dom = require("./dom.js");
	var colours = require("./colours.js");
}

var hexagon_tile = () => () => {
	var r = rand.instance();
	var c = colours.instance(r, "v1");

	var progress;
	var spreadSeed;
	// need an alternate seeded random, based on input number.
	// more notes on this in a further blog post: backwards compatibility!
	function getJitter() {
		spreadSeed += 1.89127398;
		return ((Math.sin(spreadSeed) + Math.cos(spreadSeed * 2.12387891)) / 2) * 0.1;
	}

	var size = 100,
		vector = false,
		sw = size,
		sh = size,
		angle60 = (2 * Math.PI) / 6,
		radiusOuter,
		strokeSize,
		radiusInner,
		smoothSize,
		randomHexes,
		stage,
		inner,
		hexagons,
		hexs,
		batchSize = 1000,
		batches,
		currentBatch = 0;

	var settings = {
		spread: {
			type: "Number",
			label: "Spread",
			min: 1,
			max: 10,
			cur: 10,
		},
		background: {
			type: "Boolean",
			label: "Background",
			cur: true,
		},
	};

	if (vector) {
		stage = dom.svg("svg", {width: sw, height: sh});
		inner = dom.svg("g");
		stage.appendChild(inner);
	} else {
		stage = dom.canvas(sw, sh);
	}

	function init(options) {
		progress =
			options.progress ||
			(() => {
				con.log("hexagon_tile - no progress defined");
			});
		r.setSeed(options.seed);
		spreadSeed = r.getSeed();
		// spreadGradient = r.getLastRandom() * 0.5;
		// test alternate random
		// var max = 0, min = 1e10;
		// for (var i = 0; i < 1e4; i++) {
		//   var out = getJitter();
		//   max = Math.max(max, out);
		//   min = Math.min(min, out);
		// };
		// con.log(min, max);

		size = options.size;
		sw = options.sw || size;
		sh = options.sh || size;
		stage.setSize(sw, sh);

		settings.spread.cur = 10;
		settings.background.cur = true;

		if (options.settings) {
			settings = options.settings;
		}

		progress("settings:initialised", settings);

		c.getRandomPalette();
		var backgroundColor = c.getRandomColour();

		// progress("render:start");

		radiusOuter = (5 + r.random() * 25) / 1000;
		strokeSize = r.random() * r.random() * r.random() * radiusOuter;
		radiusInner = radiusOuter - strokeSize + strokeSize * 0.01;
		smoothSize = 0.01 + r.random() * 10;

		if (vector) {
			while (inner.firstChild) inner.removeChild(inner.firstChild);
			stage.setAttribute("style", "background-color:" + backgroundColor);
		} else {
			if (settings.background.cur) {
				stage.ctx.fillStyle = backgroundColor;
				stage.ctx.fillRect(0, 0, size, size);
			}
		}

		// var neighbourGroups = dom.svg("g");
		// stage.appendChild(neighbourGroups);
		// c.setPalette(["#000044", "#000088", "#000033", "#000011", "#5CB9FC", "#ffffff"]);
		// c.setPalette(["#ff2244", "#ff3322"]);
		// c.setPalette(["#f3512f", "#faa584", "#575757", "#ffffff"]);

		var path = [],
			points = [];
		for (var i = 0; i < 6; i++) {
			var angle = i * angle60,
				x = radiusInner * Math.cos(angle),
				y = radiusInner * Math.sin(angle);
			path[i] = (i === 0 ? "M" : "L") + x + "," + y;
			points[i] = {x: x, y: y};
		}
		path.push("Z");

		var minHeight = radiusOuter * Math.sin(angle60); // this is edge to edge, not corner to corner.

		var cols = Math.ceil(1 / radiusOuter / 3) + 1;
		var rows = Math.ceil(1 / minHeight) + 1;
		// cols -= 3;
		// rows -= 6;
		hexagons = cols * rows;

		hexs = [];

		for (i = 0; i < hexagons; i++) {
			var row = Math.floor(i / cols);
			var second = row % 2 == 0;
			var col = (i % cols) + (second ? 0.5 : 0);
			x = col * radiusOuter * 3;
			y = row * minHeight;

			// x += 100;
			// y += 100;

			var hex;
			if (vector) {
				var group = dom.svg("g");
				group.setAttribute("transform", "translate(" + x + "," + y + ")");
				inner.appendChild(group);
				hex = dom.svg("path", {
					d: path.join(" "),
				});
				group.appendChild(hex);
			} else {
				hex = points;
			}

			// var circle = dom.svg("circle", {
			//   "r": radiusInner * 0.5,
			//   "style": { "fill": c.getNextColour() }
			// });
			// group.appendChild(circle);

			// var text = dom.svg("text", {
			//   "text-anchor": "middle",
			//   y: 5
			// });
			// text.innerHTML = i + "(" + col + "," + row + ")";
			// group.appendChild(text);

			/*
			var neighbours = [];
			if (row > 1) neighbours.push(i - 6); // T
			if (second) {
				if (col > 0) {
					if (row > 1) neighbours.push(i - 3); // TL
					if (row < rows - 1) neighbours.push(i + 3); // BL
				}
				if (col < cols - 1) {
					if (row > 1) neighbours.push(i - 2); // TR
					if (row < rows - 1) neighbours.push(i + 4); // BR
				}
			} else {
				if (col > 0) {
					if (row > 0.5) neighbours.push(i - 4); // TL
					if (row < rows - 2) neighbours.push(i + 2); // BL
				}
				if (col < cols) {
					if (row > 0.5) neighbours.push(i - 3); // TR
					if (row < rows - 2) neighbours.push(i + 3); // BR
				}
			}
			if (row < rows - 2) neighbours.push(i + 6); // B


			group.index = i;
			group.addEventListener("mouseover", function() {
				con.log(this.index, hexs[this.index].neighbours);
				var neighbours = hexs[this.index].neighbours;
				for (var j = 0; j < neighbours.length; j++) {
					var neighbour = hexs[neighbours[j]];
					var circle = dom.svg("circle", {
						"transform": "translate(" + neighbour.x + "," + neighbour.y + ")",
						// x: neighbour.x,
						// y: neighbour.y,
						"r": radiusInner * 1,
						"style": { "fill": "black" }
					});
					neighbourGroups.appendChild(circle);
				};
			});

			group.addEventListener("mouseout", function() {
				var svg = neighbourGroups;
				while (svg.lastChild) {
					svg.removeChild(svg.lastChild);
				}
			});
			*/

			hexs[i] = {
				index: i,
				hex: hex,
				x: x,
				y: y,
				colour: null,
				rendered: false,
				// neighbours: neighbours
			};
		}
		randomHexes = r.shuffle(hexs.slice());

		// con.log('cols', cols, 'rows', rows, 'hexagons', hexagons);
		// con.log('randomHexes', randomHexes.length, hexs.length);

		render();
	}

	function batch() {
		var shouldRender = (settings.spread.cur / settings.spread.max) * 10;
		// con.log("shouldRender", shouldRender);
		var maxRender = hexagons;
		var loopStart = currentBatch * batchSize,
			loopEnd = loopStart + batchSize;
		if (loopEnd > maxRender) loopEnd = maxRender;
		for (var h = loopStart; h < loopEnd; h++) {
			var index = randomHexes[h].index;
			var item = hexs[index];

			// var neighbours = [];
			// for(var i = 0; i < item.neighbours.length; i++) {
			//   var otherItemIndex = item.neighbours[i];
			//   // con.log(otherItemIndex);
			//   var otherItem = hexs[otherItemIndex];
			//   if (otherItem.rendered) {
			//     neighbours.push(otherItem.colour);
			//   }
			// }

			var dx, dy, d;
			var close = [];
			for (var i = 0; i < hexagons; i++) {
				if (i != h) {
					var otherItem = randomHexes[i];
					if (otherItem.rendered) {
						dx = item.x - otherItem.x;
						dy = item.y - otherItem.y;
						d = Math.sqrt(dx * dx + dy * dy);
						if (d < radiusOuter * smoothSize) {
							close.push(otherItem.colour);
						}
					}
				}
			}

			// con.log(neighbours.length,close.length);
			var colour;
			if (close.length > 0) {
				colour = c.mixColours(close);
				// colour = c.mutateColour(colour, 3);
			} else {
				colour = c.getNextColour();
			}

			if (vector) {
				item.hex.setAttribute("style", "fill:" + colour);
			} else {
				dx = item.x - 0.5 + getJitter();
				dy = item.y - 0.5 + getJitter();
				var distanceFromCenter = Math.round(Math.sqrt(dx * dx + dy * dy) * 10);

				if (distanceFromCenter < shouldRender) {
					stage.ctx.fillStyle = colour;
					stage.ctx.beginPath();
					for (i = 0; i < 6; i++) {
						var x = (item.x + item.hex[i].x) * size,
							y = (item.y + item.hex[i].y) * size;
						if (i === 0) {
							stage.ctx.moveTo(x, y);
						} else {
							stage.ctx.lineTo(x, y);
						}
					}
					stage.ctx.closePath();
					stage.ctx.fill();
				}
			}

			// stage.ctx.font = "18px Helvetica";
			// stage.ctx.fillStyle = "#FFF";
			// stage.ctx.fillText(distanceFromCenter, item.x * size - 4, item.y * size + 4);
			// con.log(dx, dy);

			hexs[index].rendered = true;
			hexs[index].colour = colour;
		}
		// con.log("doing batch", currentBatch, batches);

		currentBatch++;
		if (currentBatch == batches) {
			//
			progress("render:complete", experiment.stage);

			// document.body.addEventListener("click", init);
		} else {
			progress("render:progress", currentBatch / batches);
			// requestAnimationFrame(batch);
			setTimeout(batch, 25);
		}
	}

	function render() {
		batches = Math.ceil(hexagons / batchSize);
		currentBatch = 0;
		batch();
	}

	const update = (settings, seed) => {
		init({progress, size, settings, seed});
	};

	var experiment = {
		init,
		render,
		settings,
		stage: vector ? stage : stage.canvas,
		update,
	};

	return experiment;
};

if (isNode) {
	module.exports = hexagon_tile();
} else {
	define("hexagon_tile", hexagon_tile);
}
