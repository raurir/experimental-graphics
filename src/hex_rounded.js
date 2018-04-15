define("hex_rounded", function() {
  var camera;
  var renderer;
  var stageWidth = 500;
  var stageHeight = 500;

  function init() {
    var interaction = false;
    var mouse = { x: 0, y: 0 };
    var mouseActual = { x: 0, y: 0 };

    var scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0, 100, 5000);

    var cameraTarget = { x: 0, y: 0, z: 0 };
    camera = new THREE.PerspectiveCamera(
      100,
      stageWidth / stageHeight,
      1,
      20000
    );
    camera.position.x = 0;
    camera.position.z = -5000;

    var lightWhite = new THREE.PointLight(0xffffff, 1, 10000);
    scene.add(lightWhite);
    lightWhite.position.set(0, 0, -5000);

    var group = new THREE.Object3D();
    scene.add(group);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize(stageWidth, stageHeight);
    document.body.appendChild(renderer.domElement);
    // var output = dom.element("div", {
    //   innerHTML: "whst",
    //   style: { background: "white", position: "absolute", top: "430px" }
    // });
    // document.body.appendChild(output);

    var hexs = [];
    var hexsTargetable = [];
    var fireflies = [];

    var radius = 600;
    var perRow = 11;
    var numHexs = perRow * perRow;
    var xGap = radius * 2 * -Math.cos(30 * Math.PI / 180);
    var yGap = radius * 3 * Math.sin(30 * Math.PI / 180);
    var xOffset = perRow / 2 * -xGap;
    var yOffset = perRow / 2 * -yGap;

    var numFireflies = 10;

    function ran(max) {
      return (Math.random() - 0.5) * max;
    }

    function addHex(x, y, z, isEdge) {
      var bevelThickness = radius * 0.1;

      var innerRadius = (radius - bevelThickness) * 0.8;

      var shape = new THREE.Shape();

      var edges = 6;

      function polygon(i, edges) {
        var angle = i / edges * Math.PI * 2,
          nextAngle = (i + 1) / edges * Math.PI * 2,
          nextNextAngle = (i + 2) / edges * Math.PI * 2,
          xp = Math.sin(angle) * innerRadius,
          yp = Math.cos(angle) * innerRadius,
          nxp = Math.sin(nextAngle) * innerRadius,
          nyp = Math.cos(nextAngle) * innerRadius,
          nnxp = Math.sin(nextNextAngle) * innerRadius,
          nnyp = Math.cos(nextNextAngle) * innerRadius;

        var rounded = 0.2;

        var startStraightX = xp + (nxp - xp) * rounded;
        var startStraightY = yp + (nyp - yp) * rounded;
        var endStraightX = nxp - (nxp - xp) * rounded;
        var endStraightY = nyp - (nyp - yp) * rounded;
        var endCurveX = nxp + (nnxp - nxp) * rounded;
        var endCurveY = nyp + (nnyp - nyp) * rounded;

        if (i == 0) {
          shape.moveTo(startStraightX, startStraightY);
        }
        shape.lineTo(endStraightX, endStraightY);
        shape.quadraticCurveTo(nxp, nyp, endCurveX, endCurveY);
      }

      for (var i = 0; i < edges; i++) {
        polygon(i, edges);
      }

      var height = 100 + Math.random() * radius;
      var colour = height > radius * 0.9 ? 0x904000 : 0x505050;

      var extrudeSettings = {
        amount: height,
        bevelEnabled: true,
        bevelSegments: 1,
        steps: 1,
        bevelThickness: bevelThickness
      };
      var g = shape.extrude(extrudeSettings);
      var m = new THREE.MeshPhongMaterial({ color: colour });
      var hex = new THREE.Mesh(g, m);
      group.add(hex);

      hex.move = function() {
        this.undecided += ran(0.5);
        this.kindadecided -= (this.kindadecided - this.undecided) * 0.1;
        this.dir -= (this.dir - this.kindadecided) * 0.1;

        this.position.z += this.dir;
      };
      hex.reset = function() {
        hex.undecided = ran(0.5);
        hex.kindadecided = ran(0.5);
        hex.dir = hex.kindadecided;
        hex.position.set(x, y, z - height);
      };

      hex.reset();

      return hex;
    }

    for (var i = 0; i < numHexs; i++) {
      var row = Math.floor(i / perRow);
      var col = i % perRow + (row % 2 == 0 ? 0.5 : 0);

      var isEdge =
        col < 2 || col > perRow - 2.5 || row < 2 || row > perRow - 2.5;

      var x = xOffset + col * xGap;
      var y = yOffset + row * yGap;
      var hex = addHex(x, y, 0, isEdge);
      hexs.push(hex);
      if (!isEdge) {
        // don't pick any near the edges
        hexsTargetable.push(hex);
      }
    }

    function addFirefly() {
      var fly = new THREE.Object3D();
      group.add(fly);

      var below = Math.random() > 0.7;

      function light() {
        return 0xa0 + ran(0x60);
      }

      var colour = (light() << 16) | (light() << 8) | light();
      // if (below) colour = 0xff0000;

      var f = 200;
      var geometry = new THREE.BoxGeometry(f, f, f);
      var material = new THREE.MeshPhongMaterial({
        color: colour,
        shininess: 1,
        shading: THREE.SmoothShading
      });

      // var cube = new THREE.Mesh(geometry, material);
      // fly.add(cube);

      var light = new THREE.PointLight(colour, 5, 2000);
      fly.add(light);

      fly.position.set(ran(1000), ran(1000), below ? 200 : -2000 + ran(1000));

      fly.v = 20 + ran(10);
      fly.vx = ran(10);
      fly.vy = ran(10);
      fly.vz = ran(10);

      fly.undecided = ran(Math.PI);
      fly.kindadecided = ran(Math.PI);
      fly.dir = fly.kindadecided;

      fly.move = function() {
        this.undecided += ran(0.5);
        this.kindadecided -= (this.kindadecided - this.undecided) * 0.1;
        this.dir -= (this.dir - this.kindadecided) * 0.1;
        this.ax = Math.sin(this.dir) * this.v;
        this.ay = Math.cos(this.dir) * this.v;

        this.position.x += this.ax;
        this.position.y += this.ay;

        var limit = 4000;

        if (this.position.x < -limit) this.position.x = limit;
        if (this.position.x > limit) this.position.x = -limit;
        if (this.position.y < -limit) this.position.y = limit;
        if (this.position.y > limit) this.position.y = -limit;
      };

      return fly;
    }

    for (var i = 0; i < numFireflies; i++) {
      fireflies[i] = addFirefly();
    }

    function pickOne() {
      return hexsTargetable[~~(Math.random() * hexsTargetable.length)];
    }

    var target = pickOne();

    var loop = 0;
    function render(t) {
      requestAnimationFrame(render);

      if (loop < Math.floor(t / 4000)) {
        loop++;
        target = pickOne();
        group.position.z = 2000;
        for (var i = 0; i < numHexs; i++) {
          hexs[i].reset(t, i);
        }
      }

      for (var i = 0; i < numFireflies; i++) {
        fireflies[i].move(t, i);
      }
      for (var i = 0; i < numHexs; i++) {
        hexs[i].move(t, i);
      }

      camera.position.x -= (camera.position.x - target.position.x) * 0.02;
      camera.position.y -= (camera.position.y - target.position.y) * 0.02;

      cameraTarget.x -= (cameraTarget.x - mouse.x * 5) * 0.2;
      cameraTarget.y -= (cameraTarget.y - mouse.y * 5) * 0.2;

      camera.lookAt(
        new THREE.Vector3(
          camera.position.x - cameraTarget.x,
          camera.position.y - cameraTarget.y,
          0
        )
      );

      group.position.z -= 35;

      target.position.z += 40;

      renderer.render(scene, camera);
    }

    dom.on(window, ["mousemove", "touchmove"], function(e) {
      if (interaction) {
        var event = (e.changedTouches && e.changedTouches[0]) || e;
        event.x = event.x || event.pageX;
        event.y = event.y || event.pageY;
        mouse.x = event.x - stageWidth / 2;
        mouse.y = event.y - stageHeight / 2;
        // output.innerHTML = mouse.x + " " + mouse.y;
      }
    });
    dom.on(window, ["mousedown", "touchstart"], function(e) {
      interaction = true;
    });
    dom.on(window, ["mouseup", "touchend"], function(e) {
      interaction = false;
    });

    render(0);
  }
  return {
    init: init,
    resize: function(w, h) {
      // renderer.domElement.style.width = w;
      // renderer.domElement.style.height = h;
      stageWidth = w;
      stageHeight = h;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  };
});
