(function() {
var sw = 1000, sh = 1000;
var fgColour = colours.getRandomColour();
var bgColour = colours.getNextColour();
var dots = 14;
var arrDots = [];

var bmp = dom.canvas(sw, sh);
// bmp.canvas.setSize(sw, sh);
var ctx = bmp.ctx;

var range = 0.2;

function init() {
  var j = 0
  while(j < dots) {
    arrDots[j] = {
      x: Math.random(),
      y: Math.random(),
      fx: 0,
      fy: 0,
      vx: Math.random(),
      vy: Math.random(),
      dir: Math.random() * Math.PI * 2,
      dirFloat: 0,
      colour: colours.getRandomColour(),
      connected: [],
      move: function() {

        // return;
        this.dirFloat += (Math.random() > 0.5 ? -1 : 1) * 0.1;
        this.dir -= (this.dir - this.dirFloat) * 0.01;
        this.vx = Math.sin(this.dir) * 0.001 + this.fx;
        this.vy = Math.cos(this.dir) * 0.001 + this.fy;
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0) this.x = 1;
        if (this.x > 1) this.x = 0;
        if (this.y < 0) this.y = 1;
        if (this.y > 1) this.y = 0;
      },
      force: function(opposite, distance) {

        return;
        this.fx = (this.x - opposite.x) / distance * 0.1 * (range - distance);
        this.fy = (this.y - opposite.y) / distance * 0.1 * (range - distance);
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
  ctx.fillStyle = "rgba(0,0,0,1.04)"; //bgColour;
  ctx.fillRect(0, 0, sw, sh);

  var lines = [];

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

      if (d < range) {

        dot.force(other, d);
        other.force(dot, d);

        /*
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
        */

        // drawLine(dot, other);
        lines.push([dot,other])
      }

    }
  }

/*
  for (var g = 0; g < groups.length; g++) {
    // con.log(g, groups[g].length)
    ctx.beginPath();

    ctx.lineWidth = 5;
    ctx.strokeStyle = "#f0f";// dot.colour;
    ctx.lineCap = 'round';
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
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }
*/

  for (var m = 0, ml = lines.length; m < ml; m++) {
    var lineM = lines[m];
    for (var k = 0; k < m; k++) {
      var lineK = lines[k];
      var intersects = intersection(lineM[0], lineM[1], lineK[0], lineK[1]);
      if (intersects) {
        drawNode(intersects);
      }
    }
    drawLine(lineM[0], lineM[1]);
  }

  requestAnimationFrame(render);
}



function drawLine(a, b) {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#f00";//dot.colour;
  ctx.lineCap = 'round';
  ctx.moveTo(a.x * sw, a.y * sh);
  ctx.lineTo(b.x * sw, b.y * sh);
  ctx.stroke();
}






function drawNode(dot) {
  var radius = sw * range / 2;
  ctx.beginPath();
  ctx.fillStyle = "rgba(255,0,0,0.3)"; // dot.colour;
  ctx.drawCircle(dot.x * sw, dot.y * sh, radius);
  ctx.fill();
  var radius = 5;
  ctx.beginPath();
  ctx.fillStyle = "#f00" // dot.colour;
  ctx.drawCircle(dot.x * sw, dot.y * sh, radius);
  ctx.fill();
}







function intersection(p0, p1, p2, p3) {

    var p0_x = p0.x, 
    p0_y = p0.y, 
    p1_x = p1.x, 
    p1_y = p1.y, 
    p2_x = p2.x, 
    p2_y = p2.y, 
    p3_x = p3.x, 
    p3_y = p3.y;

    if (p0_x == p2_x && p0_y == p2_y) return null; // if first point is same as third point
    if (p0_x == p3_x && p0_y == p3_y) return null; // if first point is same as fourth point
    if (p1_x == p2_x && p1_y == p2_y) return null; // if second point is same as third point
    if (p1_x == p3_x && p1_y == p3_y) return null; // if second point is same as fourth point


    var s1_x, s1_y, s2_x, s2_y;
    s1_x = p1_x - p0_x;     s1_y = p1_y - p0_y;
    s2_x = p3_x - p2_x;     s2_y = p3_y - p2_y;

    var s, t;
    s = (-s1_y * (p0_x - p2_x) + s1_x * (p0_y - p2_y)) / (-s2_x * s1_y + s1_x * s2_y);
    t = ( s2_x * (p0_y - p2_y) - s2_y * (p0_x - p2_x)) / (-s2_x * s1_y + s1_x * s2_y);

    if (s >= 0 && s <= 1 && t >= 0 && t <= 1) {
        // Collision detected
        return {
          x: p0_x + (t * s1_x),
          y: p0_y + (t * s1_y)
        }
    }

    return null; // No collision
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