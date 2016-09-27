var maze_cube = function() {

	var camera, scene, renderer;
	var mouse = {x: 0, y: 0, toggle: false};
	var camPos = {x: 0, y: 0, z: 0};
	var sw = window.innerWidth, sh = window.innerHeight;
	var holder;
	var cubeSize = 512;
	var controls;

	function cube(w, h, d, colour) {
		// con.log(w,h,d);
		var group = new THREE.Group();
		var material = new THREE.MeshBasicMaterial({
			color: 0xff8080, //colour,
			// map: texture ? texture : null
		});
		var geometry = new THREE.BoxGeometry(w, h, d);
		var object = new THREE.Mesh(geometry, material);
		group.add(object);
		return group;
	}

	function init() {

		scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2(0x000000, 0.0015);

		camera = new THREE.PerspectiveCamera( 80, sw / sh, 1, 10000 );
		scene.add(camera);

		var lightAbove = new THREE.DirectionalLight(0xffffff, 1.5);
		lightAbove.position.set(0, 200, 100);
		scene.add(lightAbove);

		var lightLeft = new THREE.DirectionalLight(0xffffff, 4);
		lightLeft.position.set(-100, 0, 100);
		scene.add(lightLeft);

		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize(sw, sh);

		// controls = new THREE.OrbitControls( camera, renderer.domElement );

		holder = new THREE.Group();
		scene.add(holder);

		var c = cube(cubeSize, cubeSize, cubeSize, 0xffffff);
		// holder.add(c);

		var mazes = [
			[{"x":0,"y":0,"w":15,"h":1},{"x":0,"y":1,"w":1,"h":5},{"x":14,"y":1,"w":1,"h":3},{"x":2,"y":2,"w":11,"h":1},{"x":2,"y":3,"w":1,"h":2},{"x":6,"y":3,"w":1,"h":7},{"x":4,"y":4,"w":1,"h":2},{"x":8,"y":4,"w":7,"h":1},{"x":8,"y":5,"w":1,"h":4},{"x":14,"y":5,"w":1,"h":3},{"x":0,"y":6,"w":5,"h":1},{"x":10,"y":6,"w":3,"h":1},{"x":4,"y":7,"w":1,"h":2},{"x":10,"y":7,"w":1,"h":3},{"x":0,"y":8,"w":3,"h":2},{"x":12,"y":8,"w":3,"h":1},{"x":14,"y":9,"w":1,"h":3},{"x":0,"y":10,"w":13,"h":1},{"x":0,"y":11,"w":1,"h":3},{"x":10,"y":11,"w":1,"h":2},{"x":2,"y":12,"w":7,"h":1},{"x":12,"y":12,"w":3,"h":2},{"x":8,"y":13,"w":1,"h":1},{"x":0,"y":14,"w":7,"h":1},{"x":8,"y":14,"w":7,"h":1}]
			,
			[{"x":0,"y":0,"w":15,"h":1},{"x":0,"y":1,"w":3,"h":2},{"x":6,"y":1,"w":1,"h":3},{"x":12,"y":1,"w":3,"h":2},{"x":4,"y":2,"w":1,"h":2},{"x":8,"y":2,"w":3,"h":1},{"x":0,"y":3,"w":1,"h":3},{"x":10,"y":3,"w":1,"h":1},{"x":14,"y":3,"w":1,"h":3},{"x":2,"y":4,"w":3,"h":1},{"x":6,"y":4,"w":3,"h":3},{"x":10,"y":4,"w":3,"h":1},{"x":4,"y":5,"w":1,"h":3},{"x":10,"y":5,"w":1,"h":3},{"x":0,"y":6,"w":3,"h":1},{"x":12,"y":6,"w":3,"h":3},{"x":0,"y":8,"w":11,"h":1},{"x":0,"y":9,"w":3,"h":2},{"x":6,"y":9,"w":1,"h":2},{"x":10,"y":9,"w":1,"h":1},{"x":14,"y":9,"w":1,"h":3},{"x":4,"y":10,"w":1,"h":2},{"x":8,"y":10,"w":1,"h":2},{"x":10,"y":10,"w":3,"h":1},{"x":0,"y":11,"w":1,"h":3},{"x":10,"y":11,"w":1,"h":2},{"x":2,"y":12,"w":7,"h":1},{"x":12,"y":12,"w":3,"h":2},{"x":8,"y":13,"w":1,"h":1},{"x":0,"y":14,"w":7,"h":1},{"x":8,"y":14,"w":7,"h":1}]
			,
			[{"x":0,"y":0,"w":15,"h":1},{"x":0,"y":1,"w":1,"h":5},{"x":4,"y":1,"w":1,"h":2},{"x":8,"y":1,"w":1,"h":2},{"x":12,"y":1,"w":3,"h":2},{"x":2,"y":2,"w":1,"h":2},{"x":6,"y":2,"w":1,"h":2},{"x":10,"y":2,"w":1,"h":2},{"x":14,"y":3,"w":1,"h":3},{"x":2,"y":4,"w":11,"h":1},{"x":6,"y":5,"w":1,"h":3},{"x":10,"y":5,"w":1,"h":3},{"x":0,"y":6,"w":5,"h":1},{"x":8,"y":6,"w":1,"h":4},{"x":12,"y":6,"w":3,"h":1},{"x":14,"y":7,"w":1,"h":3},{"x":0,"y":8,"w":7,"h":1},{"x":10,"y":8,"w":3,"h":1},{"x":0,"y":9,"w":1,"h":3},{"x":2,"y":10,"w":13,"h":1},{"x":4,"y":11,"w":1,"h":2},{"x":14,"y":11,"w":1,"h":3},{"x":0,"y":12,"w":3,"h":2},{"x":6,"y":12,"w":7,"h":1},{"x":6,"y":13,"w":1,"h":1},{"x":0,"y":14,"w":7,"h":1},{"x":8,"y":14,"w":7,"h":1}]
			,
			[{"x":0,"y":0,"w":15,"h":1},{"x":0,"y":1,"w":1,"h":5},{"x":14,"y":1,"w":1,"h":3},{"x":2,"y":2,"w":11,"h":1},{"x":2,"y":3,"w":1,"h":2},{"x":6,"y":3,"w":1,"h":3},{"x":4,"y":4,"w":1,"h":2},{"x":8,"y":4,"w":7,"h":1},{"x":14,"y":5,"w":1,"h":3},{"x":0,"y":6,"w":5,"h":1},{"x":6,"y":6,"w":7,"h":1},{"x":4,"y":7,"w":1,"h":3},{"x":6,"y":7,"w":1,"h":3},{"x":0,"y":8,"w":3,"h":1},{"x":8,"y":8,"w":7,"h":1},{"x":0,"y":9,"w":1,"h":5},{"x":14,"y":9,"w":1,"h":3},{"x":2,"y":10,"w":3,"h":1},{"x":6,"y":10,"w":7,"h":1},{"x":2,"y":11,"w":1,"h":2},{"x":6,"y":11,"w":1,"h":1},{"x":10,"y":11,"w":1,"h":2},{"x":4,"y":12,"w":3,"h":2},{"x":8,"y":12,"w":1,"h":2},{"x":12,"y":12,"w":3,"h":2},{"x":0,"y":14,"w":7,"h":1},{"x":8,"y":14,"w":7,"h":1}]
			,
			[{"x":0,"y":0,"w":15,"h":1},{"x":0,"y":1,"w":3,"h":2},{"x":6,"y":1,"w":1,"h":2},{"x":14,"y":1,"w":1,"h":5},{"x":4,"y":2,"w":1,"h":2},{"x":8,"y":2,"w":5,"h":1},{"x":0,"y":3,"w":1,"h":3},{"x":8,"y":3,"w":1,"h":1},{"x":12,"y":3,"w":1,"h":2},{"x":2,"y":4,"w":7,"h":1},{"x":10,"y":4,"w":1,"h":2},{"x":6,"y":5,"w":1,"h":3},{"x":0,"y":6,"w":5,"h":1},{"x":8,"y":6,"w":7,"h":1},{"x":10,"y":7,"w":1,"h":3},{"x":14,"y":7,"w":1,"h":7},{"x":0,"y":8,"w":9,"h":1},{"x":12,"y":8,"w":1,"h":4},{"x":0,"y":9,"w":1,"h":3},{"x":2,"y":10,"w":9,"h":1},{"x":4,"y":11,"w":1,"h":2},{"x":0,"y":12,"w":3,"h":2},{"x":6,"y":12,"w":7,"h":1},{"x":6,"y":13,"w":1,"h":1},{"x":0,"y":14,"w":7,"h":1},{"x":8,"y":14,"w":7,"h":1}]
			,
			[{"x":0,"y":0,"w":15,"h":1},{"x":0,"y":1,"w":1,"h":5},{"x":4,"y":1,"w":1,"h":2},{"x":12,"y":1,"w":3,"h":2},{"x":2,"y":2,"w":1,"h":2},{"x":6,"y":2,"w":5,"h":1},{"x":6,"y":3,"w":1,"h":1},{"x":10,"y":3,"w":1,"h":1},{"x":14,"y":3,"w":1,"h":3},{"x":2,"y":4,"w":5,"h":1},{"x":8,"y":4,"w":1,"h":2},{"x":10,"y":4,"w":3,"h":1},{"x":6,"y":5,"w":1,"h":3},{"x":0,"y":6,"w":5,"h":1},{"x":8,"y":6,"w":7,"h":1},{"x":10,"y":7,"w":1,"h":3},{"x":14,"y":7,"w":1,"h":7},{"x":0,"y":8,"w":9,"h":1},{"x":12,"y":8,"w":1,"h":4},{"x":0,"y":9,"w":3,"h":2},{"x":4,"y":10,"w":7,"h":1},{"x":0,"y":11,"w":1,"h":3},{"x":4,"y":11,"w":1,"h":1},{"x":2,"y":12,"w":3,"h":1},{"x":6,"y":12,"w":7,"h":1},{"x":6,"y":13,"w":1,"h":1},{"x":0,"y":14,"w":7,"h":1},{"x":8,"y":14,"w":7,"h":1}]
			];


		let makeFace = (options) => {
			var face = new THREE.Group();
			holder.add(face);

			const items = 15;
			const size = cubeSize / (items - 1);
			options.maze.forEach((item) => {
				var x = (item.x + item.w / 2 - items / 2) * size;
				var y = (item.y + item.h / 2 - items / 2) * size;
				var z = (cubeSize / 2); //size / 2;
				var c = cube(item.w * size, item.h * size, size, options.colour);
				c.position.set(x, y, z);
				face.add(c);
			});
			if (options.rotation.x) face.rotation.x = options.rotation.x * Math.PI;
			if (options.rotation.y) face.rotation.y = options.rotation.y * Math.PI;
			if (options.rotation.z) face.rotation.z = options.rotation.z * Math.PI;
			// face.rotation.set(options.rotation.x * Math.PI, options.rotation.y * Math.PI, options.rotation.z * Math.PI);
			// return face;
		}

		makeFace({maze: mazes[0], rotation: {x: 0}, colour: 0xff0000});
		makeFace({maze: mazes[1], rotation: {x: 1, z: 1.5}, colour: 0x00ff00});
		makeFace({maze: mazes[2], rotation: {x: 0.5, z: 0.5}, colour: 0x0000ff});
		makeFace({maze: mazes[3], rotation: {x: 1.5, z: 1}, colour: 0xffff00});
		makeFace({maze: mazes[4], rotation: {y: 0.5, z: 1.5}, colour: 0xff00ff});
		makeFace({maze: mazes[5], rotation: {y: 1.5, z: 1}, colour: 0x00ffff});

		document.body.appendChild(renderer.domElement);
		render(0);

		function exportToObj() {
			con.log("exportToObj");
			var exporter = new THREE.OBJExporter();
			var result = exporter.parse( scene );
			var floatingDiv = document.createElement("div");
			floatingDiv.style.display = 'block';
			floatingDiv.style.background = "white";
			floatingDiv.style.color = "black";
			floatingDiv.innerHTML = result.split( '\n' ).join ( '<br />' );
			con.log("result.length", result.length);
		}
		// window.addEventListener("click", exportToObj);
		window.addEventListener("click", function() { mouse.toggle = !mouse.toggle; });


	}



	function render(time) {
		if (mouse.toggle) {
			holder.rotation.x += 0.01;
			// holder.rotation.y -= 0.01;
			holder.rotation.z -= 0.01;
		}
		camPos.z = 1000;
		camera.position.set(camPos.x, camPos.y, camPos.z);
		camera.lookAt( scene.position );
		renderer.render( scene, camera );
		// controls.update();
		requestAnimationFrame(render);
	}

	return {
		init: init
	}

};

define("maze_cube", maze_cube);