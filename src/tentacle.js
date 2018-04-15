define("tentacle", function() {

  var TAU = Math.PI * 2;
  var bmp = dom.canvas(1, 1);
  var ctx = bmp.ctx;

  var size, sw, sh, cx, cy;
  var numLines = 7;
  var lines = [];
  var lineLength = 30;

  function init(options) {
    size = 400;//options.size;
    sw = size;
    sh = size;
    cx = sw / 2;
    cy = sh / 2;
    bmp.setSize(sw, sh);

    for (var j = 0; j < numLines; j++) {
      var line = [];
      for (var i = 0; i < lineLength; i++) {
        line.push(createJoint(j, i));
      }
      lines.push(line);
    }
    render(0);
  }

  function createJoint(j, i) {
    var pos = 0;
    var x = 0;
    var y = i * 20;
    var rot = 0;
    var rad = 2 + 0.3 * (lineLength - i);
    // con.log(rad);
    return {
      pos: pos,
      rot: rot,
      x: x,
      y: y,
      move: function(px, py) {
        pos += 0.01;
        // feed oscillation in here.
        rot = j / numLines * TAU + Math.sin(pos) * 0.24 * (i + 1);
        x = px + Math.sin(rot) * 10;
        y = py + Math.cos(rot) * 10;

        ctx.fillStyle = "rgba(200, 160, 130, 0.3)";
        ctx.beginPath();
        ctx.drawCircle(cx + x, cy + y, rad) ;
        ctx.fill();

        /*
        ctx.beginPath();
        ctx.strokeStyle = "#b5e";
        ctx.moveTo(cx + px, cy + py);
        ctx.lineTo(cx + x, cy + y);
        ctx.stroke();
        */

        return {x: x, y: y};
      }
    }
  }

  function render(time) {
    if (time < 1e4) requestAnimationFrame(render);
    ctx.fillStyle = "black";
    ctx.rect(0, 0, sw, sh);
    ctx.fill();
    for (var j = 0; j < numLines; j++) {
      var p = {x: 0, y: 0};
      for (var i = 0; i < lineLength; i++) {
        var joint = lines[j][i];
        p = joint.move(p.x, p.y);
      }
    }
  }

  var experiment = {
    stage: bmp.canvas,
    init: init
  }

  return experiment;

});