define("recursive_circle", function() {

  var TAU = Math.PI * 2;
  var furSize = 20;
  var sw = 600, sh = sw;
  var maxRecursion = 4;

  var stage = dom.canvas(sw, sh);
  var ctx = stage.ctx;

  function init() {
    render(0);
  };

  function render(time) {
    var renders = 0;
    var t = time * 0.0003;
    var proportion = 2 / 3; // proportion is not being calculated correctly.
    var ringItems = 6;

    ctx.globalCompositeOperation = "source-over";
    // ctx.fillStyle = "#000";
    ctx.clearRect(0, 0, sw, sh)

    function calc(recursion, cx, cy, size) {
      var angleBase = Math.sin(t) * TAU / ringItems * recursion;

      renders ++;

      var outerBoundary = size / 2;
      var innerBoundary = outerBoundary * proportion / 2;
      var inscribedRadius = (outerBoundary - innerBoundary) / 2;
      var centreLine = innerBoundary + inscribedRadius;

      for (var i = 0; i < ringItems; i++) {
        var a = angleBase + i / ringItems * TAU;
        var x = cx + Math.sin(a) * centreLine;
        var y = cy + Math.cos(a) * centreLine;
        if (recursion < maxRecursion) {
          // go deeper
          calc(recursion + 1, x, y, outerBoundary * proportion);
        } else {
          // draw

          ctx.fillStyle = "#fff";
          ctx.globalCompositeOperation = "source-over";
          ctx.beginPath();
          ctx.drawCircle(x * sw, y * sw, inscribedRadius * sw);
          ctx.fill();
          ctx.fillStyle = "#000";
          ctx.globalCompositeOperation = "destination-out";
          ctx.beginPath();
          ctx.drawCircle(x * sw, y * sw, inscribedRadius * proportion / 2 * sw);
          ctx.fill();

        }
      }
    }

    calc(1, 0.5, 0.5, 1);
    // con.log("renders", renders);
    requestAnimationFrame(render);
  }

  return {
    resize: function(w, h) {
      // c.setSize(w, h, true);
    },
    init: init,
    stage: stage.canvas
  };

});