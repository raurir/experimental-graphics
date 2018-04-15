define("attractor", function() {

	//attractor copied from somewhere. sept 09.

	var sw = window.innerWidth;
	var sh = window.innerHeight;
	var w = 400, h = 400;

	var cols = colours.getRandomPalette();
	var canvas = dom.canvas(sw, sh);
	var ctx = canvas.ctx;

	var a = 0.19;
	var b = .9;
	var c = 1.3;
	// var d = 100;
	var xn1 = 5;
	var yn1 = 0;
	var xn, yn;

	var scale =40;
	var iterations = 2e4;
	var mouse = {x: 0, y: 0}
	function f(x){
	  return((x + .1 + x * (a - c) * x) / (1.1 + a * (c*c + a*a)  * x * x )) * 1.3;
	}
	function onLoop(time) {
		requestAnimationFrame(onLoop);

		ctx.fillStyle = "white"
		ctx.fillRect(0, 0, sw, sh);
		// c += ((sw / 2 - mouse.x) / 9000 - c) / 2;
		// d += ((sh / 2 - mouse.y) - d) / 2;

		c = mouse.x / 9000;
		xn1 = 0;
		yn1 = 0;
		for (var i = 0; i<iterations; i++){
			xn = xn1;
			yn = yn1;
			xn1 = -xn - a + c +  f(yn);
			yn1 = -xn + c * f(xn * yn);
			ctx.fillStyle = "rgba(0,0,0,0.3)"
			ctx.fillRect(380 + xn1 * scale, 450 + yn1 * scale, 1, 1);
		}
	}

	dom.on(window, ["mousemove", "touchmove"], function(e) {
		var event = (e.changedTouches && e.changedTouches[0]) || e;
		event.x = event.x || event.pageX;
		event.y = event.y || event.pageY;
		mouse.x = event.x - sw / 2;
		mouse.y = event.y - sh / 2;
	});


	function init() {
		onLoop(0);
	}
	return {
		init: init,
		stage: canvas.canvas
	};
});
