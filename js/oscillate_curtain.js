var sw = 600, sh = 600;

function genRan(min, max) {
	return Math.random() * (max - min) + min;	
}

var o, oscs = [];

var oscillators = 15;
for (o=0;o<oscillators;o++) {
	oscs[ o ] = [];
	oscs[ o ][ 0 ] = genRan(0, 0.1);
	oscs[ o ][ 1 ] = genRan(0, 0.1);
	oscs[ o ][ 2 ] = genRan(0, 0.1);
	oscs[ o ][ 3 ] = genRan(0, 0.1);
}

function getOsc(i,a,range) {
	var temp = 0;
	for (o=0;o<oscillators;o++) {
		temp += Math.sin(i * oscs[ o ][ a ]) * range;
	}
	temp /= oscillators;
	return temp;
}

var bmp = dom.createCanvas(sw,sh);
document.body.appendChild(bmp.canvas);

var h = 0;
var xRange = 30;
var yRange = 30;

var xGap = sw / xRange * 1;
var yGap = sh / yRange * 1;

var xHalf = xRange / 2;
var yHalf = yRange / 2;

var frame = 0;

function newLine() {

	bmp.ctx.clearRect(0, 0, sw, sh); 



	var f = 0;

	for (var h = 0; h < yRange; h++) {
		for (var v = 0; v < xRange; v++) {

			f++;

			var xyIndex = v + h;// getOsc(frame + v + h, 0, 10);

			var xy = frame + xyIndex;//i + h * xRange;
			// var xy = frame + getOsc(f, 1, 30);//i + h * xRange;

			// var oscX = h < yHalf ? h : yRange - h;
			// var oscY = v < xHalf ? v : xRange - v;
			// var oscRange = (oscX > oscY ? oscY : oscX) * 5;
			var oscRange = 15;//h;

			// con.log("osca", oscX, oscY, oscRange);

			var xpos = (v + 0.5) * xGap + getOsc(xy, 2, oscRange);
			var ypos = (h + 0.5) * yGap + getOsc(xy, 3, oscRange);

			bmp.ctx.fillStyle = "#000";
			// bmp.ctx.fillRect(xpos - 2, ypos - 2, 4, 4);
			bmp.ctx.fillText(Math.round(xyIndex), xpos - 2, ypos - 2)

		}
	}
	frame += 1;
	if (frame < 5e9) requestAnimationFrame(newLine)
	// setTimeout(newLine, 50);
}

newLine();