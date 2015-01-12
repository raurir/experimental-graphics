var isNode = (typeof module !== 'undefined');
var Canvas, fs;
// if (typeof require !== 'undefined') {
if (isNode) {
	Canvas = require('canvas');
	fs = require('fs');
}
var con = console;

var dot = 1, sizeX = sizeY = isNode ? 4000 : 400;

var total = 10, current = 8;



// number method?
function frand(x) {
	return Math.random() * x;;
}


var settings = {};
settings.overallScale = 50 + frand(150);
settings.pointMethod = ~~(Math.random() * 4);
settings.pointBias = frand(2);
settings.lineScale = settings.overallScale;
settings.lineSize = 1 + frand(100);
settings.lineGap = 1 + frand(100);
settings.baseRotation = Math.PI * 2;
settings.varyRotation = Math.PI * (Math.random() > 0.5 ? 2 : 0.2);
settings.varyPerRegion = false;////Math.random() > 0.5;
settings.varyPerLine = false;//Math.random() > 0.5;
settings.varyDuotone = false;//Math.random() > 0.5;

if (settings.varyDuotone) {
	colours.setRandomPalette(0); // this sets black and white (or greys really.)
}

// colours.setRandomPalette(41); // this sets black and white (or greys really.)

function positionPoint(index, total) {

	var dim = Math.floor(Math.sqrt(total));
	var x = index % dim + 0.5;
	var y = Math.floor(index / dim) + 0.5;

	// con.log("positionPoint", dim, total);

	var blockX = width / dim / dot;
	var blockY = height / dim / dot;

	var centreX = width / 2 / dot;
	var centreY = height / 2 / dot;

	var radius = index / total * centreX;
	var angle = index/total * Math.PI * index * (0.5 + frand(20));

	var methods = [
		[frand(sizeX), frand(sizeY)], // original random
		[centreX + Math.sin(angle) * width / 3, centreY + Math.cos(angle) * height / 3], // polar
		[centreX + Math.sin(angle) * radius, centreY + Math.cos(angle) * radius], // cluster near centre

		// 3 grid
		[
			(x - settings.pointBias / 2 + frand(settings.pointBias)) * blockX, 
			(y - settings.pointBias / 2 + frand(settings.pointBias)) * blockY
		]
	];
	return methods[settings.pointMethod];
}

function renderRegion(region, bounds) {

	// con.log('renderRegion', bounds);

	var pattern = createPattern((bounds.width > bounds.height ? bounds.width : bounds.height) + 10);

	var regionCanvas = createCanvas(width, height);

	regionCanvas.ctx.globalCompositeOperation = "source-over";
	regionCanvas.ctx.fillStyle = "red";

	for (var r = 0; r < region.length; r++) {
		var x = region[r][0];
		var y = region[r][1];
		regionCanvas.ctx.fillRect(x * dot, y * dot, dot, dot);
	}
	regionCanvas.ctx.globalCompositeOperation = "source-in";
	regionCanvas.ctx.drawImage(pattern,bounds.x - 5,bounds.y - 5);

	ctx.drawImage(regionCanvas.canvas,0,0);

	// ctx.drawImage(pattern,0,0);

}


function createPattern(size) {

	// con.log('createCanvas, size', size);
	var half = size / 2;
	var canvas = createCanvas(size, size);
	// document.body.appendChild(canvas.canvas);
	// canvas.canvas.style.border = '2px solid black'
	var ctx = canvas.ctx;
	// puts the canvas centre so the whole area has a pattern
	// ctx.save();
	ctx.translate(half, half);
	ctx.rotate(settings.baseRotation + frand(settings.varyRotation));
	ctx.translate(-half, -half);

	if (settings.varyDuotone) {
		colours.setColourIndex(1);
		ctx.fillStyle = colours.getCurrentColour();
	} else {
		ctx.fillStyle = colours.getRandomColour();
	}

	var padding = Math.sqrt( half * half * 2) - half; // the gaps between the corner when rotated 45 degrees

	// draw bg. not good for shirts!!!
	//ctx.fillRect(-padding, -padding, size + padding * 2, size + padding * 2);

	if (settings.varyPerRegion) {
		settings.lineScale = 0.5 + frand(settings.overallScale);
		settings.lineSize = 1 + frand(10) * settings.lineScale;
		settings.lineGap = 2 + frand(3) * settings.lineScale;
	}

	var colour;
	if (settings.varyDuotone) {
		colour = colours.getNextColour();
	}
	var y = -padding;
	while(y < size + padding) {
		if (settings.varyPerLine) {		
			settings.lineSize = 1 + frand(10) * settings.lineScale;
			settings.lineGap = 2 + frand(3) * settings.lineScale;
		}
		if (!settings.varyDuotone) {
			colour = colours.getRandomColour();
		}
		ctx.fillStyle = colour;
		ctx.fillRect(-padding, y, size + padding * 2, settings.lineSize);
		y += settings.lineSize + settings.lineGap;
	}

	// ctx.restore();

	return canvas.canvas;
}


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



var v = voronoi.init({
	dot: dot,
	sizeX: sizeX,
	sizeY: sizeY
});

var width = v.width;
var height = v.height;
var canvas = createCanvas(width, height);
if (!isNode) document.body.appendChild(canvas.canvas);
var ctx = canvas.ctx;

var q0 = createCanvas(width / 2, height / 2),
	q1 = createCanvas(width / 2, height / 2),
	q2 = createCanvas(width / 2, height / 2),
	q3 = createCanvas(width / 2, height / 2);

function drawQuarter(source,target,q) {
	// con.log("drawQuarter", q);
	var x = (q % 2) * -width / 2;
	var y = Math.floor(q / 2) * -height / 2;
	con.log("drawQuarter", q,x,y);
	target.canvas.width = target.canvas.width;

	target.ctx.drawImage(source.canvas, x, y);

	var out = fs.createWriteStream(__dirname + '/../export/shirt' + current + '_' + q + '.png');
	var stream = target.canvas.pngStream();
	stream.on('data', function(chunk){
	  out.write(chunk);
	});

	stream.on('end', function(){
	  console.log('saved png');
	});

}



function saveFile(canvas) {
	if (isNode) {
		canvas.toBuffer(function(err, buf){
			if (err) {
				con.log(err);
			} else {
				fs.writeFile(__dirname + '/../export/shirt' + current + '.png', buf, function(){
					con.log("writeFile", 'shirt' + current + '.png' );

					// next();

				});
			}
		});
	} else {
		con.warn("browser export not written");
	}
}



// colours.showColours();
function generate(num) {

	current = num;

	// con.log("generate", settings, this);

	settings.sites = 16 + frand(20);
	// settings.sites = 1 + frand(80);
	// settings.varyRotation = Math.PI * (Math.random() > 0.5 ? 2 : 0.2);
	// settings.varyPerRegion = Math.random() > 0.5;
	// settings.varyPerLine = Math.random() > 0.5;
	settings.varyDuotone = Math.random() > 0.5;

	var txt = [
		"sites", 
		"overallScale", 
		"pointMethod", 
		"pointBias", 
		"baseRotation", 
		"varyRotation", 
		"varyDuotone", 
		"varyPerRegion", 
		"varyPerLine", 
		"lineScale", 
		"lineSize", 
		"lineGap"
	].map(function(v){ return v + ":" + settings[v]; }).join("\n");

	if (isNode) fs.writeFile(__dirname + '/../export/_shirt' + current + '.txt', txt);

	con.log(txt);
	con.log("===================");

	canvas.canvas.width = canvas.canvas.width;

	voronoi.init({
		dot: dot,
		sites: settings.sites,
		sizeX: sizeX,
		sizeY: sizeY
	});

	colours.setRandomPalette();

	con.log("generate", current, total);

	voronoi.genPoints(positionPoint);
	voronoi.genMap();
	voronoi.drawRegions(renderRegion);
	// voronoi.drawRegionBounds();
	// voronoi.drawSites(canvas.ctx);


	// drawQuarter(canvas,q0,0);
	// drawQuarter(canvas,q1,1);
	// drawQuarter(canvas,q2,2);
	// drawQuarter(canvas,q3,3);

	saveFile(canvas.canvas);

}

function next() {

	current++;
	if (current < total) {
		var delay = 5000;
		if (current % 5 == 0) delay = 50000;
		con.log("delaying", delay/1000, "seconds" );
		setTimeout(generate, delay);
	}
}

if (!isNode) generate(0);

if(typeof module !== 'undefined') module.exports = {generate:generate};


// var stream = canvas.jpegStream({
//     bufsize: 4096 // output buffer size in bytes, default: 4096
//   , quality: 75 // JPEG quality (0-100) default: 75
//   , progressive: false // true for progressive compression, default: false
// });
