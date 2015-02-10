// (function() {
var sw = 1000, sh = 1000;
var fgColour = colours.getRandomColour();
var bgColour = colours.getNextColour();
var dots = 5;
var arrDots = [];

var bmp = dom.canvas(sw, sh);
// bmp.canvas.setSize(sw, sh);
var ctx = bmp.ctx;

function init() {
  var j = 0
  while(j < dots) {
    arrDots[j] = {
      x: Math.random(),
      y: Math.random(),
      vx: Math.random(),
      vy: Math.random(),
      dir: Math.random() * Math.PI * 2,
      dirFloat: 0,
      colour: colours.getRandomColour(),
      connected: [],
      move: function() {

        return;
        this.dirFloat += (Math.random() > 0.5 ? -1 : 1) * 0.1;
        this.dir -= (this.dir - this.dirFloat) * 0.01;
        this.vx = Math.sin(this.dir) * 0.001;
        this.vy = Math.cos(this.dir) * 0.001;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = 1;
        if (this.x > 1) this.x = 0;
        if (this.y < 0) this.y = 1;
        if (this.y > 1) this.y = 0;
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

var groups = [];

function render() {
  ctx.fillStyle = "rgba(0,0,0,0.04)"; bgColour;
  ctx.fillRect(0, 0, sw, sh);
  for (var j = 0; j < dots; j++) {

    var dot = arrDots[ j ];
    dot.move();
    drawNode(dot);

    for (var k = 0;k < j; k++) {
      // con.log(j,k)
      var other = arrDots[ k ];

      var dx = dot.x - other.x,
        dy = dot.y - other.y,
        d = Math.sqrt(dx * dx + dy * dy);

      if (d < 0.2) {

        var groupIndex = -1, jFound = false, kFound = false;

        var bothFound = false;

        for (var g = 0; g < groups.length; g++) {

          jFound = groups[g].indexOf(j) > -1,
          kFound = groups[g].indexOf(k) > -1;

          if (jFound && kFound) {
            groupIndex = g;
            bothFound = true
            bothIndex = g;
          } else if (jFound) {
            groupIndex = g;
          } else if (kFound) {
            groupIndex = g;
          } else {
            // groups[g].push(j,k);
          }
        };

        if (jFound && kFound) {

        } else if (jFound) {
          con.log("groupIndex jFound", groups[groupIndex])
          if (groups[groupIndex].length >= 3) {
            con.log("creating new group!", groupIndex)
            groupIndex++;
            groups[groupIndex] = [j,k];
          } else {
            groups[groupIndex].push(k);
          }

        } else if (kFound) {
          con.log("groupIndex kFound", groups[groupIndex])

          if (groups[groupIndex].length >= 3) {
            con.log("creating new group!")
            groupIndex++;
            groups[groupIndex] = [j,k];
          } else {
            groups[groupIndex].push(j);
          }

        } else {
          groups[groups.length] = [j,k];
        }


        // if (other.connected.indexOf(j) == -1) {
        //   con.log("adding ")
        //   other.connected.push(j);
        //   dot.connected.push(k);
        // }

        ctx.beginPath();
        ctx.lineWidth = 1;
        ctx.strokeStyle = "#555";// dot.colour;
        ctx.lineCap = 'round';
        ctx.moveTo(dot.x * sw, dot.y * sh);
        ctx.lineTo(other.x * sw, other.y * sh);
        ctx.stroke();
      }

    }
  }

  for (var g = 0; g < groups.length; g++) {
    // con.log(g, groups[g].length)
    ctx.beginPath();
    ctx.fillStyle = "rgba(255,0,0,0.6)";
    for (var c = 0; c < groups[g].length; c++) {
      var dot = arrDots[ groups[g][c] ];
      var xp = dot.x * sw, yp = dot.y * sh;
      if (c == 0){
        ctx.moveTo(xp, yp);
      } else {
        ctx.lineTo(xp, yp);
      }
    }
    ctx.fill();

  }




  requestAnimationFrame(render);
}

function drawNode(dot) {
  var radius = 5;
  ctx.beginPath();
  ctx.fillStyle = dot.colour;
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

// })();