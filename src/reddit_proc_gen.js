const isNode = (typeof module !== 'undefined');

const reddit_proc_gen = function() {
	var TAU = Math.PI * 2;
	var sw, sh, cx, cy;
	var stage = dom.canvas(1, 1);
	var ctx = stage.ctx;
	var size;

	//copied from recursive_polygon
	function drawPolygon(points, options) {
		ctx.beginPath();
		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		for (var i = 0; i < points.length; i++) {
			const p = points[i];
			// const dx = px


			ctx[i == 0 ? "moveTo" : "lineTo"](p.x, p.y);
		};
		ctx.closePath();
		if (options.lineWidth && options.strokeStyle) {
			ctx.strokeStyle = options.strokeStyle;
			ctx.lineWidth = options.lineWidth;
			ctx.stroke();
		}
		if (options.fillStyle) {
			ctx.fillStyle = options.fillStyle;
			ctx.fill();
		}
	}




	function splitPolygon(array, start, end) {
		var copy = array.slice();
		var chunk1 = copy.slice(0, start + 1);
		// console.log("chunk1", chunk1);
		var chunk3 = copy.splice(end, array.length - end);
		// console.log("chunk3", chunk3);
		var chunk2 = array.slice().splice(start, end - start + 1);
		var array1 = chunk1.concat(chunk3);
		var array2 = chunk2;
		return [
			array1,
			array2
		];
	}

	// end copied

 	function init(options) {
		size = options.size;
		sw = options.sw || size;
		sh = options.sh || size;
		stage.setSize(sw, sh);
		cx = sw / 2;
		cy = sh / 2;
		ctx.clearRect(0, 0, sw, sh);
		ctx.fillStyle = "#0f0";
		ctx.fillRect(cx - 20, cy - 20, 40, 40);

		const points = [
			{x: 0, y: 0},
			{x: sh, y: 0},
			{x: sh, y: sh},
			{x: 0, y: sh},
		];

		drawPolygon(points, {fillStyle: "#ff8822", strokeStyle: "#ff3322", lineWidth: 20});

		var newArrays = splitPolygon(points, 0, 2);
		drawPolygon(newArrays[0], {fillStyle: "#ff8822", strokeStyle: "#ff3322", lineWidth: 10});
		drawPolygon(newArrays[1], {fillStyle: "#228822", strokeStyle: "#113322", lineWidth: 10});

		// const insetPoints = geom.insetPoints(points, -40);
		// con.log(insetPoints);

	}
	var experiment = {
		stage: stage.canvas,
		init: init,
	}

	progress("render:complete", stage.canvas);

	return experiment;

};
if (isNode) {
  module.exports = reddit_proc_gen();
} else {
  define("reddit_proc_gen", reddit_proc_gen);
}