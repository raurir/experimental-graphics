define("infinite_scrolling_cogs", function() {

	var sw = window.innerWidth, sh = window.innerHeight;

	function makeCanvas(w,h) {
		var can = document.createElement('canvas');
		can.width = w;
		can.height = h;
		return can;
	}

	var stage = makeCanvas(sw,sh);

	function init() {

		var context = stage.getContext('2d');

		var padding = 5; // canvas padding for cogs
		var cogs = [];
		var prevCog;
		var pi = 3.14159265; // because 1.9999999999997 is 2...
		var pi2 = pi*2;
		var dir = -1;
		var cx = 0.5 * sw;
		var cy = 0;
		var tr = 0;
		var ang = 0;
		var speed = 0.02;
		var cogNumber = 0;
		var holeStyle = { fillStyle: "#000", lineWidth: 0 }
		var curvature = 1.7;


		function number(min,max) {
			return Math.random() * (max - min) + min;
		}
		function integer(min,max) {
			return ~~number(min,max+1);
		}

		function colourGrey( options ) {
			var defaults = { darkest: 0, lightest: 255, alpha: 1 };
			for (var p in options ) defaults[p] = options[p];
			var white = defaults.white ? defaults.white : integer(defaults.darkest,defaults.lightest);
			var r = g = b = white;
			var a = defaults.alpha;
			return "rgba("+r+","+g+","+b+","+a+")";
		}

		// noise removed

		function drawCircle( c, x, y, r, style, antiClockwise, renderNow ) {
			c.moveTo( x + r, y ); // go to start of arc
			if ( antiClockwise == undefined ) antiClockwise = false; // double negative love...
			//con.log("drawCircle", x, y);
			var defaults = { fillStyle:"#fff",lineWidth:0,strokeStyle:"#000"};
			for (var p in style ) defaults[p] = style[p];
			c.fillStyle = defaults.fillStyle;
			c.lineWidth = defaults.lineWidth;
			c.strokeStyle = defaults.strokeStyle;
			if ( renderNow ) c.beginPath();
			c.arc( x, y, r, 0, pi2, antiClockwise );
			if ( renderNow ) {
				c.closePath();
				if ( defaults.fillStyle ) c.fill();
				if ( defaults.lineWidth ) c.stroke();
			}
		}


		function createCog( forceX, forceY ) {

			var ctx; // cog context
			var size;

			prevCog = cogs[ cogNumber - 1 ];
			if ( forceX && forceY && prevCog) {
				var dy = forceY - prevCog.yp;
				var dx = forceX - prevCog.xp;
				ang = Math.atan(dy/dx);
				ang += dx < 0 ? pi : 0;
				dx = Math.abs(dx);
				dy = Math.abs(dy);
				dx -= Math.abs(prevCog.size);
				dy -= Math.abs(prevCog.size);
				size = Math.sqrt( dx * dx + dy * dy );
			} else {
				ang = number(0,pi2);
				size = number(60,100);
			}


			if ( size < 50 || size > 300) {
				// con.log("Too close! Try clicking further away from the last cog..." );
				return;
			}

			var teeth = ~~(size / 10);

			dir *= -1;

			if (cogNumber) {
				tr += size - 10;
				cx += tr * Math.cos(ang);
				cy += tr * Math.sin(ang);
			}
			tr = size - 10;

			var minRad = size - 25;
			var maxRad = size;
			var verts = [];
			var step = pi2 / (teeth * 4);
			var mod = 0;
			var oddEven = 0;
			var halfRadius = (maxRad - minRad) / curvature + minRad;
			var realX, realY, halfX, halfY;
			for (var j = 0; j < teeth * 4; j++ ) {
				var i = j * step;
				var topBottomLand = (~~(mod)%2);
				var r = topBottomLand * (maxRad - minRad) + minRad;
				mod += .5;
				oddEven += 1;
				var angle = i - step / 2; // offsets teeth a bit, making sure at angle 0, we are in the middle of a "bottom land" rather than "top land"
				realX = r * Math.cos(angle);
				realY = r * Math.sin(angle);
				if (oddEven%2 == 0) {
					v = {tb:topBottomLand, ex:realX, ey:realY};
				} else {
					halfX = halfRadius * Math.cos(i - step);
					halfY = halfRadius * Math.sin(i - step);
					v = {tb:topBottomLand, mp:true, ex:realX, ey:realY, mx:halfX, my:halfY};
				}
				verts.push( v );
				// con.log("coords", i, v.ex, v.ey, v.mx, v.my );
			}
			// con.log("=====================");




			function drawBand( minRadius, maxRadius ) {
				if ( number(0,1) < 0.3 ) return;
				var midRadius = (maxRadius + minRadius) / 2;
				var bandSize = maxRadius - minRadius;
				drawCircle( ctx, 0, 0, midRadius, {
					fillStyle: null,
					strokeStyle: colourGrey({darkest:0, lightest: 40, alpha: 0.5}),
					// colour rust removed from original
					lineWidth: bandSize
				},
				false, true );
			}

			function drawCutouts( minRadius, maxRadius ) {
				var midRadius = (maxRadius + minRadius) / 2;
				var bandSize = maxRadius - minRadius;
				if ( integer(0,1) == 0 ) {
					generateHoles( midRadius, bandSize );
				} else {
					generateSegment( midRadius, bandSize );
				}
			}

			function generateHoles( midRadius, bandSize ) {
				//var holes = ~~(teeth * integer(1,3) / integer(1,2));
				var holeSize = bandSize / 2 * number(0.6,0.9);
				var holes = ~~(number(0.5,0.9) * pi2 * midRadius / holeSize / 2);
				holeSize *= number(0.5,0.9);
				for ( var i = 0; i < holes; i++ ) {
					var angle = i / holes * pi2;// + step / 2;
					drawCircle( ctx, midRadius * Math.cos(angle), midRadius * Math.sin(angle), holeSize, holeStyle, true );
				}
			}

			function generateSegment( midRadius, bandSize ) {
				// capped specifies segments to be rounded or angular... angular with many segments will be akin to spokes
				var capped = integer(0,1) == 0;
				var segments = ~~(Math.pow(teeth, 1 / (capped ? integer(2,4) : integer(2,3)) )) + 1;
				var holeSize = number(0.5,0.8) * bandSize;
				// if capped, remove the capping from segment size... on second thoughts, otherwise remove a little anyway!
				var segmentSize = (pi2 / segments - ( Math.asin( holeSize / midRadius ) * capped ? 1 : 0.5 )) * number(0.5,0.9);
				var innerRadius = midRadius - holeSize / 2;
				var outerRadius = midRadius + holeSize / 2;

				for ( var i = 0; i < segments; i++ ) {
					var startAngle = i / segments * pi2;
					var endAngle = startAngle + segmentSize;
					ctx.moveTo( Math.cos( startAngle ) * innerRadius, Math.sin( startAngle ) * innerRadius );
					ctx.arc( 0, 0, innerRadius, startAngle, endAngle, false );
					if ( capped ) {
						ctx.arc( Math.cos( endAngle ) * midRadius, Math.sin( endAngle ) * midRadius, holeSize / 2, endAngle + pi, endAngle, true );
					} else {
						ctx.lineTo( Math.cos( endAngle ) * outerRadius, Math.sin( endAngle ) * outerRadius );
					}
					ctx.arc( 0, 0, outerRadius, endAngle, startAngle, true );
					if ( capped ) {
						ctx.arc( Math.cos( startAngle ) * midRadius, Math.sin( startAngle ) * midRadius, holeSize / 2, startAngle, startAngle + pi, true );
					} else {
						ctx.lineTo( Math.cos( startAngle ) * innerRadius, Math.sin( startAngle ) * innerRadius );
					}
				}
			}




			var cog = {
				index: cogNumber,
				size: size,
				rotation: number(0,pi2),
				teeth: teeth,
				dir: dir,
				xp: cx,
				yp: cy,
				canvas: null
			}

			if (cogNumber) {
				prevCog = cogs[ cogNumber - 1 ];
				cog.rotation = prevCog.teeth / cog.teeth * -prevCog.rotation + ang * (prevCog.teeth + cog.teeth) / cog.teeth;
				if ( cog.teeth%2 == 0 ) {
					cog.rotation += pi2 / (cog.teeth*2);
				}
			}

			cog.render = function() {
				var dims = (this.size + padding) * 2;
				this.canvas = makeCanvas( dims, dims );
				//	document.body.appendChild( this.canvas );
				ctx = this.canvas.getContext('2d');

				ctx.save();
				ctx.translate( this.size + padding, this.size + padding );

				// ctx.strokeStyle = "black";
				// ctx.lineWidth = 2;
				ctx.shadowBlur = 2;
				ctx.shadowColor = "#000";

				ctx.beginPath();
				v = verts[0];
				ctx.moveTo(v.ex, v.ey);
				for (var i = 1; i < verts.length; i++ ) {
					var v = verts[i];
					if (v.mp) {
						ctx.quadraticCurveTo(v.mx, v.my, v.ex, v.ey);
					} else {
						ctx.lineTo(v.ex, v.ey);
					}
				}
				v = verts[0];
				ctx.quadraticCurveTo(v.mx, v.my, v.ex, v.ey);

				// draw some cutouts
				// draw axle
				var axleSize = minRad * 0.2;
				drawCircle( ctx, 0, 0, minRad * 0.2, holeStyle, true );
				drawCutouts( axleSize + minRad * 0.1, minRad * 0.9);
				ctx.closePath();

				// dotty metal removed from original
				ctx.fillStyle = colourGrey({darkest:70, lightest: 200, alpha: 1})
				ctx.fill();
				ctx.stroke();

				if (Math.random() > 0.5) {
					// maybe draw centre
					drawCircle( ctx, 0, 0, minRad * 0.16, holeStyle, true, true );
				}

				ctx.globalCompositeOperation = "source-atop";
				drawBand( axleSize, axleSize + minRad * 0.1 );
				drawBand( minRad * 0.9, minRad );

				// draw some lathe marks - they bleed into the shadow, so be it.
				// latheScratches removed from original

			}


			cog.draw = function() {
				if ( !cog.canvas ) {
					cog.render();
				}
				context.save();
				context.translate( this.xp, this.yp  );
				context.rotate( this.rotation );
				context.drawImage( this.canvas, -this.size - padding, -this.size - padding );
				context.restore();

			}

			cog.rotate = function() {
				this.rotation += (pi2 / this.teeth * this.dir) * speed;
				this.draw();
			}

			cogs[cogNumber] = cog;
			cogNumber++;
		}

		// stripy background removed from original

		var scrollY = 0;
		function onLoop() {
			requestAnimationFrame(onLoop);
			scrollY--;

			if (scrollY - sh - 100 < -cy ) {
				incrementCog();
			}

			context.fillStyle = "#ddd";
			context.fillRect(0,0,sw,sh);

			context.save();
			context.translate(0, scrollY);
			for (var i = 0; i < cogs.length; i++) {
				cogs[i].rotate();
			}
			context.restore();
		}

		var y = 0;
		function incrementCog() {
			// lean towards left or right depending on current trend away from centre
			var newX = (cx < sw / 2
				? number(-1, 3)
				: number(-3, 1)) * 50;
			var x = cx + newX;
			createCog(x, y);
			y = cy + number(0, 200);
		}
		for (var i = 0; i < 5; i++) {
			incrementCog();
		}

		document.body.appendChild(stage);
		onLoop();

	}

	return {
		init: init,
		stage: stage
	}

});