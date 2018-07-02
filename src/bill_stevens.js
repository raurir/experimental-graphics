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

	const available = Array(Math.pow(dim, 3)).fill(0);
	const occupied = Array(Math.pow(dim, 3)).fill(0);
	const positions = [];

	const position = (grid) =>
		(index) => (index - grid / 2 + 0.5) * size;

	const populate = (array) =>
		(index) => array[index] = 1;

	const getPositionFromIndex = (grid) =>
		(index) => {
			var x = index % grid;
			var y = Math.floor(index / grid) % grid;
			var z = Math.floor(index / (grid * grid));
			return {x, y, z};
		}

	const getIndexFromPosition = ({x,y,z}) =>
		x + y * dim + z * dim * dim;




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
		}, {
			id: 3,
			structure: [
				[
					[1,1,1,1],
				]
			]
		}
	].map((piece) =>{
		// calculate dimensions (bounds)
		const { structure } = piece;
		var w = 0, h = 0, d = 0;
		structure.forEach((xLayer, x) => {
			w = Math.max(w, x + 1);
			xLayer.forEach((yRow, y) => {
				h = Math.max(h, y + 1);
				yRow.forEach((piece, z) => {
					d = Math.max(d, z + 1);
				});
			});
		});
		return Object.assign(piece, {
			dimensions: {w, h, d},
		});
	});
	// console.log(pieces);

	function cube(scale) {
		const d = scale * size;
		const material = new THREE.MeshLambertMaterial({color: 0});
		const geometry = new THREE.BoxGeometry(d, d, d);
		return new THREE.Mesh(geometry, material);
	}
	function getBlock() {

		const test = occupied.slice();
		const piece = pieces[Math.floor(Math.random() * pieces.length)];
		const { structure } = piece;

		const p = position(dim);

		const colour = Number("0x" + colours.getNextColour().substr(1));

		const block = new THREE.Group();
		block.x = rand.getInteger(0, dim - piece.dimensions.w);
		block.y = rand.getInteger(0, dim - piece.dimensions.h);
		block.z = rand.getInteger(0, dim - piece.dimensions.d);

		const positions = [];

		structure.forEach((xLayer, x) => {
			xLayer.forEach((yRow, y) => {
				yRow.forEach((piece, z) => {
					if (piece) {
						var c = cube(1);
						c.position.set(p(x), p(y), p(z));
						c.material.color.setHex(colour);
						block.add(c);

						const positionIndex = getIndexFromPosition({
							x: x + block.x,
							y: y + block.y,
							z: z + block.z
						});
						positions.push(positionIndex);
						populate(test, positionIndex);
					}
				});
			});
		});

		if (test.some((item) => item > 1)) {
			return con.log("invalid!");
		} else {
			con.log("cool", test);
		}

		block.position.set(
			block.x * size,
			block.y * size,
			block.z * size
		);
		// return block;

		holder.add(block);

		positions.forEach((positionIndex) => {
			populate(occupied, positionIndex);
		});
	}

	function init() {

		colours.getRandomPalette();

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

		let p = position(dim + 1);
		for (var i = 0; i < Math.pow(dim + 1, 3); i++) {
			var c = cube(0.1);
			var {x, y, z} = getPositionFromIndex(dim + 1)(i);
			c.position.set(p(x), p(y), p(z));
			c.material.color.setHex(0xff7700);
			cubes.push(c);
			holder.add(c);
		}

		stage.appendChild(renderer.domElement);

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );
		document.addEventListener( 'keydown', onKeyDown, false );

		render();
		animate();
		attemptBlock();
	}

	let a = 0;
	const attemptBlock = () => {
		getBlock();
		// con.log(available, occupied);
		a++
		if (a > 29) return;
		setTimeout(attemptBlock, 1000);
	}



	function onDocumentMouseMove( event ) {
		event.preventDefault();
		mouse.x = ( event.clientX / sw ) * 2 - 1;
		mouse.y = - ( event.clientY / sh ) * 2 + 1;
	}

	const onKeyDown = ( event ) => {
		// con.log(event);
		return;

		switch (event.key) {
			case "ArrowLeft" : b.x --; break;
			case "ArrowUp" : b.y --; break;
			case "ArrowRight" : b.x ++; break;
			case "ArrowDown" : b.y ++; break;
		}


		const mesh = b;

		TweenMax.to(mesh.position, 0.5, {
			x: b.x * size,
			y: b.y * size,
			z: b.z * size,
		});

		// event.preventDefault();
	}

	function render() {

		// var camRadius = 100;

		theta += 0.03;// mouse.x * 4;
		gamma += 0.0435;//mouse.y * 2;

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