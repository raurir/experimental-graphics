define("ball_and_chain", [
	"lib/schteppe/cannon.0.6.2.min.js",
	"cannon_demo",
	// "http://schteppe.github.io/cannon.js/libs/TrackballControls.js",
	], function(cn, CannonDemo) {

/* this is 95+% hacked from schteppe's demos */

function go() {
	var demo = new CannonDemo();

	demo.create(function(){
		var world = setupWorld(demo);
		world.gravity.set(0, 0, -20);
		var width = 1;
		var wireSize = 0.3;
		var pitch = 1;
		var chainShape0 = new CANNON.Box(new CANNON.Vec3(width, wireSize, pitch));
		var chainShape1 = new CANNON.Box(new CANNON.Vec3(wireSize, width, pitch));

		var mass = 1;
		var space = 0.3;
		var N = 10, last;

		function join(body0, body1, offset) {
			var cnX = width * 0.1, cnY = pitch + space + offset;
			var c1 = new CANNON.PointToPointConstraint(body0, new CANNON.Vec3(-cnX, 0, cnY), body1, new CANNON.Vec3(-cnX, 0, -cnY));
			var c2 = new CANNON.PointToPointConstraint(body0, new CANNON.Vec3(cnX, 0, cnY), body1, new CANNON.Vec3(cnX, 0, -cnY));
			world.addConstraint(c1);
			world.addConstraint(c2);
		}



		for(var i = 0; i < N; i++){
			var firstBody = i === 0, firstChainLink = i === 1, lastBody = i === N - 1;

			var py = (N-i)*(pitch*2+2*space) + pitch*2+space;

			if (firstBody) { // the ball

				var sphereShape = new CANNON.Sphere(4);
				var spherebody = new CANNON.Body({mass: 3});
				spherebody.addShape(sphereShape);
				spherebody.position.set(0, 0, py);

				last = spherebody;

			} else if (lastBody) { // the cuff

				var L = 3, R = 2;
				var cylinderShape = new CANNON.Cylinder(R, R, L, 12);
				var cylinderBody = new CANNON.Body({mass: 0.5});
				cylinderBody.addShape(cylinderShape);
				cylinderBody.position.set(0, 0, py );

				join(cylinderBody, last, 0);

				last = cylinderBody;

			} else { // the chain

				var chainLinkBody = new CANNON.Body({mass: 0.1});
				chainLinkBody.addShape(i % 2 ? chainShape0 : chainShape1);
				chainLinkBody.position.set(0, 0, py);
				chainLinkBody.custom = true;
				chainLinkBody.customType = "CHAIN_LINK";

				join(chainLinkBody, last, (firstChainLink ? 1.8 : 0));

				last = chainLinkBody;
			}

			world.add(last);
			demo.addVisual(last);
			last.velocity.set(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);

			last.linearDamping = 0.1;
			last.angularDamping = 0.1;

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

}

function check() {
	con.log("check")
	if (typeof THREE === "undefined") {
		setTimeout(check, 10);
	} else {
		go();
	}
}
check();




});