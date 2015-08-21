var box = function() {

var sw = 800, sh = 800;


var bmp = dom.canvas(sw, sh);
var container = dom.element("div");
var output = dom.element("div", {style:{color:"white"}});


function tilt(y, x) {
  output.innerHTML = ['tilt', Math.round(x * 100), Math.round(y * 100)];
  bmp.ctx.fillStyle = "rgba(0,0,0,0.4)";
  bmp.ctx.fillRect(0, 0, sw, sh);
  bmp.ctx.fillStyle = "red";
  bmp.ctx.fillRect(sh / 2 + x * 10, sh / 2 + y * 10, 10, 10);
};









function init() {
  con.log('init')
  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", function () {
      tilt(event.beta, event.gamma);
    }, true);
  } else if (window.DeviceMotionEvent) {
    window.addEventListener('devicemotion', function () {
      tilt(event.acceleration.x * 2, event.acceleration.y * 2);
    }, true);
  } else {
    window.addEventListener("MozOrientation", function () {
      tilt(orientation.x * 50, orientation.y * 50);
    }, true);
  }

  document.body.appendChild(container);
  container.appendChild(bmp.canvas);
  container.appendChild(output);


}






return {
  init: init,
  stage: container,
  resize: function() {}
}

}

con.log("box", box)

define("box", box);