var con = console;

var sw = window.innerWidth, sh = window.innerHeight;
var bmp = document.createElement("canvas");
bmp.width = sw;
bmp.height = sh;
document.body.appendChild(bmp);

var ctx = bmp.getContext("2d");
var circleRads = Math.PI * 2;

var numInitial = 15;
var numCurrent = numInitial;
var numMax = 30;
var particles = [];
var deaths = [];

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

  var padding = 100;
  if (p.x > sw + padding) p.x -= sw + padding * 2;
  if (p.x < -padding) p.x += sw + padding * 2;
  if (p.y > sh + padding) p.y -= sh + padding * 2;
  if (p.y < -padding) p.y += sh + padding * 2;

  p.angle = Math.atan(p.vy / p.vx);

  var a = -p.angle;

  if (p.vx <= 0) a += Math.PI;

  for (var j = 0; j < p.lines; j++) {
    ctx.fillStyle = p.palette[j];

    var r = 3;
    if (p.dying) r /= (1 + p.age * 0.01);
    var d = (j - p.lines / 2 + 0.5) * r * 2;
    var x = p.x + Math.sin(a) * d;
    var y = p.y + Math.cos(a) * d;

    ctx.beginPath();
    ctx.arc(x, y, r, 0, circleRads, false);
    ctx.closePath();
    ctx.fill();
  }

  // ctx.fillStyle = "white";
  // ctx.beginPath();
  // ctx.arc(p.x, p.y, 6, 0, circleRads, false);
  // ctx.closePath();
  // ctx.fill();

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

  deaths.push({
    anim: 0,
    lines: p.lines,
    // palette: p.palette,
    x: p.x,
    y: p.y
  });
}

function animateDeath(death) {
  death.anim++;
  var maxAnim = 50;
  if (death.anim > maxAnim) {
    var index = deaths.indexOf(death);
    deaths.splice(index, 1);
  } else {
    var d = death.anim * 0.4;
    var perc = (maxAnim - death.anim) / maxAnim;
    for (var j = 0; j < death.lines; j++) {
      var a = j / death.lines * Math.PI * 2;
      var x = death.x + Math.sin(a) * d;
      var y = death.y + Math.cos(a) * d;
      var r = perc + 0.01;
      ctx.fillStyle = "rgba(255,255,255," + perc + ")";
      ctx.beginPath();
      ctx.arc(x, y, r, 0, circleRads, false);
      ctx.closePath();
      ctx.fill();
    }
  }
}


function generateParticle(parent) {
  if (parent) {
    return {
      age: 0,
      children: 0,
      dir: parent.dir,
      dirFloat: parent.dirFloat,
      dying: false,
      lines: parent.lines,
      palette: parent.palette,
      speed: parent.speed,
      vx: parent.vx,
      vy: parent.vy,
      x: parent.x,
      y: parent.y,
    }
  } else {
    var lines = 3 + parseInt(Math.random() * 6);
    var palette = [];
    for (var i = 0; i < lines; i++) {
      palette.push("hsl(" + (i / lines * 360) + ",50%,50%)");
    }
    return {
      age: 0,
      children: 0,
      dir: Math.random() * Math.PI * 2,
      dirFloat: 0,
      dying: false,
      lines: lines,
      palette: palette,
      speed: Math.random() * 1.5 + 0.5,
      vx: 0,
      vy: 0,
      x: Math.random() * sw,
      y: Math.random() * sh,
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
  for (var i = 0; i < numInitial; i++) {
    particles[i] = generateParticle();
  };
}

function render(time) {
  // ctx.clearRect(0,0,sw,sh);
  ctx.fillStyle = "rgba(0,0,0,0.04)";
  ctx.fillRect(0,0,sw,sh);

  for (var i = 0; i < deaths.length; i++) {
    animateDeath(deaths[i]);
  }
  for (i = 0; i < numCurrent; i++) {
    moveParticle(particles[i]);
  };

  requestAnimationFrame(render);
}

window.addEventListener("resize", function() {
  bmp.width = sw = window.innerWidth;
  bmp.height = sh = window.innerHeight;
});

generate();

render(0);
