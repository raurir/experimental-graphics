var sw = 600;
var sh = sw;
var bmp = dom.canvas(sw,sh);
var ctx = bmp.ctx;

var circleRads = Math.PI*2;
var cx = sw * 0.5;
var cy = sh * 0.5;


var seed = 1e3;//~~(Math.random() * 1e10)
function getRandom() {
   var x = Math.sin(seed++) * 10000;
   return x - Math.floor(x);
}

var i,j;

var planets = 1000;
var arrPlanets = [];
var arrRings = [[]];
var ringIndex = 0;

var diameter = 5;
var ringSize = 5;
var rotation = 0;
var attempts = 0;

var settings = {
  increaseMutation: getRandom() > 0.5,
  drawNodes: getRandom() > 0.5,
  straight: getRandom() > 0.5,
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
  colour: colours.getRandomColour(),
  mutationRate: 10 //getRandom()
});

var bgColour = colours.getNextColour();





function newPlanet( index ) {

  var planet = {
    x: cx + Math.sin(rotation) * diameter + (getRandom() - 0.5) * 20,
    y: cy + Math.cos(rotation) * diameter + (getRandom() - 0.5) * 20,
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


    if (getRandom() > 1.9) {
      planet.colour = colours.getRandomColour();
    } else {
      // planet.colour = planet.closest.colour;
      if (settings.increaseMutation) {
        planet.mutationRate = planet.closest.mutationRate * 1.04;
      } else {
        planet.mutationRate = planet.closest.mutationRate * 0.9;
      }

      planet.colour = colours.mutateColour(planet.closest.colour, planet.mutationRate);
    }

    createPlanet(index, planet)
  } else {
    if ( attempts < 40 ) {
      rotation += getRandom() * 20 + Math.atan( 1 / diameter);
    } else {
      ringIndex++
      arrRings[ringIndex] = [];
      // con.log('increasing diameter',ringIndex);
      diameter += getRandom() * ringSize + 1;
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



function drawNode(planet, xp, yp) {

  var closest = planet.closest;
  var colour = closest ? closest.colour : planet.colour;
  var size = (sw - planet.distance) / sw;

  if (settings.drawNodes) {
    var radius = size * 10;
    ctx.beginPath();
    ctx.fillStyle = colour;
    ctx.drawCircle(planet.x, planet.y, radius);
    ctx.fill();

  }

  if (closest) {
    ctx.beginPath();
    ctx.lineWidth = Math.pow(1.1, (size * 30));
    ctx.strokeStyle = colour;
    ctx.lineCap = 'round';
    ctx.moveTo(xp, yp);

    if (settings.straight) {
      ctx.lineTo(closest.x, closest.y);
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