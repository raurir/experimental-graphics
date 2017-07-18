var tetris_cube = function() {

	var stage = document.createElement("div");

	var camera, scene, projector, renderer, holder;
	var mouse = { x: 0, y: 0 };
	var sw = window.innerWidth, sh = window.innerHeight;
	// sw = sh = 400;
	var theta = 0, gamma = 0;
	var slice = 5;
	var size = 40;
	var cubes = [];
	var groups = [];
	var available = [];

	function cube() {
		var material = new THREE.MeshLambertMaterial({color: 0});
		var geometry = new THREE.BoxGeometry(size, size, size);
		return new THREE.Mesh(geometry, material);
	}

	function init() {

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera( 70, sw / sh, 1, 10000 );
		camera.position.set( 0, 100, 500 );
		scene.add( camera );

		var light = new THREE.DirectionalLight( 0xffffff, 2 );
		light.position.set( 1, 1, 1 ).normalize();
		scene.add( light );

		var light = new THREE.DirectionalLight( 0xff00ff, 2 );
		light.position.set( -1, 0, 0 ).normalize();
		scene.add( light );

		renderer = new THREE.WebGLRenderer();
		renderer.setSize( sw, sh );

		holder = new THREE.Group();
		scene.add(holder);

		function p(index) {
			return (index - slice / 2 + 0.5) * size;
		}

		function getPositionFromIndex(index) {
			var x = index % slice;
			var y = Math.floor(index / slice) % slice;
			var z = Math.floor(index / (slice * slice));
			return {x, y, z};
		}
		function getIndexFromPosition({x,y,z}) {
			return x + y * slice + z * slice * slice
		}

		for (var i = 0; i < slice * slice * slice; i++) {
			var c = cube();
			var {x, y, z} = getPositionFromIndex(i);

			// var index = getIndexFromPosition({x, y, z});
			// con.log(i == index, i, index)

			available.push(i);

			c.position.set(p(x), p(y), p(z));
			c.groupId = 0;
			cubes.push(c);
			holder.add(c);
		}
		var globalGroupId = 1;
		// for (i = 0; i < cubes.length; i += rand.getInteger(2, 5)) {
		// 	cubes[i].groupId = ++groupId;
		// }

		function checkNeighbour(sourceIndex, targetPosition) {
			var groupId = cubes[sourceIndex].groupId;
			// if (groupId) {
			// 	return con.log("got an id");
			// }
			var targetIndex = getIndexFromPosition(targetPosition);
			if (cubes[targetIndex].groupId === 0) {
				// con.log("assigning groupId", cubes[targetIndex].groupId, "to", sourceIndex, "from", targetIndex)
				setGroup(targetIndex, groupId)
			} else {
				con.log("checkNeighbour nop - position", targetPosition, "index", targetIndex)
			}
		}
		function checkNeighbours(sourceIndex) {
			var {x, y, z} = getPositionFromIndex(sourceIndex);
			// con.log("checkNeighbours sourceIndex", sourceIndex, x, y, z)
			if (x === 0) {
				// don't check x - 1
				checkNeighbour(sourceIndex, {x: x + 1, y, z})
			} else if (x === slice - 1) {
				// don't check x + 1
				checkNeighbour(sourceIndex, {x: x - 1, y, z})
			} else {
				checkNeighbour(sourceIndex, {x: x - 1, y, z})
				checkNeighbour(sourceIndex, {x: x + 1, y, z})
			}
			if (y === 0) {
				// don't check y - 1
				checkNeighbour(sourceIndex, {x, y: y + 1, z})
			} else if (y === slice - 1) {
				// don't check y + 1
				checkNeighbour(sourceIndex, {x, y: y - 1, z})
			} else {
				checkNeighbour(sourceIndex, {x, y: y - 1, z})
				checkNeighbour(sourceIndex, {x, y: y + 1, z})
			}
			if (z === 0) {
				// don't check z - 1
				checkNeighbour(sourceIndex, {x, y, z: z + 1})
			} else if (z === slice - 1) {
				// don't check z + 1
				checkNeighbour(sourceIndex, {x, y, z: z - 1})
			} else {
				checkNeighbour(sourceIndex, {x, y, z: z - 1})
				checkNeighbour(sourceIndex, {x, y, z: z + 1})
			}
		}

		function nextGroup() {
			con.log("nextGroup")
			var availableIndex = Math.floor(available.length * Math.random());
			availableIndex = available[availableIndex];
			globalGroupId++;
			setGroup(availableIndex, globalGroupId);
			checkNeighbours(availableIndex);
		}
		function setGroup(targetIndex, groupId) {
			if (!groups[groupId]) groups[groupId] = [];
			if (groups[groupId].length === 4) {
				con.log("group too large", groupId, groups[groupId])
				nextGroup();
				return
			}
			var c = cubes[targetIndex];
			groups[groupId].push(c);
			c.groupId = groupId;

			var availableIndex = available.indexOf(targetIndex);
			available.splice(availableIndex, 1);
			// con.log("available", available)
			// con.log("groups[groupId].length", groups[groupId].length)

			if (groups[groupId].length === 4) {
				con.log("group complete", groupId)
				nextGroup();
			}
		}
		setGroup(0, globalGroupId);
		checkNeighbours(0);



		for (i = 0; i < cubes.length; i++) {
			var c = cubes[i];
			// con.log(i, c.groupId)
			var r = (c.groupId * 20) % 255;
			var g = 100;//Math.round(100 + Math.random() * 15);
			var b = 100;//Math.round(100 + Math.random() * 15);
			var col = r << 16 | g << 8 | b;
			c.material.color.setHex(col);
			// c.position.x += c.groupId * size * slice;
		}



		stage.appendChild(renderer.domElement);

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );

		render();
		animate();
	}

	function onDocumentMouseMove( event ) {
		event.preventDefault();
		mouse.x = ( event.clientX / sw ) * 2 - 1;
		mouse.y = - ( event.clientY / sh ) * 2 + 1;
	}

	function render() {

		var camRadius = 500;

		theta += mouse.x * 4;
		gamma += mouse.y * 4;

		// camera.position.x = camRadius * Math.sin( theta * Math.PI / 360 );
		// camera.position.y = mouse.y * 10;
		// camera.position.z = camRadius * Math.cos( theta * Math.PI / 360 );

		holder.rotation.x = gamma * 0.1;
		holder.rotation.y = theta * 0.1;

		camera.lookAt( scene.position );

		renderer.render( scene, camera );

	}

	function animate() {
		requestAnimationFrame( animate );
		render();
	}

  var experiment = {
    stage: stage,
    init: init,
  }

  return experiment;

};

define("tetris_cube", tetris_cube);