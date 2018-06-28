// must solve this for...
define("bill_stevens", () => { // ... and jan

	const stage = document.createElement("div");

	var camera, scene, projector, renderer, holder;
	const mouse = { x: 0, y: 0 };
	const sw = window.innerWidth, sh = window.innerHeight;
	// sw = sh = 400;
	var theta = 0, gamma = 0;
	var dim = 4;
	var size = 40;
	var cubes = [];

	const available = [];
	const occupied = [];

	function p(index) {
		return (index - dim / 2 + 0.5) * size;
	}


	const pieces = [
		{
			id: 0,
			structure: [
				[
					[1,1],
					[1,0],
				],[
					[1,0],
					[0,0],
				]
			]
		}, {
			id: 1,
			structure: [
				[
					[1,1,1],
					[1,0,0],
				]
			]
		}
	]

	function cube(scale) {
		const d = scale * size;
		const material = new THREE.MeshLambertMaterial({color: 0});
		const geometry = new THREE.BoxGeometry(d, d, d);
		return new THREE.Mesh(geometry, material);
	}

	function getBlock() {
		const block = new THREE.Group();
		holder.add(block);
		const piece = pieces[Math.floor(Math.random() * pieces.length)];
		const { structure } = piece;
		structure.forEach((zLayer, z) => {
			zLayer.forEach((xRow, x) => {
				xRow.forEach((piece, y) => {
					con.log(x, y, z, piece);
					if (piece) {
						var c = cube(1);
						// c.position.set(p(x), p(y), p(z));
						c.position.set(x * size, y * size, z * size);
						// cubes.push(c);
						c.material.color.setHex(0xff8844);
						block.add(c);
					}
				});
			});
		});
		return block;
	}

	function init() {

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera( 50, sw / sh, 1, 10000 );
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
			var c = cube(0.1);
			var {x, y, z} = getPositionFromIndex(i);
			c.position.set(p(x), p(y), p(z));
			cubes.push(c);
			holder.add(c);
		}


		getBlock();

		for (i = 0; i < cubes.length; i++) {
			var c = cubes[i];
			var r = Math.round(100 + Math.random() * 15);
			// var b = 100;
			var b = Math.round(100 + Math.random() * 15);
			var g = 100;
			var col = r << 16 | g << 8 | b;
			c.material.color.setHex(col);
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

		// var camRadius = 100;

		theta += mouse.x * 4;
		gamma += mouse.y * 2;

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

});