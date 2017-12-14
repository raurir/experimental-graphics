define("seven_four_sevens", function() {

	// this is a remake of an old flash experiment
	// have not done the 'chem trails' yet, maybe one day
	// in honour of the memory of flash I have left all the variables as close to
	// the original as possible... _root, gotoAndStop

	var sw = 900, sh = 600;
	var canvas = dom.canvas(sw, sh);
	var images = [];
	var planes = [];
	var text = dom.element("div", {innerText: "Click to make a new waypoint, shift click to add multiple", style: {color: "white"}});
	var button = dom.button("Add planes", {className: "button"});
	document.body.appendChild(text);
	document.body.appendChild(button);

	dom.on(canvas.canvas, ["click"], function(e) {
		if (!e.shiftKey) _root.holdingpattern = [];
		_root.holdingpattern.push({_x: e.x, _y: e.y});
	});
	dom.on(button, ["click"], function(e) {
		planes.push(Plane());
	});

	var _root = {
		holdingpattern: [
			{_x: rand.getNumber(0, sw), _y: rand.getNumber(0, sh)},
			{_x: rand.getNumber(0, sw), _y: rand.getNumber(0, sh)},
			{_x: rand.getNumber(0, sw), _y: rand.getNumber(0, sh)},
		],
		createSmoke: function() {
			// this used to draw chem trails
		}
	}

	function Plane() {
		var PI = Math.PI;
		var PI2 = Math.PI * 2;
		var xdelta, ydelta, angle, targetangle, distance, deltaangle, planeframe;
		var cA, tA;
		var arrow = {}; // was some shape that draw an arrow to next waypoint
		var tAngle = 0;
		var turnMax, turnRate;
		var count = 0;
		var cf;

		var shape = {
			gotoAndStop: function(frame) {
				shape._currentframe = frame;
			},
			_currentframe: 1,
			_rotation: 0
		};

		var _x = Math.random() * sw;
		var _y = Math.random() * sh;
		var dir = Math.random() * PI2;
		var speed = Math.random() * 0.4 + 2;
		var scale = (speed - 1) / 2;// + Math.random() * 0.2;
		con.log(speed, scale)
		var turnMax = Math.random() * 0.03 + 0.01;
		var turnRate = turnMax / 20;
		// onEnterFrame = moveIt; // RIP :)

		var holdingpatternpos = Math.floor(Math.random() * _root.holdingpattern.length);
		var targ = _root.holdingpattern[holdingpatternpos];

		function moveIt()
		{
			if (!targ) {
				holdingpatternpos = Math.floor(Math.random() * _root.holdingpattern.length);
				targ = _root.holdingpattern[holdingpatternpos];
			}

			xdelta = _x - targ._x;
			ydelta = _y - targ._y;

			// calculate distance
			distance = Math.sqrt( Math.pow( xdelta, 2 ) + Math.pow( ydelta, 2 ) );
			if (distance < 75)
			{
				holdingpatternpos++;
				if (holdingpatternpos >= _root.holdingpattern.length)
				{
					holdingpatternpos = 0;
				}
				targ = _root.holdingpattern[holdingpatternpos];
			}

			arrow._xscale = arrow._yscale = distance / 5;

			// calculate angle
			angle = Math.atan( ydelta / xdelta ); //  * 180 / Math.PI;
			if ( xdelta < 0 )
			{
				targetangle = 0.5 * PI - angle;
			}
			else
			{
				targetangle = 1.5 * PI - angle;
			}


			deltaangle = dir - targetangle;
			if ( Math.abs( deltaangle ) > PI )
			{
				if ( deltaangle < 0 )
				{
					deltaangle = deltaangle % PI + PI;
					dir = dir + PI2;
				}
				else
					{
				 	deltaangle = deltaangle % PI - PI;
				 	dir = dir - PI2;
				}
			}

			cf = shape._currentframe;

			if (deltaangle > 0.1) {
				if (tAngle < turnMax) {
					tAngle += turnRate;
				} else {
					tAngle = turnMax;
				}

				shape.gotoAndStop(58 - (Math.round(tAngle / turnMax * 29) + 28));

			} else if (deltaangle < -0.1) {
				if (tAngle > -turnMax) {
					tAngle -= turnRate;
				} else {
					tAngle = -turnMax;
				}

				shape.gotoAndStop(58 - (Math.round(tAngle / turnMax * 29) + 28));

			} else {
				tAngle = deltaangle / 50;

				if (cf < 28) {
					shape.gotoAndStop(cf + 1);
				} else if (cf > 28) {
					shape.gotoAndStop(cf - 1);
				}

			}

			dir -= tAngle;

			arrow._rotation = -targetangle * 180 / PI; // flash used degrees.

			shape._rotation = -dir;
			_x += Math.sin( dir ) * speed;
			_y += Math.cos( dir ) * speed;

			canvas.ctx.save();
			canvas.ctx.translate(_x, _y);
			canvas.ctx.rotate(shape._rotation);
			var flipX = false;
			var cfFrame = Math.floor(shape._currentframe / 3.1);
			// flash approach was 1 - 59 frames.
			// convert to integer between 0 - 9 inclusive
			if (cfFrame > 9) {
				flipX = true;
				cfFrame = 19 - cfFrame;
			}
			var cfImage = images[cfFrame];
			var img = cfImage.masked.canvas;
			canvas.ctx.scale((flipX ? -1 : 1) * scale, scale);
			canvas.ctx.translate(-img.width / 2, -img.height / 2);
			canvas.ctx.drawImage(img, 0, 0);
			canvas.ctx.restore();

			count++;
			if (count > 3) {
				count = 0;
				_root.createSmoke(this);
			}
		}

		return moveIt;
	}

	function init() {
		var frames = 10, loaded = 0;
		function loadComplete() {
			loaded++;
			if(loaded == frames * 2) {
				for (var f = 0; f < frames; f++) {
					var maskImage = images[f].mask;
					var mask;
					// done this before, but lazy so using copy pasta from
					// https://stackoverflow.com/questions/43251544/html-canvas-use-greyscale-image-as-mask
					var mask = dom.canvas(maskImage.width, maskImage.height)
					mask.ctx.drawImage(maskImage, 0, 0);
					var data = mask.ctx.getImageData(0, 0, maskImage.width, maskImage.height);
					var i = 0;
					while(i < data.data.length){
					    var rgb = data.data[i++] + data.data[i++] + data.data[i++];
					    data.data[i++] = 255 - rgb / 3;
					}
					mask.ctx.putImageData(data, 0, 0);

					var masked = dom.canvas(maskImage.width, maskImage.height)
					masked.ctx.drawImage(images[f].plane, 0, 0)
					masked.ctx.globalCompositeOperation = "destination-out";
					masked.ctx.drawImage(mask.canvas, 0, 0);
					masked.ctx.globalCompositeOperation = "source-over";
					images[f].masked = masked;
					// canvas.ctx.drawImage(masked.canvas, 0, 0);
				}
				startAnimation();
			}
		}

		function startAnimation() {
			planes = [Plane()];
			function update() {
				requestAnimationFrame(update);

				canvas.ctx.fillStyle = "#1a4859";
				canvas.ctx.fillRect(0, 0, sw, sh);

				for (var i = 0; i < _root.holdingpattern.length; i++) {
					var waypoint = _root.holdingpattern[i];
					canvas.ctx.beginPath();
					canvas.ctx.drawCircle(waypoint._x, waypoint._y, 20);
					canvas.ctx.closePath();
					canvas.ctx.fillStyle = "#259bc6";
					canvas.ctx.fill();
					canvas.ctx.beginPath();
					canvas.ctx.fillStyle = "white";
					canvas.ctx.font = '18px Helvetica';
					canvas.ctx.fillText(i + 1, waypoint._x - 5, waypoint._y + 5);
					canvas.ctx.fill();
				}
				for (i = 0; i < planes.length; i++) {
					var p = planes[i];
					p();
				}
			}
			update();
		}

		for (var i = 0; i < frames; i++) {
			// in flash these assets were used with one masking the other, so gotta replicate!
			var plane = new Image();
			plane.onload = loadComplete
			plane.src = "/assets/seven_four_sevens/Image " + (i + 1) + " at frame 0.jpg";
			var mask = new Image();
			mask.onload = loadComplete;
			mask.src = "/assets/seven_four_sevens/Image " + (i + 1) + " alpha channel at frame 0.png";
			images[i] = {
				plane: plane,
				mask: mask,
				masked: null // generate these after all loaded
			}
		}

	}


	return {
		init: init,
		stage: canvas.canvas
	};

});