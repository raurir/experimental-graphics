define("yes_day", [
	"lib/schteppe/cannon.0.6.2.min.js",
	"lib/schteppe/cannon.demo.js",
	"http://schteppe.github.io/cannon.js/libs/TrackballControls.js",
	], function() {

	var demo = new CANNON.Demo();

	demo.addScene("ball-and-chain",function(){
			var world = setupWorld(demo);
			world.gravity.set(0, 0, -20);
			var width = 1;
			var wireSize = 0.3;
			var pitch = 1;
			var sphereShape = new CANNON.Sphere(width);
			var chainShape0 = new CANNON.Box(new CANNON.Vec3(width, wireSize, pitch));
			var chainShape1 = new CANNON.Box(new CANNON.Vec3(wireSize, width, pitch));
			var mass = 1;
			var space = 1;
			var N = 2, last;
			for(var i = 0; i < N; i++){
				var first = i == 0;

				var py = (N-i)*(pitch*2+2*space) + pitch*2+space;

				// Create a box
				var chainLinkBody = new CANNON.Body({mass: 0.1});
				chainLinkBody.addShape(i % 2 ? chainShape1 : chainShape0);
				chainLinkBody.position.set(0, 0, py);
				chainLinkBody.linearDamping = 0.1;
				chainLinkBody.angularDamping = 0.1;
				chainLinkBody.velocity.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);

				world.addBody(chainLinkBody);

				var spherebody = new CANNON.Body({mass: 0.1});
        spherebody.addShape(sphereShape);
        spherebody.position.set(0, 0, py);
        // spherebody.velocity.x = i;
        world.add(spherebody);
        demo.addVisual(spherebody);

				demo.addVisual(chainLinkBody);

				var cnX = width * 0.1, cnY = pitch + space;

				if(!first){
					// Connect the current body to the last one
					// We connect two corner points to each other.
					var c1 = new CANNON.PointToPointConstraint(chainLinkBody, new CANNON.Vec3(-cnX, 0, cnY), last, new CANNON.Vec3(-cnX, 0, -cnY));
					var c2 = new CANNON.PointToPointConstraint(chainLinkBody, new CANNON.Vec3(cnX, 0, cnY), last, new CANNON.Vec3(cnX, 0, -cnY));
					// world.addConstraint(c = new CANNON.DistanceConstraint(spherebody,lastBody,dist));

					world.addConstraint(c1);
					world.addConstraint(c2);
				}

				var c3 = new CANNON.PointToPointConstraint(spherebody, new CANNON.Vec3(-cnX, 0, cnY), chainLinkBody, new CANNON.Vec3(-cnX, 0, -cnY));
				var c4 = new CANNON.PointToPointConstraint(spherebody, new CANNON.Vec3(cnX, 0, cnY), chainLinkBody, new CANNON.Vec3(cnX, 0, -cnY));

				world.addConstraint(c3);
				world.addConstraint(c4);



				// To keep track of which body was added last
				last = spherebody;
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