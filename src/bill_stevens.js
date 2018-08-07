// must solve this for...
define("bill_stevens", () => { // ... and jan

	const stage = document.createElement("div");

	var camera, scene, projector, renderer, holder;
	const mouse = { x: 0, y: 0 };
	const sw = window.innerWidth, sh = window.innerHeight;
	var theta = 0, gamma = 0;
	const dim = 4;
	const size = 30;
	const cubes = [];

	const available = Array(Math.pow(dim, 3)).fill(0);
	const occupied = Array(Math.pow(dim, 3)).fill(0);
	const positions = [];

	const position = (grid) =>
		// (index) => (index - grid / 2 + 0.5) * size;
		(index) => index * size;

	const populate = (array, index) => array[index] ++;

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
		/*
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
		},
		*/
		{
			id: 1,
			structure: [
				[
					[1,1,1],
					[1,0,0],
				]
			]
		},
		{
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

	const cube = (scale) => {
		const d = scale * size;
		const material = new THREE.MeshLambertMaterial({color: 0});
		const geometry = new THREE.BoxGeometry(d, d, d);
		return new THREE.Mesh(geometry, material);
	}

	const getBlock = () => {

		const test = occupied.slice();
		// con.log(test);
		const piece = pieces[Math.floor(Math.random() * pieces.length)];
		const { structure } = piece;

		const p = position(dim);

		const hex = colours.getNextColour();
		const mutated = colours.mutateColour(hex, 30);
		const colour = Number("0x" + mutated.substr(1));

		const block = new THREE.Group();
		block.x = rand.getInteger(0, dim - piece.dimensions.w);
		block.y = rand.getInteger(0, dim - piece.dimensions.h);
		block.z = rand.getInteger(0, dim - piece.dimensions.d);

		block.rotation.set(
			rand.getInteger(-1, 1) * Math.PI / 2,
			rand.getInteger(-1, 1) * Math.PI / 2,
			rand.getInteger(-1, 1) * Math.PI / 2,
		)

		const positions = [], vectors = [];

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
		}

		block.position.set(
			block.x * size,
			block.y * size,
			block.z * size
		);
		// return block;

		holder.add(block);

		block.updateMatrixWorld();


		// calculate absolute positions using THREE'S nested bodies calculation.
		var min = {x: 0, y: 0, z: 0};

		block.children.forEach((c, index) => {
			const vector = new THREE.Vector3();
			vector.setFromMatrixPosition(c.matrixWorld);
			const cleansed = {};
			Object.entries(vector).forEach(([key,value]) => {
				// remove inifitely small numbers created by matrix rotations.
				var v = ((value > 0 && value < 0.001) || (value < 0 && value > -0.001)) ? 0 : value;
				cleansed[key] = v / size;
				min[key] = Math.min(min[key], cleansed[key]);
			});
			vectors[index] = cleansed;
		});

		//
		TweenMax.to(block.rotation, 3.5, {x: 0, y:0, z: 0});

		block.children.forEach((c, index) => {
			const pos = vectors[index];
			const newPos = {
				x: (pos.x - min.x) * size,
				y: (pos.y - min.y) * size,
				z: (pos.z - min.z) * size,
			};
			TweenMax.to(c.position, 3.5, newPos);
			con.log(pos, newPos);
		});

		positions.forEach((positionIndex) => {
			populate(occupied, positionIndex);
		});

		// con.log("occupied", occupied);
	}

	const init = () => {

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

		if (occupied.every((item) => item === 1)) {
			return con.log("we're done here!!", occupied);
		}

		// con.log(available, occupied);
		a++
		if (a > 3) return; //1e3) return;
		setTimeout(attemptBlock, 2000);
	}



	const onDocumentMouseMove = ( event ) => {
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

	const render = () => {

		const camRadius = 300;

		// theta += 0.3;// mouse.x * 4;
		// gamma -= 0.435;//mouse.y * 2;

		camera.position.x = 200;//camRadius * Math.sin( theta * Math.PI / 360 );
		camera.position.y = 300;//mouse.y * 100;
		camera.position.z = 400;//camRadius * Math.cos( theta * Math.PI / 360 );
		camera.lookAt( scene.position );
		renderer.render( scene, camera );
	}

	const animate = () => {
		requestAnimationFrame( animate );
		render();
	}

	return {stage, init};
});