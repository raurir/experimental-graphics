define("oscillator", function() {
	// one of my favourite ever 2d graphics generations - from circa 2010
	// original file location: Dropbox/Esquemedia/2015/funkyvector/flash/experiments

	var sw = window.innerWidth;
	var sh = window.innerHeight;
	var mouse = {x: 0, y: 0};

	var cols = colours.getRandomPalette();
	var canvas = dom.canvas(sw, sh);
	var ctx = canvas.ctx;

	var h = 0;
	var sc = 0.5;
	var yo = -300;
	var hr = 20;
	var irange = 300;
	var iinc = sw / irange;

	var f = 0;
	var fadeInt = 2;
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
			oscs[o][4] = rand.getNumber(0, 0.1);
			oscs[o][5] = rand.getNumber(0, 0.1);
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

	function onLoop(time) {
		requestAnimationFrame(onLoop);

		// sc -= 0.002;
		// if ( sc <= 0 ) removeEventListener( Event.ENTER_FRAME, newLine );

		// if (yo >= sh + 200) {
		// 	// removeEventListener( Event.ENTER_FRAME, newLine );
		ctx.clearRect(0, 0, sw, sh)
		yo = -300;
		h = 0;
		calcs = 0;
		while(yo < sh + 200) {

			for (var i = 0; i < irange; i++) {
				var j = getOsc(i, 0, hr);
				var k = getOsc(i, 1, hr);
				var l = getOsc(i + h, 2, 10);
				var m = getOsc(i + h, 3, 20);
				var xp = (l + j + iinc * i - 100) * 1.1;
				var yp = m + k + yo;
				// var matrix:Matrix = new Matrix( sc, 0, 0, sc, xp, yp );
				// var colorTrans:ColorTransform = new ColorTransform( (sc), (1-sc), 1, 0.2, 0, 0, 0, 0 );
				// bmpData.draw( circle, matrix, colorTrans, BlendMode.ADD);//, colorTransfrorm, bldendMode );
				ctx.beginPath();
				ctx.drawCircle(xp, yp, 3 * sc);
				ctx.fill();
			}

			h += 0.4;
			yo += 7;
		}
		con.log(calcs)
	}

	dom.on(window, ["mousemove", "touchmove"], function(e) {
		var event = (e.changedTouches && e.changedTouches[0]) || e;
		event.x = event.x || event.pageX;
		event.y = event.y || event.pageY;
		mouse.x = event.x - sw / 2;
		mouse.y = event.y - sh / 2;
	});

	function init() {
		genOsc();
		onLoop(0);
	}
	return {
		init: init,
		stage: canvas.canvas
	};
});
