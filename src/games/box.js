define("box", function() {


var keysDown = { up: false, down: false, left: false, right: false};

var sw = 400, sh = 400, block = 40;
var xwide = sw / block;
var yhigh = sh / block;

var cursor = block / 2;

var bmp = dom.canvas(sw, sh);
var container = dom.element("div");
var output = dom.element("div", {style:{color:"white"}});

var position = {x: sw / 2, y: sh / 2};
var lastPosition;

function tilt(y, x) {
  position.x += x;
  position.y += y;
};

function render() {

  var keyMovement = 1;
  if (keysDown.left) position.x -= keyMovement;
  if (keysDown.right) position.x += keyMovement;
  if (keysDown.up) position.y -= keyMovement;
  if (keysDown.down) position.y += keyMovement;
  if (position.x < 0) position.x = 0;
  if (position.x > sw) position.x = sw;
  if (position.y < 0) position.y = 0;
  if (position.y > sh) position.y = sh;

  var positionIndexMin = {
    x: Math.floor((position.x - cursor / 2) / block),
    y: Math.floor((position.y - cursor / 2) / block)
  }
  var positionIndexMax = {
    x: Math.floor((position.x + cursor / 2) / block),
    y: Math.floor((position.y + cursor / 2) / block)
  }

  var positionOk = true;
  var rgb = 20;
  if (field[ positionIndexMin.y ][ positionIndexMin.x ] === "#") {
    positionOk = false;
  }
  if (field[ positionIndexMax.y ][ positionIndexMax.x ] === "#") {
    positionOk = false;
  }

  if (positionOk === false) {
    rgb = 60;
    position.x = lastPosition.x;
    position.y = lastPosition.y;
  }
  lastPosition.x = position.x;
  lastPosition.y = position.y;


  for (var y = 0; y < yhigh; y++) {
    for (var x = 0; x < xwide; x++) {
      if (field[y][x] === "#") {
        bmp.ctx.fillStyle = "rgba(" + rgb + "," + rgb + "," + rgb + ",1)";
        bmp.ctx.fillRect(x * block, y * block, block, block);
      }
    }
  }

  // output.innerHTML = ['tilt', Math.round(x * 100), Math.round(y * 100)];
  bmp.ctx.fillStyle = "rgba(0,0,0,0.4)";
  bmp.ctx.fillRect(0, 0, sw, sh);
  // bmp.ctx.fillStyle = "red";
  // bmp.ctx.fillRect(sh / 2 + position.x, sh / 2 + y, block / 2, block / 2);

  bmp.ctx.fillStyle = "#444";
  bmp.ctx.fillRect(position.x - cursor / 2, position.y - cursor / 2, cursor, cursor);

  requestAnimationFrame(render);
}






var field = null

function init() {
  con.log('init');
  maze.init(function() {
    field = maze.getMaze();

    // con.log('maze', field);

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


    var startPosition = null;
    while(startPosition == null) {
      for (var y = 0; y < yhigh; y++) {
        for (var x = 0; x < xwide; x++) {
          if (field[y][x] !== "#" && Math.random() > 0.99995) {
            startPosition = true;
            position = {
              x: x * block + block / 2,
              y: y * block + block / 2
            };
            lastPosition = {x: position.x, y: position.y};
          }
        }
      }
      con.log("iteration")
    }


    function listen(eventNames, callback) {
      for (var i = 0; i < eventNames.length; i++) {
        window.addEventListener(eventNames[i], callback);
      }
    }
    listen(["keydown", "keyup"], function(e) {
      var pressed = e.type === "keydown";
      switch (e.which) {
        case 37 : case 100 : keysDown.left = pressed; break;
        case 38 : case 104 : keysDown.up = pressed; break;
        case 39 : case 102 : keysDown.right = pressed; break;
        case 40 : case 98 : keysDown.down = pressed; break;
      }
      // con.log(e.which, pressed);
    });

    // tilt();

    document.body.appendChild(container);
    container.appendChild(bmp.canvas);
    container.appendChild(output);

    render();


  }, xwide, yhigh);

};


return {
  init: init,
  stage: container,
  resize: function() {}
}




});