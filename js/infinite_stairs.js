define("infinite_stairs", function() {

	var camera, scene, renderer;
	var sw = window.innerWidth, sh = window.innerHeight;

	var flightWidth = 300;
	var stepDepth = 40;
	var stepHeight = 30;
	var textures = {};

	function loadTextures(assets) {
		var loader = new THREE.TextureLoader();
		for (var i = 0; i < assets.length; i++) {
			var assetName = assets[i];
			textures[assetName] = loader.load("/assets/" + assetName);
		}
	}

	function createFlight(numFlight) {
		var numSteps = 6;//rand.getInteger(10, 20);
		var treadHeight = stepHeight / 4;
		var treadDepth = stepDepth * 1.25;
		var numLandingSteps = Math.floor(flightWidth / treadDepth);

		var flight = new THREE.Group();
		holder.add(flight);

		var materialWood = new THREE.MeshPhongMaterial({map: textures["wood-dark.jpg"]});
		// var materialWall = new THREE.MeshPhongMaterial({map: textures["mouldy-white-paint.png"]});
		// materialWood = new THREE.MeshPhongMaterial({wireframe: true});
		// materialWall = new THREE.MeshPhongMaterial({wireframe: true});

		function randUV(geometry) {
			var uvs = geometry.faceVertexUvs[0].length;
			for (var f = 0; f < uvs; f += 2) { // 2 sets of uv triangles per face
				var u0 = rand.getNumber(0, 0.75), u1 = u0 + rand.getNumber(0.1, 0.25);
				var v0 = rand.getNumber(0, 0.75), v1 = v0 + rand.getNumber(0.1, 0.25);
				geometry.faceVertexUvs[0][f] = [ // triangle A: [0,1], [0,0], [1,1]
					new THREE.Vector2(u0, v1),
					new THREE.Vector2(u0, v0),
					new THREE.Vector2(u1, v1)
				];
				geometry.faceVertexUvs[0][f + 1] = [ // triangle B: [0,0], [1,0], [1,1]
					new THREE.Vector2(u0, v0),
					new THREE.Vector2(u1, v0),
					new THREE.Vector2(u1, v1)
				];
			}
			return geometry;
		}
		/*
		for (var i = 0; i < numSteps; i++) {
			var riserGeom = randUV(new THREE.BoxGeometry(flightWidth, stepHeight - treadHeight, 1));
			var riser = new THREE.Mesh(riserGeom, materialWood);
			riser.position.set(0, i * stepHeight - treadHeight, (i - 0.5) * stepDepth);
			riser.castShadow = true;
			riser.receiveShadow = true;
			flight.add(riser);

			if(i < numSteps) {
				var treadGeom = randUV(new THREE.BoxGeometry(flightWidth, treadHeight, treadDepth));
				var tread = new THREE.Mesh(treadGeom, materialWood);
				tread.position.set(0, i * stepHeight + treadHeight, i * stepDepth);
				tread.castShadow = true;
				tread.receiveShadow = true;
				flight.add(tread);
			}
		}

		for (var i = 0; i < numLandingSteps; i++) {
			var treadGeom = randUV(new THREE.BoxGeometry(flightWidth, treadHeight, treadDepth));
			var tread = new THREE.Mesh(treadGeom, materialWood);
			tread.position.set(0,
				(numSteps - 1) * stepHeight + treadHeight,
				(numSteps - 1) * stepDepth + i * (treadDepth + 2)); // TODO magic floorboard gap
			tread.castShadow = true;
			tread.receiveShadow = true;
			flight.add(tread);
		}
		*/

		var wallHeight = numSteps * stepHeight * 2     * 4; // HACK
		var wallWidth = numSteps * stepDepth * 2.3     * 4; // HACK
		var wallPanelWidth = 100;
		var wallPanelDepth = 5;
		var wallPanelHeight = wallHeight;
		var wallPanelSpacing = 105;

		var numWallPanels = Math.floor(wallWidth / wallPanelWidth);


		function createWall(xFlip) {

			var wall = new THREE.Group();
			flight.add(wall);
			// wall.position.set(xFlip * flightWidth / 2, wallHeight / 2 - stepHeight / 2, wallWidth / 2 - stepDepth / 2);
			wall.position.set(xFlip * flightWidth / 2, 0, 0);

			for (var i = 0; i < numWallPanels; i++) {

				var wallGeom = randUV(new THREE.BoxGeometry(wallPanelDepth, wallPanelHeight, wallPanelWidth));
				var wallPanel = new THREE.Mesh(wallGeom, materialWood);
				wallPanel.position.set(0, 0, i * wallPanelSpacing);
				wallPanel.castShadow = true;
				wallPanel.receiveShadow = true;
				wall.add(wallPanel);

			}


			// var wallGeom = randUV(new THREE.BoxGeometry(1, wallHeight, wallWidth));
			// // var wall = new THREE.Mesh(wallGeom, materialWall);
			// var wall = new THREE.Mesh(wallGeom, materialWood);
			// wall.position.set(xFlip * flightWidth / 2, wallHeight / 2 - stepHeight / 2, wallWidth / 2 - stepDepth / 2);
			// wall.castShadow = true;
			// wall.receiveShadow = true;
			// flight.add(wall);
			return wall;
		}
		if (numFlight == 0) { // HACK
			var wallLeft = createWall(-1);
			var wallRight = createWall(1);
		}

		return {
			flight: flight,
			end: {
				x: 0,
				y: numSteps * stepHeight,
				z: (numSteps - 1) * stepDepth + numLandingSteps * (treadDepth)
			}
		};
	}

	function makeLight(color, intensity, distance) {
		var lightHolder = new THREE.Group();
		var light = new THREE.PointLight(color, intensity, distance);
		light.castShadow = true;
		light.shadow.mapSize.width = 512;
		light.shadow.mapSize.height = 512;
		light.shadow.camera.near = 0.5;
		light.shadow.camera.far = 500;
		lightHolder.add(light);

		// var sphereGeometry = new THREE.SphereBufferGeometry(5, 4, 4);
		// var sphereMaterial = new THREE.MeshStandardMaterial({color: 0xffff00});
		// var sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
		// lightHolder.add(sphere);

		scene.add(lightHolder);

		return lightHolder;
	}

	function init() {

		loadTextures([
			"wood-dark.jpg",
			// "mouldy-white-paint.png"
		]);

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(100, sw / sh, 1, 20000);
		scene.add(camera);

		camera.position.set(0, 250, -100);
		camera.position.set(1500, 1600, -1000); // TEMP
		// camera.lookAt(scene.position);
		camera.lookAt(new THREE.Vector3(0, 250, 100));

		controls = new THREE.OrbitControls( camera );

		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize(sw, sh);
		renderer.shadowMap.enabled = true;
		// renderer.shadowMap.type = THREE.PCFShadowMap;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		// light = makeLight(0xf2eee3, 3, 400);
		// light.position.set(0, 400, 300);

		// light = makeLight(0xd8cba2, 1, 200);
		// light.position.set(0, 200, 100);

		holder = new THREE.Group();
		scene.add(holder);

		var first = createFlight(0);
		// var second = createFlight(1);
		// second.flight.position.set(0, first.end.y, first.end.z);

		var lightAmbient = new THREE.AmbientLight(0xffffff, 1);
		scene.add(lightAmbient);

		document.body.appendChild(renderer.domElement);
		render(0);

	}

	function render(time) {
		// holder.rotation.y += 0.01;
		// light.position.z += 0.5;
		// camera.position.y += 0.5;
		// camera.position.z += 0.5;

		// controls.update();
		requestAnimationFrame(render);
		renderer.render(scene, camera);
	}

	return {
		init: init
	}

});