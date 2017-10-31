define("cube_pixelator", [], function() {

	const pixels = 24;
	const cubeSize = 16;

	var camera, scene, renderer;
	var mouse = {x: 0, y: 0, toggle: true};
	var camPos = {x: 0, y: 0, z: 0};
	var sw = window.innerWidth, sh = window.innerHeight;
	var holder;
	var controls;

	var grid = [];

	function cube(w, h, d, colour) {
		const group = new THREE.Group();
		const material = new THREE.MeshLambertMaterial({
			color: colour,
		});

		const geometry = new THREE.BoxGeometry(w, h, d);
		const object = new THREE.Mesh(geometry, material);
		group.add(object);
		return group;
	}

	function init() {

		scene = new THREE.Scene();

		// camera = new THREE.PerspectiveCamera(90, sw / sh, 1, 20000);
		camera = new THREE.OrthographicCamera( sw / - 2, sw / 2, sh / 2, sh / - 2, 1, 20000 );
		scene.add(camera);

		var lightAbove = new THREE.DirectionalLight(0xffffff, 1);
		lightAbove.position.set(0, 2500, 0);
		scene.add(lightAbove);

		var lightLeft = new THREE.DirectionalLight(0xff0000, 1);
		lightLeft.position.set(-2500, 0, 0);
		scene.add(lightLeft);

		renderer = new THREE.WebGLRenderer();
		renderer.setSize(sw, sh);

		holder = new THREE.Group();
		scene.add(holder);

		for (var p = 0; p < pixels * pixels; p++) {
			var c = cube(cubeSize, cubeSize, 10, 0xffffff);
			holder.add(c);
			var xi = p % pixels - pixels / 2 + 0.5;
			var yi = Math.floor(p / pixels) - pixels / 2 + 0.5;
			var x = xi * cubeSize * 2;
			var y = yi * cubeSize * 2;
			var z = 0;
			c.position.set(x, y, z);
			// c.rotateSpeed = Math.random() - 0.5;
			var scalar = xi / ((pixels - 1) / 2) + 1;
			c.rotateAmount = scalar;
			// c.rotateAmount = Math.sqrt(xi * xi + yi * yi);
			if (p < pixels) con.log(scalar)
			grid.push(c);
		}

		document.body.appendChild(renderer.domElement);
		render(0);

	}

	function render(time) {
		grid.forEach((c) => {
			// c.rotation.x += c.rotateSpeed * 0.1;
			c.rotation.x = 0 - c.rotateAmount * Math.PI / 4;//0.1;
		});
		// holder.rotation.x += Math.PI * 0.005;
		camPos.z = 2800; //ortho camera
		// camPos.z = 800;
		// camPos.y = -cubeSize * pixels;
		camera.position.set(camPos.x, camPos.y, camPos.z);
		camera.lookAt( scene.position );
		renderer.render( scene, camera );
		// requestAnimationFrame(render);
		// setTimeout(() => render(time+1), 200);
	}

	return {
		init: init
	}

});

