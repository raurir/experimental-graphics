define("yes_day", [
  "lib/schteppe/cannon.0.6.2.min.js",
  "lib/schteppe/cannon.demo.js",
  "http://schteppe.github.io/cannon.js/libs/TrackballControls.js",
  ], function() {

  var demo = new CANNON.Demo();


  // We link together boxes in a chain
  demo.addScene("links",function(){
      var world = setupWorld(demo);
      world.gravity.set(0, 0, -20);
      var size = 1;
      var chainSize = 0.3;
      var linkLength = size * 2;
      var sphereShape = new CANNON.Sphere(size);
      var chainShape0 = new CANNON.Box(new CANNON.Vec3(size, chainSize, linkLength));
      var chainShape1 = new CANNON.Box(new CANNON.Vec3(chainSize, size, linkLength));
      var mass = 1;
      var space = 0.25;
      var N = 20, last;
      for(var i=0; i<N; i++){
          // Create a box
          var boxbody = new CANNON.Body({ mass: mass });
          boxbody.addShape(i % 2 ? chainShape1 : chainShape0);
          boxbody.position.set(0, 0, (N-i)*(linkLength*2+2*space) + linkLength*2+space);
          // boxbody.quaternion.setFromAxisAngle(new CANNON.Vec3(0,1,0), Math.PI / 2);
          boxbody.linearDamping = 0.1; // Damping makes the movement slow down with time
          boxbody.angularDamping = 0.1;
          boxbody.velocity.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);

          world.addBody(boxbody);
          demo.addVisual(boxbody);
          if(i!=0){
              // Connect the current body to the last one
              // We connect two corner points to each other.
              var cnX = size * 0.1, cnY = linkLength + space;
              var c1 = new CANNON.PointToPointConstraint(boxbody, new CANNON.Vec3(-cnX, 0, cnY), last, new CANNON.Vec3(-cnX, 0, -cnY));
              var c2 = new CANNON.PointToPointConstraint(boxbody, new CANNON.Vec3(cnX, 0, cnY), last, new CANNON.Vec3(cnX, 0, -cnY));
              world.addConstraint(c1);
              world.addConstraint(c2);
          } else {
              // First body is now static. The rest should be dynamic.
              mass=0.3;
          }
          // To keep track of which body was added last
          last = boxbody;
      }
  });


  function setupWorld(demo){
    // Create world
    var world = demo.getWorld();
    world.gravity.set(0,0,-40);
    world.broadphase = new CANNON.NaiveBroadphase();
    world.solver.iterations = 10;
    // ground plane
    var groundShape = new CANNON.Plane();
    var groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.position.set(0,0,1);
    world.addBody(groundBody);
    demo.addVisual(groundBody);
    world.quatNormalizeFast = false;
    world.quatNormalizeSkip = 0;
    return world;
  };




  demo.start();

});