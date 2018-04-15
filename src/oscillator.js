define("oscillator", function() {
	// one of my favourite ever 2d graphics generations - from circa 2010
	// original file location: Dropbox/Esquemedia/2015/funkyvector/flash/experiments

	var sw = window.innerWidth;
	var sh = window.innerHeight;

	var size = 800;

	var cols = colours.getRandomPalette();
	var bg = colours.getRandomColour();
	var fg = colours.getNextColour();
	var canvas = dom.canvas(sw, sh);
	var ctx = canvas.ctx;

	var gap = 4;

	var h;
	var yo;
	var circleSize = 1;
	var oscRange = 10;

	var range = Math.ceil(size / gap);
	var xGap = sw / range;
	var yGap = sh / range;

	var calcs = 0;

	var oscs = [];
	var oscillators = 10;
	function genOsc() {
		for (var o = 0; o < oscillators; o++) {
			oscs[o] = [];
			oscs[o][0] = rand.getNumber(0, 0.1);
			oscs[o][1] = rand.getNumber(0, 0.1);
			oscs[o][2] = rand.getNumber(0, 0.1);
			oscs[o][3] = rand.getNumber(0, 0.1);
		}
	}

	function getOsc(i, a, range) {
		var temp = 0;
		for (var o = 0; o < oscillators; o++) {
			calcs++;
			temp += Math.sin(i * oscs[o][a]) * range;
		}
		return temp; //oscillators;
	}

	var start = rand.getInteger(0, 1e6);

	function onLoop(time) {
		// requestAnimationFrame(onLoop);

		ctx.fillStyle = bg;
		ctx.fillRect(0, 0, sw, sh);
		ctx.fillStyle = fg;
		yo = 0;
		h = time * 0.02;
		calcs = 0;
		var rows = 0;
		while(rows < range) {

			for (var i = 0; i < range; i++) {
				var t = start + i;// + time * 0.01;
				var j = getOsc(t, 0, oscRange);
				var k = getOsc(t, 1, oscRange);
				var l = getOsc(t + h, 2, oscRange);
				var m = getOsc(t - h, 3, oscRange);
				var xp = (l + j + xGap * i);// * 1.1;
				var yp = m + k + yo;
				ctx.beginPath();
				ctx.drawCircle(xp, yp, circleSize);
				ctx.fill();
			}

			h += 0.4;
			yo += yGap;
			rows ++;
		}
		// if (time < 1000) con.log(range, rows, range * rows, calcs)
	}

	function init() {
		genOsc();
		onLoop(0);
	}
	return {
		init: init,
		stage: canvas.canvas
	};
});
