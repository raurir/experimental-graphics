var tetris_cube = function() {

	var stage = document.createElement("div");

	var camera, scene, projector, renderer, holder;
	var mouse = { x: 0, y: 0 };
	var sw = window.innerWidth, sh = window.innerHeight;
	// sw = sh = 400;
	var theta = 0, gamma = 0;
	var dim = 3;
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
			return (index - dim / 2 + 0.5) * size;
		}

		function getPositionFromIndex(index) {
			var x = index % dim;
			var y = Math.floor(index / dim) % dim;
			var z = Math.floor(index / (dim * dim));
			return {x, y, z};
		}
		function getIndexFromPosition({x,y,z}) {
			return x + y * dim + z * dim * dim
		}

		for (var i = 0; i < dim * dim * dim; i++) {
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

		var loners = [];

		var MODE_GROUP_EXPAND = "MODE_GROUP_EXPAND"
		var MODE_LONER_UNITE = "MODE_LONER_UNITE"
		var checkMode = MODE_GROUP_EXPAND

		function checkNeighbours(sourceIndex) {

			function checkNeighbour(targetPosition) {
				var targetIndex = getIndexFromPosition(targetPosition);
				if (checkMode === MODE_GROUP_EXPAND && cubes[targetIndex].groupId === 0) {
					// con.log("assigning groupId", cubes[targetIndex].groupId, "to", sourceIndex, "from", targetIndex)
					setGroup(targetIndex, cubes[sourceIndex].groupId)
					count ++
				} else if (checkMode === MODE_LONER_UNITE && cubes[targetIndex].groupId > 0) {

					setGroup(sourceIndex, cubes[targetIndex].groupId)
					count ++
	
				} else {
					// con.log("checkNeighbour nop - position", targetPosition, "index", targetIndex)
				}
			}

			var {x, y, z} = getPositionFromIndex(sourceIndex);
			var count = 0;
			var queue = [];
			function queueCheck(pos) {
				queue.push(pos);
			}
			// con.log("checkNeighbours sourceIndex", sourceIndex, x, y, z)
			if (x === 0) {
				// don't check x - 1
				queueCheck({x: x + 1, y, z})
			} else if (x === dim - 1) {
				// don't check x + 1
				queueCheck({x: x - 1, y, z})
			} else {
				queueCheck({x: x - 1, y, z})
				queueCheck({x: x + 1, y, z})
			}
			if (y === 0) {
				// don't check y - 1
				queueCheck({x, y: y + 1, z})
			} else if (y === dim - 1) {
				// don't check y + 1
				queueCheck({x, y: y - 1, z})
			} else {
				queueCheck({x, y: y - 1, z})
				queueCheck({x, y: y + 1, z})
			}
			if (z === 0) {
				// don't check z - 1
				queueCheck({x, y, z: z + 1})
			} else if (z === dim - 1) {
				// don't check z + 1
				queueCheck({x, y, z: z - 1})
			} else {
				queueCheck({x, y, z: z - 1})
				queueCheck({x, y, z: z + 1})
			}
			rand.shuffle(queue);
			for (var q = 0; q < queue.length; q++) {
				checkNeighbour(queue[q]);
			}
			if (count === 0) {
				// con.log("AAAAaarg! couldn't add any neighbours to group")
				// cubes[sourceIndex].position.x += 1.5 * size * dim;
				loners.push(sourceIndex);
			}
			if (checkMode === MODE_GROUP_EXPAND) nextGroup();
		}

		function nextGroup() {
			var availableIndex = Math.floor(available.length * Math.random());
			// con.log("nextGroup", available.length)
			if (available.length) {
				availableIndex = available[availableIndex];
				globalGroupId++;
				setGroup(availableIndex, globalGroupId);
				checkNeighbours(availableIndex);
			} else {
				con.log("all done...",groups)
				// var pos = 0;
				// setInterval(() => {
				// 	pos++;
				// 	TweenMax.to(holder.position, 0.5, {x: -pos * size * dim});
				// }, 700);

				var pos = 0;
				setTimeout(() => {
					// pos++;
					groups.forEach((group, groupIndex) => {
						// var average = group.reduce((sum, mesh) => {
						// 	return {
						// 		x: sum.x + mesh.position.x,
						// 		y: sum.y + mesh.position.y,
						// 		z: sum.z + mesh.position.z
						// 	}
						// }, {x: 0, y: 0, z: 0});
						var cols = 4;
						var average = {
							x: (-cols / 2 + groupIndex % cols) * size * 4,
							y: Math.floor(-1 + groupIndex / cols) * size * 4,
							z: 0
						}
						group.forEach((mesh) => {
							TweenMax.to(mesh.position, 0.5, {
								x: mesh.position.x + average.x,
								y: mesh.position.y + average.y,
								z: mesh.position.z + average.z,
								delay: groupIndex * 0.1
							});
						})
						
					})
					// 
				}, 1700);
			}
		}
		function setGroup(targetIndex, groupId) {
			var maxSize = checkMode === MODE_LONER_UNITE ? 6 : 4;
			if (!groups[groupId]) groups[groupId] = [];
			if (groups[groupId].length === maxSize) {
				// con.log("group too large", groupId, groups[groupId])/
				return
			}
			var c = cubes[targetIndex];
			groups[groupId].push(c);
			c.groupId = groupId;

			var availableIndex = available.indexOf(targetIndex);
			available.splice(availableIndex, 1);
		}
		setGroup(0, globalGroupId);
		checkNeighbours(0);

		con.log(loners)
		rand.shuffle(loners)
		con.log(loners)
		checkMode = MODE_LONER_UNITE;
		for (i = 0; i < loners.length; i++) {
			// con.log(loners)
			checkNeighbours(loners[i])
		}

		for (i = 0; i < cubes.length; i++) {
			var c = cubes[i];
			// con.log(i, c.groupId)
			var r = (c.groupId * 20) % 255;
			var g = 100;//Math.round(100 + Math.random() * 15);
			var b = 100;//Math.round(100 + Math.random() * 15);
			var col = r << 16 | g << 8 | b;
			c.material.color.setHex(col);
			// c.position.x += c.groupId * size * dim;
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

		// theta += mouse.x * 4;
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