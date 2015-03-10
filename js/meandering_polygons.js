(function() {
var sw = 1000, sh = 1000;
var bgColour = colours.getNextColour();
var dots = 24;
var arrDots = [];

var bmp = dom.canvas(sw, sh);
// bmp.canvas.setSize(sw, sh);
var ctx = bmp.ctx;

var range = 0.2;

function white() {
  var b = ~~(230 + Math.random() * 25),
    a = Math.round((0.7 + Math.random() * 0.3) * 100) / 100,
    w = "rgba("+b+","+b+","+b+","+a+")";
    // con.log(w);
  return w;
}

function init() {
  var j = 0
  while(j < dots) {
    arrDots[j] = {
      x: Math.random(),
      y: Math.random(),
      fx: 0,
      fy: 0,
      vx: Math.random() * 0.001,
      vy: Math.random() * 0.001,
      dir: Math.random() * Math.PI * 2,
      dirFloat: 0,
      rotation: 0,
      rotationFloat: 0,
      type: ~~(Math.random() * 2),
      bmp: null,
      size: 0,
      generate: function() {
        this.size = 6 + ~~(Math.random() * 20);
        var bmp = dom.canvas(this.size, this.size);
        // document.body.appendChild(bmp.canvas);
        var ctx = bmp.ctx;
        // ctx.fillStyle = "#f00";
        // ctx.fillRect(0, 0, this.size, this.size);

        switch(this.type) {
          case 0 : // double circle

            var lineWidth = Math.random() * 2;
            var radius = this.size / 2 - lineWidth;

            ctx.beginPath();
            ctx.lineWidth = lineWidth;
            ctx.strokeStyle = white()
            ctx.drawCircle(this.size / 2, this.size / 2, radius);
            ctx.stroke();

            radius *= Math.random();

            ctx.beginPath();
            ctx.fillStyle =  white();
            ctx.drawCircle(this.size / 2, this.size / 2, radius);
            ctx.fill();

            break;
          case 1 : // ngon
            var sides = 3 + ~~(Math.random() * 7);
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = white();
            ctx.drawCircle(this.size / 2, this.size / 2, radius - 1);
            for(var i = 0; i < sides; i++) {
              var angle = i / sides * Math.PI * 2 ;
              var xp = this.size / 2 + this.size / 2 * 0.8 * Math.cos(angle),
                yp = this.size / 2 + this.size / 2 * 0.8 * Math.sin(angle);
              if (i == 0){
                ctx.moveTo(xp, yp);
              } else {
                ctx.lineTo(xp, yp);
              }
            }
            ctx.closePath();
            ctx.stroke();

            break;
          case 2 :
            break;
        }
        this.bmp = bmp;
      },
      draw: function() {
        if (this.bmp == null) {
          this.generate();
        }
        ctx.save();
        ctx.translate(this.x * sw, this.y * sh);
        ctx.rotate(this.rotation);
        ctx.drawImage(this.bmp.canvas, -this.size / 2, - this.size / 2);
        ctx.restore();
      },

      attraction: -0.00001,
      speed: 0.0001,
      friction: 0.9,


      move: function() {

        this.rotationFloat += (Math.random() > 0.5 ? -1 : 1) * 0.5;
        this.rotation -= (this.rotation - this.rotationFloat) * 0.01;

        this.dirFloat += (Math.random() > 0.5 ? -1 : 1) * 0.1;
        this.dir -= (this.dir - this.dirFloat) * 0.01;

        this.vx += Math.sin(this.dir) * this.speed + this.fx;
        this.vy += Math.cos(this.dir) * this.speed + this.fy;
        this.vx *= this.friction;
        this.vy *= this.friction;

        this.x += this.vx;
        this.y += this.vy;

        if (this.x < -0.2) this.x = 1.2;
        if (this.x > 1.2) this.x = -0.2;
        if (this.y < -0.2) this.y = 1.2;
        if (this.y > 1.2) this.y = -0.2;
      },
      force: function(opposite, distance, deltaX, deltaY) {
        // return;
        this.fx = deltaX / distance * this.attraction; // * (range - distance);
        this.fy = deltaY / distance * this.attraction; // * (range - distance);
      }

    }
    j++;
  }
  render();
  var isDown = false, mouseTarget = null;
  addEventListener("mousedown", function(e) {
    isDown = true;
    // mouseTarget = e;
    var mx = e.x / sw, my = e.y / sh;

    for (var k = 0;k < dots; k++) {
      var dot = arrDots[ k ];

      var dx = dot.x - mx,
        dy = dot.y - my,
        d = Math.sqrt(dx * dx + dy * dy);

        if ( d < 0.1) {
          // ctx.beginPath();
          // ctx.lineWidth = 35;
          // ctx.strokeStyle = "#f0f";// dot.colour;
          // ctx.lineCap = 'round';
          // ctx.moveTo(mx * sw, my * sh);

          // ctx.lineTo(dot.x * sw, dot.y * sh);
          // ctx.stroke();
          ctx.beginPath();
          ctx.fillStyle = "red"
          ctx.drawCircle(dot.x * sw, dot.y * sh, 20);
          ctx.fill();
          mouseTarget = k;
          break;
        }
    }
  });

  addEventListener("mouseup", function(e) {
    isDown = false;
    mouseTarget = null
  });

  addEventListener("mousemove", function(e) {
    if (isDown && mouseTarget != null) {
      var mx = e.x / sw, my = e.y / sh;
      arrDots[ mouseTarget ].x = mx;
      arrDots[ mouseTarget ].y = my;
    }
  });

}

var lines = [];
function uniqueId(j, k) {
  return ((j*(j-1))/2) + k;
}

for (var j = 0; j < dots; j++) {
  for (var k = 0;k < j; k++) {
    lines[uniqueId(j,k)] = {
      points: [j,k],
      lineWidth: 0,
      colour: white(),
      dashes: ~~(Math.random() * 5)
    };
  }
}


function render() {
  ctx.fillStyle = "rgba(180,180,200,1)";
  ctx.fillRect(0, 0, sw, sh);

  for (var j = 0; j < dots; j++) {

    var dot = arrDots[ j ];
    dot.move();
    dot.draw();

    for (var k = 0;k < j; k++) {
      // con.log(j,k)

      var lineId = uniqueId(j,k);

      var other = arrDots[ k ];

      var dx = dot.x - other.x,
        dy = dot.y - other.y,
        d = Math.sqrt(dx * dx + dy * dy);

      var inRange = d < range;
      // ignore off screen
      if (other.x < 0 || other.x > 1 || other.y < 0 || other.y > 1) inRange = false;

      if (inRange) {

        dot.force(other, d, dx, dy);
        other.force(dot, d, dx, dy);

        lines[ lineId ].lineWidth -= (lines[ lineId ].lineWidth - 3) * 0.01;

      } else {

        lines[ lineId ].lineWidth *= 0.9;
        if (lines[ lineId ].lineWidth < 0.1) {
          lines[ lineId ].lineWidth = 0;
        }
      }

    }
  }


  for (var m = 0, ml = lines.length; m < ml; m++) {
    var lineM = lines[m];
      pointsM = lineM.points,
      a = arrDots[ pointsM[0] ],
      b = arrDots[ pointsM[1] ];

    if (lineM.lineWidth) {

      for (var k = 0; k < m; k++) {
        var lineK = lines[k];
        if (lineK.lineWidth) {
          var pointsK = lineK.points,
            c = arrDots[ pointsK[0] ],
            d = arrDots[ pointsK[1] ];
          var intersects = geom.intersectionBetweenPoints(a, b, c, d);
          if (intersects) {
            debugCircle(intersects, lineM.colour);
          }
        }

      }
      drawLine(a, b, lineM);

    }

  }


  requestAnimationFrame(render);
}



function drawLine(a, b, line) {
  if (line.lineWidth > 0) {
  // con.log(lineWidth);
    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = line.lineWidth;
    ctx.strokeStyle = line.colour;
    if (line.dashes > 2) ctx.setLineDash([line.dashes]);
    ctx.lineCap = 'round';
    ctx.moveTo(a.x * sw, a.y * sh);
    ctx.lineTo(b.x * sw, b.y * sh);
    ctx.stroke();
    ctx.restore();
  }
}


function debugCircle(dot, colour) {
  var radius = sw * range / 2;
  // ctx.beginPath();
  // ctx.fillStyle = "rgba(255,0,0,0.3)"; // dot.colour;
  // ctx.drawCircle(dot.x * sw, dot.y * sh, radius);
  // ctx.fill();
  var radius = 3;
  ctx.beginPath();
  ctx.fillStyle = colour;
  ctx.drawCircle(dot.x * sw, dot.y * sh, radius);
  ctx.fill();
}







var resizeMode = "contain";

var meandering = {
  stage: bmp.canvas,
  resize: function(w,h) {
    sw = w;
    sh = h;
    bmp.canvas.width = sw;
    bmp.canvas.height = sh;
  },
  init: init,
  kill: function() {}
}

dispatchEvent(new CustomEvent("load:complete", {detail:meandering}));

})();