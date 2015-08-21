var box = function() {

var sw = 200, sh = 200;


var bmp = dom.canvas(sw, sh);
var container = dom.element("div");


function tilt(x,y) {
  con.log('tilt', x, y)
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


}






return {
  init: init,
  stage: container,
}

}

con.log("box", box)

define("box", box);