var isNode = (typeof module !== 'undefined');
var Canvas, fs;
// if (typeof require !== 'undefined') {
if (isNode) {
	Canvas = require('canvas');
}
var con = console;

// tiny encryption algorithm.

var w = 500;

var sum = 1000;
var v0 = 0;
var v1 = 0;

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


var bmp = createCanvas(w,w);
var pixels = bmp.ctx.getImageData(0, 0, w, w);
document.body.appendChild( bmp.canvas );

for ( var i = 0; i < w * w; i++ ) {
	
	sum += 0x9e3779b9;
	v0 += ((v1 << 4) + 0xA341316C) ^ (v1 + sum) ^ ((v1 >> 5) + 0xC8013EA4);
	v1 += ((v0 << 4) + 0xAD90777D) ^ (v0 + sum) ^ ((v0 >> 5) + 0x7E95761E);

	// sum += 0.1;
	// v0 += ((v1 << 4) + 1) ^ (v1 + sum) ^ ((v1 >> 5) + 1);
	// v1 += ((v0 << 4) + 1) ^ (v0 + sum) ^ ((v0 >> 5) + 1);
	
	var index = i * 4,
	r = (Math.abs(v0)%0xff),
	g = 0,
	b = (Math.abs(v1)%0xff);
	
	pixels.data[ index + 0 ] = r;
	pixels.data[ index + 1 ] = g;
	pixels.data[ index + 3 ] = b;
	pixels.data[ index + 4 ] = 255;
	
}

bmp.ctx.putImageData(pixels, 0, 0);

// con.log(pixels);

if(typeof module !== 'undefined') module.exports = {generate:generate};