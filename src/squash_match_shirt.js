/*global fillDither */
var isNode = typeof module !== "undefined";
if (isNode) {
	var colours = require("./colours.js");
	var dom = require("./dom.js");
	// var geom = require("./geom.js");
	var rand = require("./rand.js");
	var http = require("http");
	var https = require("https");
}

const squash_match_shirt = () => () => {
	const r = rand.instance();
	const c = colours.instance(r);

	const stage = dom.canvas(1, 1);
	const {canvas, ctx} = stage;
	const settings = {};

	let size;
	let sizeX;
	let sizeY;

	const sectors = 10;
	// angle of each sector
	const angle = (1 / sectors) * Math.PI * 2;

	function renderRegion(rot) {
		const settings = {
			alternate: true,
			baseRotation: (1 / 4 + 1 / sectors / 2) * Math.PI * 2,
			shape: 1,
			varyRotation: false,
			wiggle: 0,
		};
		const d = size / 2;
		// Math.sqrt(Math.pow(size / 2, 2) * 2); // diagonal distance
		const pattern = fillDither({c, r, size: d, settings});
		const patternFill = ctx.createPattern(pattern, "no-repeat");

		ctx.save();
		ctx.translate(size / 2, size / 2);
		ctx.rotate(rot * Math.PI * 2);
		ctx.fillStyle = patternFill;
		ctx.beginPath();
		ctx.moveTo(0, 0);
		ctx.lineTo(d, 0);
		ctx.lineTo(Math.cos(angle) * d, Math.sin(angle) * d);
		ctx.closePath();
		ctx.fill();
		// ctx.strokeStyle = "white";
		// ctx.lineWidth = 10;
		// ctx.stroke();
		ctx.restore();
	}

	function renderSquare() {
		const settings = {
			baseRotation: 0,
			varyRotation: false,
		};
		const d = size;
		const pattern = fillDither({c, r, size: d, settings});
		const patternFill = ctx.createPattern(pattern, "no-repeat");

		ctx.fillStyle = patternFill;
		ctx.rect(0, 0, size, size);
		ctx.fill();
		// ctx.strokeStyle = "white";
		// ctx.lineWidth = 10;
		ctx.stroke();
	}

	function renderBMPFromURL(url, scale) {
		function drawToContext(img) {
			var width = img.width,
				height = img.height;
			con.log("drawToContext");
			ctx.translate(size / 2, size / 2);
			ctx.scale(scale, scale);
			ctx.translate(-width / 2, -height / 2);
			ctx.drawImage(img, 0, 0);
			// progress("render:complete", bmp.canvas);
		}

		if (isNode) {
			// promise didn't work!
			loadImageURL(
				url,
				function(buffer) {
					makeImage(
						buffer,
						function(img) {
							drawToContext(img);
						},
						function(err) {
							con.log("makeImage fail", err);
						},
					);
				},
				function(err) {
					con.log("loadImageURL fail", err);
				},
			);
		} else {
			var img = new Image();
			img.onload = function() {
				// con.log('on load');
				drawToContext(img);
			};
			img.onerror = function(err) {
				con.log("img.onerror error", err);
			};
			img.src = url;
		}
	}

	function loadImageURL(url, fulfill, reject) {
		var protocol = http;
		if (/https:\/\//.test(url)) {
			protocol = https;
		}
		protocol.get(url, function(res) {
			var buffers = [];
			res.on("data", function(chunk) {
				// length += chunk.length;
				// con.log("loadImageURL data", length);
				buffers.push(chunk);
			});
			res.on("end", function() {
				var loaded = Buffer.concat(buffers);
				fulfill(loaded);
			});
			res.on("error", function(e) {
				con.log("loadImageURL reject", e);
				reject(e);
			});
		});
	}

	function makeImage(data, fulfill, reject) {
		var img = new Image();
		img.src = data;
		if (img) {
			// con.log("makeImage fulfill", img);
			fulfill(img);
		} else {
			con.log("makeImage reject");
			reject();
		}
	}
	function generate() {
		// renderSquare();

		// ctx.fillStyle = "transparent";
		// ctx.rect(0, 0, size, size);
		// ctx.fill();
		for (var i = 0; i < sectors; i++) {
			renderRegion(i / sectors);
		}
		// renderBMPFromURL("./SquashMatchIconCircle.png", 0.5);
		// made with https://ezgif.com/crop/

		ctx.globalCompositeOperation = "destination-out";
		ctx.beginPath();
		ctx.drawCircle(size / 2, size / 2, (size / 2) * 0.6);
		ctx.closePath();
		ctx.fill();
		ctx.globalCompositeOperation = "source-over";

		renderBMPFromURL("./SquashMatchIconCircleHiRes.png", 0.3);
	}

	return {
		init: (options) => {
			size = options.size;
			sizeX = size;
			sizeY = size;
			r.setSeed(options.seed);
			c.setPalette(["#fff", "transparent"]);
			stage.setSize(sizeX, sizeY);
			generate(0);
		},
		settings,
		stage: canvas,
		update: () => {},
	};
};

if (isNode) {
	module.exports = squash_match_shirt();
} else {
	define("squash_match_shirt", squash_match_shirt);
}
