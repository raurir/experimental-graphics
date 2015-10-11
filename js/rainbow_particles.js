var sw = window.innerWidth, sh = window.innerHeight;
var bmp = dom.canvas(sw,sh);
var ctx = bmp.ctx;

var palette = [];
var size = 10;
var dot = 1;

var lines = 5;
var max = 10;
var particles = [];

document.body.appendChild(bmp.canvas);

colours.getRandomPalette();

function newColours() {
  palette = [];
  var attempts = 0;
  // if the current colour scheme from colours.js has less than stripes. simple brute force check with attempts. don't tell anyone!
  while(palette.length < lines) {
    var newColour = colours.getRandomColour();
    if (palette.indexOf(newColour) == -1 || attempts > 100) {
      palette.push(newColour);
    }
    attempts++;
  }
}

function generate() {

  newColours();

  function generateParticle() {
    return {
      x: Math.random() * sw,
      y: Math.random() * sh,
      vx: 1,//Math.random() - 0.5,
      vy: 0,//Math.random() - 0.5,
      speed: 1,
      dir: Math.random() * Math.PI * 2,
      dirFloat: Math.random() * Math.PI * 2,
      move: function() {
        this.x += this.vx;
        this.y += this.vy;
      },
      draw: function() {
        for (var j = 0; j < lines; j++) {
          ctx.fillStyle = palette[j];
          // ctx.fillRect(this.x, this.y, dot, dot);
          ctx.beginPath();
          ctx.drawCircle(this.x - (lines - j) * -2, this.y, dot * (lines - j) * 2 + 1);
          ctx.closePath();
          ctx.fill();
        }
      }
    }
  }

  for (var i = 0; i < max; i++) {
    particles[i] = generateParticle();
  };
}

function render(time) {

  // ctx.clearRect(0,0,sw,sh);

  for (var i = 0; i < max; i++) {
    particles[i].move();
    particles[i].draw();
  };

  requestAnimationFrame(render);
  // return;
  // con.log(palette, widths)

  // var patternColoured = dom.canvas(size * dot, size * dot);
  // patternColoured.ctx.fillStyle = red;
  // patternColoured.ctx.fillRect((x + px) * dot, (y + py) * dot, dot, dot);

  // ctx.save();
  // ctx.rect(0, 0, sw, sh);
  // ctx.rotate(rotation);
  // ctx.fillStyle = ctx.createPattern(patternColoured.canvas,"repeat");
  // ctx.fill();
  // ctx.restore();

}

window.addEventListener("resize", function() {
  bmp.canvas.width = sw = window.innerWidth;
  bmp.canvas.height = sh = window.innerHeight;
});

generate();

render(0);
