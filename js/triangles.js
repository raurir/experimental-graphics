define("triangles", function() {

	var camera, scene, renderer;
	var sw = window.innerWidth, sh = window.innerHeight;
	var holder, grid = [];

	var TAU = Math.PI * 2;
	var ps = 10;
	var pixels = ps;
	var gridSize = 20;
	var triangleShape;
	var theta = 1 / 6 * Math.PI;
	var radius = gridSize / Math.cos(theta);
	var some = radius * Math.sin(theta);
	var weird = (radius + some) / 2;

	function generateShape() {
		var shape = new THREE.Shape();
		var first = null, points = 3;
		var triRadius = 0.8 * radius;
		for (var i = 0; i < points; i++) {
			var a = i / points * TAU;
			var point = {
				x: Math.sin(a) * triRadius,
				y: Math.cos(a) * triRadius
			}
			if (i == 0) {
				first = point;
				shape.moveTo(point.x, point.y);
			} else {
				shape.lineTo(point.x, point.y);
			}
		}
		shape.lineTo(first.x, first.y);
		return shape;
	}
	function triangle() {
		triangleShape = triangleShape || generateShape();
		var geometry = new THREE.ShapeGeometry(triangleShape);
		var material = new THREE.MeshBasicMaterial({
			color: colours.getRandomColour(),
			side: THREE.DoubleSide
		});
		var mesh = new THREE.Mesh(geometry, material);
		return mesh;
	}

	function init() {

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(90, sw / sh, 1, 20000);
		scene.add(camera);

		var lightAbove = new THREE.DirectionalLight(0xffffff, 1);
		lightAbove.position.set(0, 1, 0.5);
		scene.add(lightAbove);

		// var lightLeft = new THREE.DirectionalLight(0xf0e5a1, 0.5);
		// lightLeft.position.set(-1, 0.5, 0.5);
		// scene.add(lightLeft);

		// var lightBelow = new THREE.DirectionalLight(0x303030, 0.2);
		// lightBelow.position.set(0, -1, 0.25);
		// scene.add(lightBelow);

		ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
		scene.add(ambientLight);

		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize(sw, sh);

		holder = new THREE.Group();
		scene.add(holder);


		for (var p = 0; p < pixels * pixels; p++) {
			var c = triangle();
			holder.add(c);
			var xi = p % pixels - pixels / 2 + 0.5;

			var rowIndex = Math.floor(p / pixels);
			var rowEven = rowIndex % 2;
			var row4th = Math.floor(rowIndex / 2) % 2;

			var yi = rowIndex - pixels / 2 + 0.5;
			var x = xi * 2 * gridSize + (rowEven ^ row4th ? - gridSize : 0);

			var y = yi * weird + (rowEven ? 0 : weird - some);
			var z = 0;
			c.position.set(x, y, z);
			c.rotation.set(0, 0, rowEven * Math.PI);
			grid.push(c);
		}

		document.body.appendChild(renderer.domElement);
		render(0);
	}

	function render(time) {
		holder.rotation.x += 0.01;
		// holder.rotation.y -= 0.01;
		// con.log(holder)
		// grid.forEach((c, index) => {
		// 	// c.rotation.y += c.rotateSpeed * 0.01;
		// 	//c.rotateSpeed -= 0.01;
		// 	// c.rotation.x = 0 - c.rotateAmount * Math.PI / 4;
		// 	c.rotation.x = Math.PI / 4 - rotations[index].rotation * Math.PI / 3;
		// });
		// camPos.x = 0 + Math.sin(time * 0.00012) * 50;
		// camPos.y = 0 + Math.sin(time * 0.00017) * 50;
		// camPos.z = 400 + Math.sin(time * 0.0001) * 300;
		camera.position.set(0, 0, 100);//camPos.x, camPos.y, camPos.z);
		camera.lookAt( scene.position );
		renderer.render( scene, camera );
		requestAnimationFrame(render);
	}

	return {
		init: init
	}

});