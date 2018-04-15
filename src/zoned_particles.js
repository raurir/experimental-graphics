var con = console;

var sw = window.innerWidth, sh = window.innerHeight;
// sw = sh = 100;
var canvas = dom.canvas(sw,sh);
var hit = dom.canvas(sw,sh);
var hitpixels;


var ctx = canvas.ctx;
var circleRads = Math.PI * 2;

var numInitial = 30;
var numCurrent = numInitial;
var numMax = numInitial * 3;
var particles = [];
var zones = [];


colours.getRandomPalette();


function moveParticle(p) {

  if (p.dying) { // particles are ageless until they are dying...
    p.age++;
  }

  p.dirFloat += (Math.random() - 0.5) * Math.PI * 0.5;

  p.dir -= (p.dir - p.dirFloat) * 0.01;

  p.vx = Math.cos(p.dir) * p.speed;
  p.vy = Math.sin(p.dir) * p.speed;

  p.x += p.vx;
  p.y += p.vy;

  // con.log('index', x, y, index, isRed);

  var padding = 100;
  if (p.x > sw + padding) { p.x -= sw + padding * 2; p.px = p.x; }
  if (p.x < -padding) { p.x += sw + padding * 2; p.px = p.x; }
  if (p.y > sh + padding) { p.y -= sh + padding * 2; p.py = p.y; }
  if (p.y < -padding) { p.y += sh + padding * 2; p.py = p.y; }

  // p.angle = Math.atan(p.vy / p.vx);
  // var a = -p.angle;
  // if (p.vx <= 0) a += Math.PI;


  var r = 2;
  if (p.dying) r /= (1 + p.age * 0.01);

  var x = p.x;
  var y = p.y;
  var x1 = Math.floor(p.x);
  var y1 = Math.floor(p.y);
  var index = (x1 + y1 * sw) * 4;
  var isRed = hitpixels.data[index];

  if (!isRed) {
    // ctx.fillStyle = p.palette;
    ctx.lineWidth = r;
    ctx.strokeStyle = p.palette;
    ctx.beginPath();
    // ctx.arc(x, y, r, 0, circleRads, false);
    ctx.moveTo(p.px, p.py);
    ctx.lineTo(x, y);
    // ctx.closePath();
    // ctx.fill();
    ctx.stroke();
  }

  if (isRed) {
    // p.speed *= -1;//0.9;
    p.dir = Math.random() * Math.PI * 2;
  }

  p.px = p.x;
  p.py = p.y;


  if (p.dying && p.age > 500) {
    killParticle(p);
  } else if (p.children == 0 && numCurrent < numMax && Math.random() > 0.99) {
    spawnParticle(p);
  }
}

function killParticle(p) {
  var index = particles.indexOf(p);
  particles.splice(index, 1);
  numCurrent--;
}


function generateParticle(parent) {
  if (parent) {
    return {
      age: 0,
      children: 0,
      dir: parent.dir,
      dirFloat: parent.dirFloat,
      dying: false,
      palette: colours.mutateColour(parent.palette, 10),
      speed: parent.speed,
      vx: parent.vx,
      vy: parent.vy,
      x: parent.x,
      y: parent.y,
      px: parent.x,
      py: parent.y,
    }
  } else {
    var x = Math.random() * sw,
      y = Math.random() * sh;
    return {
      age: 0,
      children: 0,
      dir: Math.random() * Math.PI * 2,
      dirFloat: 0,
      dying: false,
      palette: colours.getNextColour(),
      speed: Math.random() * 2.5 + 2.5,
      vx: 0,
      vy: 0,
      x: x,
      y: y,
      px: x, 
      py: y,
    }
  }
}

function spawnParticle(parent) {
  parent.dying = true;
  parent.children++;
  particles[numCurrent] = generateParticle(parent);
  numCurrent++;
}


function generate() {
  zones.push({
    x: 50,
    y: 50,
    w: 100,
    h: 100
  });
  zones.push({
    x: 100,
    y: 250,
    w: 20,
    h: 100
  });
  zones.push({
    x: 300,
    y: 50,
    w: 100,
    h: 300
  });


  for (var j = 0; j < zones.length; j++) {
    var z = zones[j];
    hit.ctx.fillStyle = "rgba(50,0,0,1)";
    hit.ctx.fillRect(z.x, z.y, z.w, z.h);
  };

  hitpixels = hit.ctx.getImageData(0, 0, sw, sh);

  for (var i = 0; i < numInitial; i++) {
    particles[i] = generateParticle();
  };

}

function render(time) {
  // ctx.clearRect(0,0,sw,sh);
  ctx.fillStyle = "rgba(0,0,0,0.04)";
  ctx.fillRect(0,0,sw,sh);

  ctx.drawImage(hit.canvas, 0, 0);

  for (var i = 0; i < numCurrent; i++) {
    moveParticle(particles[i]);
  };

  requestAnimationFrame(render);
}

window.addEventListener("resize", function() {
  return con.warn("resize disabled!");
  sw = window.innerWidth;
  sh = window.innerHeight;
  canvas.setSize(sw, sh);
});

generate();

document.body.appendChild(canvas.canvas);

render(0);
