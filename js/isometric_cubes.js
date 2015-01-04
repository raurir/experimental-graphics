var sw = 400, sh = 400;
var bmp = dom.createCanvas(sw,sh);

var ctx = bmp.ctx;
var cx = sw / 2;
var cy = sh / 2;
var frame = 0;

function newLine() {

	// ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, sw, sh); 

	var dot = 60, cols = 8, rows = 10;
	
	var gap, osc, perc;

	var anim = frame % 300;
	if (anim < 100) {	
		gap = anim / 100;
		perc = 0;
	} else if (anim < 200) {
		gap = 1;
		perc = (anim - 100) / 100;
	} else if (anim < 300) {
		gap = 1 - ((anim - 200) / 100);
		perc = 1;
	} //else if (anim < 400) {
	// 	gap = 0;
	// 	perc = (anim - 300) / 100;
	// }

	var angle = perc * 30 / 360 * Math.PI * 2;
	var cos = dot * Math.cos(angle);
	var sin = dot * Math.sin(angle);

	function drawCube(x,y) {

		// if (y > sh + 20) y -= (sh);

		/*

            b
           / \
          /   \
		 /     \
		a       c
        |\     /|
		| \   / |
		|  \ /  |
		f   g   d
		 \  |  /
		  \ | /
		   \|/
		    e    

		*/

		var ax = x, 
			ay = y,

			bx = x + cos * perc, 
			by = y - sin,
			
			cx = x + cos + cos * perc, 
			cy = y,

			dx = cx, 
			dy = y + dot,

			ex = x + cos, 
			ey = y + sin + dot,

			fx = x, 
			fy = y + dot,

			gx = ex, 
			gy = y + sin;
		

		ctx.fillStyle = "#444";
		// ctx.strokeStyle = "#000";
		ctx.beginPath();
		ctx.moveTo(ax, ay);
		ctx.lineTo(gx, gy);
		ctx.lineTo(ex, ey);
		ctx.lineTo(fx, fy);
		ctx.closePath();
		ctx.fill();
		// ctx.stroke();
		/*
		ctx.fillStyle = "#666";
		// ctx.strokeStyle = "#f0f";
		ctx.beginPath();
		ctx.moveTo(gx, gy);
		ctx.lineTo(cx, cy);
		ctx.lineTo(dx, dy);
		ctx.lineTo(ex, ey);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
				
		ctx.fillStyle = "#888";
		// ctx.strokeStyle = "#0ff";
		ctx.beginPath();
		ctx.moveTo(ax, ay);
		ctx.lineTo(gx, gy);
		ctx.lineTo(cx, cy);
		ctx.lineTo(bx, by);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		*/
	}
	
	var gapX = gapY = 0.5 + gap * 0.5;
	for (var i = 0; i < cols; i++) {
		var x = -10 + i * cos * 2 * gapX;
		for (var j = 0; j < rows; j++) {			
			var y = -200 + j * dot * 2 * gapY + i * sin * 2 * gapY;
			drawCube(x, y);
		}
	}

	// con.log(cos,);

	frame += 0.5;
	requestAnimationFrame(newLine)
}

document.body.appendChild(bmp.canvas);

newLine();