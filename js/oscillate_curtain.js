
var sw = 1000,
sh = 1000,
isNode = false;

var con = console;

function createCanvas(w, h) {

	var c;
	if (isNode) {
		c = new Canvas(w,h);
	} else {
		c = document.createElement("canvas");
		c.width = w;
		c.height = h;
	}
	var ctx = c.getContext("2d");
	return {
		canvas: c,
		ctx: ctx
	}
}

function genRan(min, max) {
	return Math.random() * (max - min) + min;	
}

var o, oscs = [];

var oscillators = 3;
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
	return temp;
}

var bmp = createCanvas(sw,sh);
document.body.appendChild(bmp.canvas);

var h = 0;
var irange = 100;
var iinc = sw / irange;

var frame = 0;

function newLine() {

	bmp.ctx.clearRect(0, 0, sw, sh); 

	var hrange = 100;
	for (var h = 0; h < hrange; h++) {
		for (var i = 0; i < irange; i++) {
			var j = getOsc(i, 0, 2);
			var k = h * 3 + getOsc(i, 1, 2);
			var xpos = getOsc(frame - i + h, 2, 30);
			var ypos = getOsc(frame + i - h, 3, 30);
			bmp.ctx.fillStyle = "#000";
			bmp.ctx.fillRect( xpos + j + (iinc * i), ypos + k, 1, 1); 
			// bmp.ctx.fillRect( 200 + i, 200 + ypos + k, 1, 1); 
		}
	}
	frame += 0.3;
	if (frame < 509) requestAnimationFrame(newLine)
}

newLine();