var con = console;
var sw = 1600;
var sh = 1600;
var bmp = dom.createCanvas(sw,sh);
document.body.appendChild(bmp.canvas);
var ctx = bmp.ctx;
var circleRads = Math.PI*2;
var cx = sw * 0.5;
var cy = sh * 0.5;

var i,j;

var planets = 2000;
var arrPlanets = [];
var arrRings = [[]];
var ringIndex = 0;

var diameter = 5;
var rotation = 0;
var attempts = 0;

function createPlanet(index, planet) {
	planet.index = index;
	lastPlanet = planet;
	arrPlanets[index] = planet;
	arrRings[ringIndex].push(planet);
}
createPlanet(0, {
	x:cx,
	y:cy,
	distance: 0,
	rotation: 0,
	hue: 0
});





function newPlanet( index ) {

	var planet = {
		x: cx + Math.sin(rotation) * diameter + (Math.random() - 0.5) * 20,
		y: cy + Math.cos(rotation) * diameter + (Math.random() - 0.5) * 20,
		rotation: rotation,
		distance: diameter
	};

	var ok = true;

	//var closest = 0;
	var lastDistance = 1e7;

	i = arrPlanets.length - 1;

	// con.log("arrPlanets.length", arrPlanets.length)

	while( i > -1 && ok ) {
		var other = arrPlanets[i];
		var dx = planet.x - other.x;
		var dy = planet.y - other.y;
		var distance = Math.sqrt(dx*dx+dy*dy);

		// con.log("distance", distance)

		if ( distance < 16 ) {
			ok = false
		} else {
			lastDistance = Math.min(distance,lastDistance);
			if ( lastDistance == distance) {
				planet.closest = arrPlanets[i];
			}
		}
		i--
	}

	if(planet.x == lastPlanet.x && planet.y == lastPlanet.y ) {
		ok = false;
	}

	if ( ok ) {
		attempts = 0;

		planet.hue = planet.closest == undefined ? ~~(Math.random() * 360) : planet.closest.hue + (Math.random() - 0.4) * 10;

		createPlanet(index, planet)
	} else {
		if ( attempts < 40 ) {
			rotation += Math.random() * 20 + Math.atan( 1 / diameter);
		} else {
			ringIndex++
			arrRings[ringIndex] = [];
			con.log('increasing diameter',ringIndex)
			diameter += Math.random() * 5 + 1;
		}
		attempts++;
		newPlanet( index );
	}
}

function drawPlanets() {

	ctx.clearRect(0, 0, sw, sh);

	var j = arrPlanets.length - 1;
	while(j > -1) {

		var planet = arrPlanets[ j ];
		var closest = planet.closest;

		var hue = closest ? closest.hue : planet.hue;
		var colour = 'hsl(' + hue + ', 50%, 50%)'

		var size = (sw - planet.distance) / sw;
		ctx.beginPath();
		ctx.fillStyle = colour;
		ctx.arc(planet.x, planet.y, size * 7, 0, circleRads, false);
		ctx.fill();

		if (closest) {

			ctx.beginPath();
			ctx.lineWidth = Math.pow((size + 0.6), 4);
			ctx.strokeStyle = colour;
			ctx.moveTo(planet.x, planet.y);
			ctx.lineTo(closest.x, closest.y);
			ctx.stroke();
			ctx.closePath();

			// var label = planet.index + ":" + planet.closest.index;
			// ctx.fillStyle = "#000";
			// ctx.fillText(label, planet.x, planet.y);

		}

		// j = 0; // loop killer
		j--;
	}

}





function animPlanets() {

	ctx.clearRect(0, 0, sw, sh);

	var r = arrRings.length - 1;
	while(r > -1) {
		var ring = arrRings[r];
		var j = ring.length - 1;
		while(j > -1) {

			var planet = arrPlanets[ j ];

			var xp = planet.x;
			var yp = planet.y;


			var f = frame / 5;
			var ringDelta = Math.abs(f - r);
			if (ringDelta < 2) {
				var morph = planet.distance + (2 - ringDelta) * 10;
				xp = cx + Math.sin(planet.rotation) * morph;
				yp = cy + Math.cos(planet.rotation) * morph;
				// if (frame < 100 ) con.log(xp, planet.rotation, planet.distance)
				// con.log(xp)
			}

			var closest = planet.closest;

			var hue = closest ? closest.hue : planet.hue;
			var colour = 'hsl(' + hue + ', 50%, 50%)'

			var size = (sw - planet.distance) / sw;
			ctx.beginPath();
			ctx.fillStyle = colour;
			ctx.arc(xp, yp, size * 7, 0, circleRads, false);
			ctx.fill();

			if (closest) {

				ctx.beginPath();
				ctx.lineWidth = Math.pow((size + 0.6), 4);
				ctx.strokeStyle = colour;
				ctx.moveTo(xp, yp);
				ctx.lineTo(closest.x, closest.y);
				ctx.stroke();
				ctx.closePath();

			}

			j--;
		}
		r--;
	}

}













j = 1;
while( j < planets ) {
	newPlanet(j);
	j++;
}
drawPlanets();

/*
j = 1;
function render() {
	newPlanet(j);
	j++;
	drawPlanets();
	if (j < planets) {
		requestAnimationFrame(render);
		// setTimeout(render, 50)
	}
}
render();
*/




/*
var frame = 0;
function render() {
	frame++;
	animPlanets();
	// requestAnimationFrame(render);
}
render();
*/