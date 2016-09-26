var maze_cube = function() {

	var camera, scene, renderer;
	var mouse = {x: 0, y: 0};
	var camPos = {x: 0, y: 0, z: 0};
	var sw = window.innerWidth, sh = window.innerHeight;
	var holder;
	var texture;

	function cube(s) {
		var group = new THREE.Group();
		var material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			map: texture ? texture : null
		});
		var geometry = new THREE.BoxGeometry(s, s, s);
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

		holder = new THREE.Group();
		scene.add(holder);

		// texture = new THREE.TextureLoader().load("./maze-face.png", function() {
		// 	var c = cube(512);
		// 	holder.add(c);
		// });

		cubeSize = 512;

		var c = cube(cubeSize);
		holder.add(c);


		var grid = [{"x":0,"y":0},{"x":1,"y":0},{"x":2,"y":0},{"x":3,"y":0},{"x":4,"y":0},{"x":5,"y":0},{"x":6,"y":0},{"x":7,"y":0},{"x":8,"y":0},{"x":9,"y":0},{"x":10,"y":0},{"x":11,"y":0},{"x":12,"y":0},{"x":13,"y":0},{"x":14,"y":0},{"x":15,"y":0},{"x":16,"y":0},{"x":17,"y":0},{"x":18,"y":0},{"x":19,"y":0},{"x":20,"y":0},{"x":21,"y":0},{"x":22,"y":0},{"x":23,"y":0},{"x":24,"y":0},{"x":25,"y":0},{"x":26,"y":0},{"x":27,"y":0},{"x":28,"y":0},{"x":29,"y":0},{"x":30,"y":0},{"x":31,"y":0},{"x":32,"y":0},{"x":0,"y":1},{"x":8,"y":1},{"x":12,"y":1},{"x":13,"y":1},{"x":14,"y":1},{"x":24,"y":1},{"x":28,"y":1},{"x":32,"y":1},{"x":0,"y":2},{"x":2,"y":2},{"x":3,"y":2},{"x":4,"y":2},{"x":5,"y":2},{"x":6,"y":2},{"x":8,"y":2},{"x":10,"y":2},{"x":12,"y":2},{"x":13,"y":2},{"x":14,"y":2},{"x":16,"y":2},{"x":17,"y":2},{"x":18,"y":2},{"x":19,"y":2},{"x":20,"y":2},{"x":21,"y":2},{"x":22,"y":2},{"x":24,"y":2},{"x":26,"y":2},{"x":28,"y":2},{"x":30,"y":2},{"x":32,"y":2},{"x":0,"y":3},{"x":6,"y":3},{"x":10,"y":3},{"x":14,"y":3},{"x":16,"y":3},{"x":24,"y":3},{"x":26,"y":3},{"x":28,"y":3},{"x":30,"y":3},{"x":32,"y":3},{"x":0,"y":4},{"x":1,"y":4},{"x":2,"y":4},{"x":3,"y":4},{"x":4,"y":4},{"x":6,"y":4},{"x":7,"y":4},{"x":8,"y":4},{"x":9,"y":4},{"x":10,"y":4},{"x":11,"y":4},{"x":12,"y":4},{"x":14,"y":4},{"x":16,"y":4},{"x":18,"y":4},{"x":19,"y":4},{"x":20,"y":4},{"x":21,"y":4},{"x":22,"y":4},{"x":23,"y":4},{"x":24,"y":4},{"x":26,"y":4},{"x":28,"y":4},{"x":30,"y":4},{"x":32,"y":4},{"x":0,"y":5},{"x":4,"y":5},{"x":12,"y":5},{"x":16,"y":5},{"x":20,"y":5},{"x":21,"y":5},{"x":22,"y":5},{"x":26,"y":5},{"x":30,"y":5},{"x":32,"y":5},{"x":0,"y":6},{"x":2,"y":6},{"x":4,"y":6},{"x":5,"y":6},{"x":6,"y":6},{"x":7,"y":6},{"x":8,"y":6},{"x":9,"y":6},{"x":10,"y":6},{"x":12,"y":6},{"x":13,"y":6},{"x":14,"y":6},{"x":15,"y":6},{"x":16,"y":6},{"x":17,"y":6},{"x":18,"y":6},{"x":20,"y":6},{"x":21,"y":6},{"x":22,"y":6},{"x":24,"y":6},{"x":25,"y":6},{"x":26,"y":6},{"x":27,"y":6},{"x":28,"y":6},{"x":29,"y":6},{"x":30,"y":6},{"x":32,"y":6},{"x":0,"y":7},{"x":2,"y":7},{"x":10,"y":7},{"x":18,"y":7},{"x":24,"y":7},{"x":32,"y":7},{"x":0,"y":8},{"x":2,"y":8},{"x":3,"y":8},{"x":4,"y":8},{"x":5,"y":8},{"x":6,"y":8},{"x":7,"y":8},{"x":8,"y":8},{"x":10,"y":8},{"x":11,"y":8},{"x":12,"y":8},{"x":13,"y":8},{"x":14,"y":8},{"x":15,"y":8},{"x":16,"y":8},{"x":18,"y":8},{"x":19,"y":8},{"x":20,"y":8},{"x":21,"y":8},{"x":22,"y":8},{"x":23,"y":8},{"x":24,"y":8},{"x":26,"y":8},{"x":27,"y":8},{"x":28,"y":8},{"x":29,"y":8},{"x":30,"y":8},{"x":31,"y":8},{"x":32,"y":8},{"x":0,"y":9},{"x":2,"y":9},{"x":6,"y":9},{"x":10,"y":9},{"x":11,"y":9},{"x":12,"y":9},{"x":16,"y":9},{"x":18,"y":9},{"x":26,"y":9},{"x":32,"y":9},{"x":0,"y":10},{"x":2,"y":10},{"x":4,"y":10},{"x":6,"y":10},{"x":8,"y":10},{"x":9,"y":10},{"x":10,"y":10},{"x":11,"y":10},{"x":12,"y":10},{"x":14,"y":10},{"x":16,"y":10},{"x":18,"y":10},{"x":20,"y":10},{"x":21,"y":10},{"x":22,"y":10},{"x":23,"y":10},{"x":24,"y":10},{"x":25,"y":10},{"x":26,"y":10},{"x":28,"y":10},{"x":29,"y":10},{"x":30,"y":10},{"x":32,"y":10},{"x":0,"y":11},{"x":4,"y":11},{"x":6,"y":11},{"x":10,"y":11},{"x":14,"y":11},{"x":16,"y":11},{"x":18,"y":11},{"x":20,"y":11},{"x":24,"y":11},{"x":28,"y":11},{"x":32,"y":11},{"x":0,"y":12},{"x":1,"y":12},{"x":2,"y":12},{"x":3,"y":12},{"x":4,"y":12},{"x":6,"y":12},{"x":7,"y":12},{"x":8,"y":12},{"x":10,"y":12},{"x":12,"y":12},{"x":13,"y":12},{"x":14,"y":12},{"x":16,"y":12},{"x":18,"y":12},{"x":20,"y":12},{"x":22,"y":12},{"x":24,"y":12},{"x":26,"y":12},{"x":27,"y":12},{"x":28,"y":12},{"x":30,"y":12},{"x":31,"y":12},{"x":32,"y":12},{"x":0,"y":13},{"x":6,"y":13},{"x":10,"y":13},{"x":14,"y":13},{"x":16,"y":13},{"x":18,"y":13},{"x":20,"y":13},{"x":22,"y":13},{"x":24,"y":13},{"x":26,"y":13},{"x":30,"y":13},{"x":31,"y":13},{"x":32,"y":13},{"x":0,"y":14},{"x":2,"y":14},{"x":3,"y":14},{"x":4,"y":14},{"x":5,"y":14},{"x":6,"y":14},{"x":8,"y":14},{"x":9,"y":14},{"x":10,"y":14},{"x":11,"y":14},{"x":12,"y":14},{"x":14,"y":14},{"x":16,"y":14},{"x":18,"y":14},{"x":20,"y":14},{"x":22,"y":14},{"x":24,"y":14},{"x":26,"y":14},{"x":28,"y":14},{"x":29,"y":14},{"x":30,"y":14},{"x":31,"y":14},{"x":32,"y":14},{"x":0,"y":15},{"x":6,"y":15},{"x":8,"y":15},{"x":12,"y":15},{"x":14,"y":15},{"x":16,"y":15},{"x":18,"y":15},{"x":22,"y":15},{"x":24,"y":15},{"x":26,"y":15},{"x":28,"y":15},{"x":32,"y":15},{"x":0,"y":16},{"x":1,"y":16},{"x":2,"y":16},{"x":3,"y":16},{"x":4,"y":16},{"x":6,"y":16},{"x":8,"y":16},{"x":10,"y":16},{"x":12,"y":16},{"x":14,"y":16},{"x":16,"y":16},{"x":18,"y":16},{"x":19,"y":16},{"x":20,"y":16},{"x":21,"y":16},{"x":22,"y":16},{"x":24,"y":16},{"x":26,"y":16},{"x":28,"y":16},{"x":30,"y":16},{"x":32,"y":16},{"x":4,"y":17},{"x":6,"y":17},{"x":8,"y":17},{"x":10,"y":17},{"x":14,"y":17},{"x":18,"y":17},{"x":24,"y":17},{"x":26,"y":17},{"x":30,"y":17},{"x":32,"y":17},{"x":0,"y":18},{"x":1,"y":18},{"x":2,"y":18},{"x":4,"y":18},{"x":6,"y":18},{"x":8,"y":18},{"x":10,"y":18},{"x":11,"y":18},{"x":12,"y":18},{"x":13,"y":18},{"x":14,"y":18},{"x":15,"y":18},{"x":16,"y":18},{"x":17,"y":18},{"x":18,"y":18},{"x":20,"y":18},{"x":21,"y":18},{"x":22,"y":18},{"x":23,"y":18},{"x":24,"y":18},{"x":26,"y":18},{"x":27,"y":18},{"x":28,"y":18},{"x":29,"y":18},{"x":30,"y":18},{"x":32,"y":18},{"x":0,"y":19},{"x":1,"y":19},{"x":2,"y":19},{"x":4,"y":19},{"x":6,"y":19},{"x":8,"y":19},{"x":12,"y":19},{"x":20,"y":19},{"x":24,"y":19},{"x":26,"y":19},{"x":32,"y":19},{"x":0,"y":20},{"x":1,"y":20},{"x":2,"y":20},{"x":4,"y":20},{"x":6,"y":20},{"x":8,"y":20},{"x":9,"y":20},{"x":10,"y":20},{"x":12,"y":20},{"x":14,"y":20},{"x":15,"y":20},{"x":16,"y":20},{"x":17,"y":20},{"x":18,"y":20},{"x":19,"y":20},{"x":20,"y":20},{"x":22,"y":20},{"x":24,"y":20},{"x":26,"y":20},{"x":28,"y":20},{"x":29,"y":20},{"x":30,"y":20},{"x":31,"y":20},{"x":32,"y":20},{"x":0,"y":21},{"x":4,"y":21},{"x":6,"y":21},{"x":8,"y":21},{"x":12,"y":21},{"x":22,"y":21},{"x":26,"y":21},{"x":32,"y":21},{"x":0,"y":22},{"x":2,"y":22},{"x":3,"y":22},{"x":4,"y":22},{"x":6,"y":22},{"x":8,"y":22},{"x":10,"y":22},{"x":11,"y":22},{"x":12,"y":22},{"x":13,"y":22},{"x":14,"y":22},{"x":15,"y":22},{"x":16,"y":22},{"x":17,"y":22},{"x":18,"y":22},{"x":19,"y":22},{"x":20,"y":22},{"x":21,"y":22},{"x":22,"y":22},{"x":23,"y":22},{"x":24,"y":22},{"x":25,"y":22},{"x":26,"y":22},{"x":27,"y":22},{"x":28,"y":22},{"x":29,"y":22},{"x":30,"y":22},{"x":32,"y":22},{"x":0,"y":23},{"x":2,"y":23},{"x":6,"y":23},{"x":8,"y":23},{"x":10,"y":23},{"x":28,"y":23},{"x":32,"y":23},{"x":0,"y":24},{"x":2,"y":24},{"x":4,"y":24},{"x":5,"y":24},{"x":6,"y":24},{"x":8,"y":24},{"x":10,"y":24},{"x":12,"y":24},{"x":13,"y":24},{"x":14,"y":24},{"x":15,"y":24},{"x":16,"y":24},{"x":17,"y":24},{"x":18,"y":24},{"x":19,"y":24},{"x":20,"y":24},{"x":21,"y":24},{"x":22,"y":24},{"x":23,"y":24},{"x":24,"y":24},{"x":25,"y":24},{"x":26,"y":24},{"x":28,"y":24},{"x":30,"y":24},{"x":31,"y":24},{"x":32,"y":24},{"x":0,"y":25},{"x":2,"y":25},{"x":4,"y":25},{"x":5,"y":25},{"x":6,"y":25},{"x":10,"y":25},{"x":18,"y":25},{"x":22,"y":25},{"x":26,"y":25},{"x":30,"y":25},{"x":31,"y":25},{"x":32,"y":25},{"x":0,"y":26},{"x":2,"y":26},{"x":4,"y":26},{"x":5,"y":26},{"x":6,"y":26},{"x":7,"y":26},{"x":8,"y":26},{"x":9,"y":26},{"x":10,"y":26},{"x":11,"y":26},{"x":12,"y":26},{"x":13,"y":26},{"x":14,"y":26},{"x":15,"y":26},{"x":16,"y":26},{"x":18,"y":26},{"x":20,"y":26},{"x":22,"y":26},{"x":24,"y":26},{"x":26,"y":26},{"x":27,"y":26},{"x":28,"y":26},{"x":29,"y":26},{"x":30,"y":26},{"x":31,"y":26},{"x":32,"y":26},{"x":0,"y":27},{"x":4,"y":27},{"x":8,"y":27},{"x":12,"y":27},{"x":16,"y":27},{"x":20,"y":27},{"x":24,"y":27},{"x":28,"y":27},{"x":32,"y":27},{"x":0,"y":28},{"x":1,"y":28},{"x":2,"y":28},{"x":3,"y":28},{"x":4,"y":28},{"x":6,"y":28},{"x":8,"y":28},{"x":10,"y":28},{"x":12,"y":28},{"x":14,"y":28},{"x":16,"y":28},{"x":17,"y":28},{"x":18,"y":28},{"x":19,"y":28},{"x":20,"y":28},{"x":21,"y":28},{"x":22,"y":28},{"x":23,"y":28},{"x":24,"y":28},{"x":25,"y":28},{"x":26,"y":28},{"x":28,"y":28},{"x":30,"y":28},{"x":32,"y":28},{"x":0,"y":29},{"x":6,"y":29},{"x":10,"y":29},{"x":14,"y":29},{"x":20,"y":29},{"x":26,"y":29},{"x":30,"y":29},{"x":32,"y":29},{"x":0,"y":30},{"x":2,"y":30},{"x":3,"y":30},{"x":4,"y":30},{"x":5,"y":30},{"x":6,"y":30},{"x":7,"y":30},{"x":8,"y":30},{"x":9,"y":30},{"x":10,"y":30},{"x":11,"y":30},{"x":12,"y":30},{"x":13,"y":30},{"x":14,"y":30},{"x":15,"y":30},{"x":16,"y":30},{"x":17,"y":30},{"x":18,"y":30},{"x":20,"y":30},{"x":22,"y":30},{"x":23,"y":30},{"x":24,"y":30},{"x":26,"y":30},{"x":27,"y":30},{"x":28,"y":30},{"x":29,"y":30},{"x":30,"y":30},{"x":32,"y":30},{"x":0,"y":31},{"x":18,"y":31},{"x":22,"y":31},{"x":23,"y":31},{"x":24,"y":31},{"x":32,"y":31},{"x":0,"y":32},{"x":1,"y":32},{"x":2,"y":32},{"x":3,"y":32},{"x":4,"y":32},{"x":5,"y":32},{"x":6,"y":32},{"x":7,"y":32},{"x":8,"y":32},{"x":9,"y":32},{"x":10,"y":32},{"x":11,"y":32},{"x":12,"y":32},{"x":13,"y":32},{"x":14,"y":32},{"x":15,"y":32},{"x":16,"y":32},{"x":18,"y":32},{"x":19,"y":32},{"x":20,"y":32},{"x":21,"y":32},{"x":22,"y":32},{"x":23,"y":32},{"x":24,"y":32},{"x":25,"y":32},{"x":26,"y":32},{"x":27,"y":32},{"x":28,"y":32},{"x":29,"y":32},{"x":30,"y":32},{"x":31,"y":32},{"x":32,"y":32}];


		let makeFace = (options) => {
			var face = new THREE.Group();
			holder.add(face);

			const items = 32;
			const size = cubeSize / (items - 1);
			grid.forEach(function(item) {
				var x = (item.x - items / 2) * size;
				var y = (item.y - items / 2) * size;
				var z = (cubeSize / 2) + size / 2;
				var c = cube(size);
				c.position.set(x, y, z);
				face.add(c);
			});
			if (options.rotation.x) face.rotation.x = options.rotation.x * Math.PI;
			if (options.rotation.y) face.rotation.y = options.rotation.y * Math.PI;
			if (options.rotation.z) face.rotation.z = options.rotation.z * Math.PI;
			// face.rotation.set(options.rotation.x * Math.PI, options.rotation.y * Math.PI, options.rotation.z * Math.PI);
			// return face;
		}

		makeFace({rotation: {x: 0}});
		makeFace({rotation: {x: 1}});
		makeFace({rotation: {x: 0.5}});
		makeFace({rotation: {x: 1.5}});

		makeFace({rotation: {y: 0.5}});
		makeFace({rotation: {y: 1.5}});


		// var size = 10, items = 32;;
		// grid.forEach(function(row, ri) {
		// 	row.forEach(function(item, ci) {
		// 		if (item == "#") {
		// 			var x = (ci - items / 2) * size, y = (ri - items / 2) * size, z = items / 2 * size;
		// 			var c = cube(size);
		// 			c.position.set(x, y, z);
		// 			holder.add(c);
		// 		}
		// 	});
		// });


		// texture.wrapS = THREE.RepeatWrapping;
		// texture.wrapT = THREE.RepeatWrapping;
		// texture.repeat.set(8, 8);

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
		window.addEventListener("click", exportToObj);


	}



	function render(time) {
		holder.rotation.x += 0.01;
		holder.rotation.z -= 0.01;
		camPos.z = 1000;
		camera.position.set(camPos.x, camPos.y, camPos.z);
		camera.lookAt( scene.position );
		renderer.render( scene, camera );
		// requestAnimationFrame( render );
	}

	return {
		init: init
	}

};

define("maze_cube", maze_cube);