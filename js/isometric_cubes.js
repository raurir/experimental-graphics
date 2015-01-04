var sw = 600, sh = 600;

function genRan(min, max) {
	return Math.random() * (max - min) + min;	
}

var bmp = dom.createCanvas(sw,sh);
document.body.appendChild(bmp.canvas);
var ctx = bmp.ctx;

var cx = sw / 2;
var cy = sh / 2;

var frame = 0;

function newLine() {

	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, sw, sh); 

	var dot = 50, cols = 4, rows = 4;

	var osc = Math.sin(frame * 0.004) * 30

	var angle = osc / 360 * Math.PI * 2;

	var cos = dot * Math.cos(angle);
	var sin = dot * Math.sin(angle);

	var x, y;

	function drawCube() {

		

		ctx.fillStyle = "#aa0";
		ctx.strokeStyle = "#ff0";
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + cos, y + sin);
		ctx.lineTo(x + cos, y + sin + dot);
		ctx.lineTo(x, y + dot);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		
		ctx.fillStyle = "#a0a";
		ctx.strokeStyle = "#f0f";
		ctx.beginPath();
		ctx.moveTo(x + cos, y + sin);
		ctx.lineTo(x + cos * 2, y);
		ctx.lineTo(x + cos * 2, y + dot);
		ctx.lineTo(x + cos, y + sin + dot);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
				
		ctx.fillStyle = "#0aa";
		ctx.strokeStyle = "#0ff";
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + cos, y + sin);
		ctx.lineTo(x + cos * 2, y);
		ctx.lineTo(x + cos, y - sin);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}

	for (var i = 0; i < cols; i++) {
		for (var j = 0; j < rows; j++) {
			x = 100 + i * cos * 2;
			y = cy + j * sin * 4; 

			if (i%2 == 0) y += sin * 2;

			drawCube();
		}
	}

	frame += 1;
	requestAnimationFrame(newLine)
}

newLine();