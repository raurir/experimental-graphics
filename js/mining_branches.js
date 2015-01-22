var seed = 2383241;//~~(Math.random() * 1e10)
var same = seed;

Math.random = function() {
   var x = (Math.sin(seed++) + 1) * 10000;
   return x % 1;
}
getRandom = Math.random;

var fgColour = colours.getRandomColour();
var bgColour = colours.getNextColour();



function doCan(scale) {

var sw = 400 * scale;
var sh = sw;
var bmp = dom.canvas(sw,sh);
bmp.canvas.setSize(sw/scale, sh/scale);
var ctx = bmp.ctx;

var circleRads = Math.PI*2;
var cx = 0.5;
var cy = 0.5;

var i,j;

var lastPlanet;

var planets = 400;
var arrPlanets = [];
var arrRings = [[]];
var ringIndex = 0;

var diameter = 0.01;
var ringSize = 0.01;
var rotation = 0;
var attempts = 0;

var settings = {
  increaseMutation: getRandom() > 0.5,
  drawNodes: getRandom() > 0.5,
  straight: true //getRandom() > 0.5,
}
if (settings.drawNodes) settings.megaNodes = getRandom() > 0.5;
if (settings.megaNodes) settings.megaSubNodes = getRandom() > 0.5;

con.log(settings);

document.body.appendChild(bmp.canvas);


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
  // hue: ~~(getRandom() * 360),
  colour: fgColour,
  mutationRate: 10 //getRandom()
});






function newPlanet( index ) {

  var planet = {
    x: cx + Math.sin(rotation) * diameter + (getRandom() - 0.5) * 0.05,
    y: cy + Math.cos(rotation) * diameter + (getRandom() - 0.5) * 0.05,
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

    if ( distance < 0.04 ) {
      ok = false
    } else {
      lastDistance = Math.min(distance,lastDistance);
      if ( lastDistance == distance) {
        planet.closest = arrPlanets[i];
        // con.log("distance", scale, i, distance)
      }
    }
    i--
  }

  if(planet.x == lastPlanet.x && planet.y == lastPlanet.y ) {
    ok = false;
  }

  if ( ok ) {
    attempts = 0;

    // planet.colour = planet.closest.colour;
    if (settings.increaseMutation) {
      planet.mutationRate = planet.closest.mutationRate * 1.04;
    } else {
      planet.mutationRate = planet.closest.mutationRate * 0.9;
    }

    planet.colour = colours.mutateColour(planet.closest.colour, planet.mutationRate);

    createPlanet(index, planet)
  } else {
    if ( attempts < 40 ) {
      rotation += getRandom() * 20 + Math.atan( 1 / diameter);
    } else {
      ringIndex++
      arrRings[ringIndex] = [];
      // con.log('increasing diameter',ringIndex);
      diameter += getRandom() * ringSize + 1/400;
    }
    attempts++;
    newPlanet( index );
  }
}






function drawNodes() {
  ctx.fillStyle = bgColour;
  ctx.fillRect(0, 0, sw, sh);
  var j = arrPlanets.length - 1;
  while(j > -1) {
    var planet = arrPlanets[ j ];
    var xp = planet.x;
    var yp = planet.y;
    drawNode(planet, xp, yp);
    j--;
  }
  if (settings.megaNodes) {
    j = arrPlanets.length - 1;
    while(j > -1) {
      var planet = arrPlanets[ j ];
      var xp = planet.x;
      var yp = planet.y;
      drawInnerNode(planet, xp, yp);
      j--;
    }
  }
}


/*
function animPlanets() {

  ctx.fillStyle = bgColour;
  ctx.fillRect(0, 0, sw, sh);

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

      drawNode(planet, xp, yp);

      j--;
    }
    r--;
  }

}
*/


function drawNode(planet, xp, yp) {

  var closest = planet.closest;
  var colour = closest ? closest.colour : planet.colour;
  var size = 1 - planet.distance;

  if (settings.drawNodes) {
    var radius = size * 10;
    ctx.beginPath();
    ctx.fillStyle = colour;
    ctx.drawCircle(planet.x*sw, planet.y*sh, radius);
    ctx.fill();

  }

  if (closest) {
    ctx.beginPath();
    ctx.lineWidth = Math.pow(1.1, (size * 30 / 5)) * scale;
    ctx.strokeStyle = colour;
    ctx.lineCap = 'round';
    ctx.moveTo(xp * sw, yp * sh);

    if (settings.straight) {
      ctx.lineTo(closest.x * sw, closest.y * sw);
    } else {
      if (closest.closest) {

        var phx = closest.x + (closest.closest.x - closest.x) / 2;
        var phy = closest.y + (closest.closest.y - closest.y) / 2;

        var nx = closest.x + (closest.x - phx);
        var ny = closest.y + (closest.y - phy);

        ctx.quadraticCurveTo(nx, ny, closest.x, closest.y);

      } else {

        var hx = closest.x + (xp - closest.x) / 2;
        var hy = closest.y + (yp - closest.y) / 2;

        ctx.quadraticCurveTo(hx, hy, closest.x, closest.y);
      }
    }
    ctx.stroke();

    // ctx.closePath();
    // var label = planet.index + ":" + planet.closest.index;
    // ctx.fillStyle = "#000";
    // ctx.fillText(label, planet.x, planet.y);

  }
}

function drawInnerNode(planet, xp, yp) {
	return;
  var size = (sw - planet.distance) / sw;
  var radius = size * 10;

  if (settings.megaNodes) {
    ctx.beginPath();
    ctx.fillStyle = bgColour;
    ctx.drawCircle(planet.x, planet.y, radius * 0.7 * getRandom());
    ctx.fill();

    if (settings.megaSubNodes && getRandom() > 0.5) {
      ctx.beginPath();
      ctx.fillStyle = planet.colour;
      ctx.drawCircle(planet.x, planet.y, radius * 0.5 * getRandom());
      ctx.fill();
    }
  }
}






//*
j = 1;
while( j < planets ) {
  newPlanet(j);
  j++;
}
drawNodes();

/*

j = 1;
function render() {
  newPlanet(j);
  j++;
  drawNodes();
  if (j < planets) {
    requestAnimationFrame(render);
    // setTimeout(render, 50)
  }
}
render();




var frame = 0;
function render() {
  frame++;
  animPlanets();
  // requestAnimationFrame(render);
}
render();
//*/

}

seed = same;
doCan(1);
seed = same;
doCan(2);
seed = same;
doCan(3);
seed = same;
doCan(7);
