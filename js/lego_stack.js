define("lego_stack", [
	"lib/schteppe/cannon.0.6.2.min.js",
	"cannon_demo",
], function(cn, CannonDemo) {

/* this is 95+% hacked from schteppe's demos */

function go() {
	var demo = new CannonDemo({trackballControls: true});

	var world = setupWorld(demo);
	world.gravity.set(0, 0, -10);

	var blocks = [];

	function createBlock() {
		var kLength = 0.5, kRadius = 0.5, wallThickness = 0.2;

		var width = 2;
		var length = rand.getInteger(1, 4) * 2;
		var height = rand.getInteger(1, 2);
		var knob = new CANNON.Cylinder(kRadius, kRadius, kLength, 12);
		var roof = new CANNON.Box(new CANNON.Vec3(width, length, wallThickness));
		var bodyT = new CANNON.Box(new CANNON.Vec3(width, wallThickness, height));
		var bodyR = new CANNON.Box(new CANNON.Vec3(wallThickness, length, height));
		var bodyB = new CANNON.Box(new CANNON.Vec3(width, wallThickness, height));
		var bodyL = new CANNON.Box(new CANNON.Vec3(wallThickness, length, height));

		var block = new CANNON.Body({mass: 0.1});
		block.addShape(roof, new CANNON.Vec3(0, 0, height));
		block.addShape(bodyT, new CANNON.Vec3(0, length - wallThickness, 0));
		block.addShape(bodyR, new CANNON.Vec3(width - wallThickness, 0, 0));
		block.addShape(bodyB, new CANNON.Vec3(0, -length + wallThickness, 0));
		block.addShape(bodyL, new CANNON.Vec3(-width + wallThickness, 0, 0));

		for (var w = 0; w < width; w++) {
			for (var l = 0; l < length; l++) {
				var knobPosition = new CANNON.Vec3(
					(w - width / 2 + 0.5) * 2,
					(l - length / 2 + 0.5) * 2,
					height + kLength / 2
				);
				block.addShape(knob, knobPosition);
			}
		}

		block.position.set(0, 0, blocks.length * 5);

		var colour = [
			0xdd0000,
			0x004400,
			0xffbb00,
			0x2222ee,
		][rand.getInteger(0, 3)];

		world.add(block);
		demo.addVisual(block, new THREE.MeshPhongMaterial({color: colour}));
		block.linearDamping = 0.1;
		block.angularDamping = 0.1;
		// block.stopped = false; // hack var

		blocks.push(block)

	}


	demo.create(function(){
		createBlock();
		update();
	});

	function update(time) {
		requestAnimationFrame(update);

		if (blocks.length < 100 && blocks.length < Math.floor(time / 1000)) {
			// create 1 every second
			createBlock();
		}

		// for (var i = 0; i < blocks.length; i++) {
		// 	if (!blocks[i].stopped && blocks[i].velocity.norm() < 0.1) {
		// 		blocks[i].stopped = true;
		// 		con.log(blocks[i].quaternion)
		// 		// con.log("stopped", i)
		// 	};
		// }
	}


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