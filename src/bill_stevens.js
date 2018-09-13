// must solve this for...
define("bill_stevens", () => { // ... and jan

	const stage = document.createElement("div");

	const RIGHT_ANGLE = Math.PI / 2;

	var camera, controls, scene, projector, renderer, holder;
	const mouse = { x: 0, y: 0 };
	const sw = window.innerWidth, sh = window.innerHeight;
	const dim = 4;
	const size = 30;
	const cubes = [];

	let available = Math.pow(dim, 3);
	const occupied = Array(available).fill(0);

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

	const layouts = [
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
	];


	// precalculate all possible rotations of each piece.
	// relies on THREE scene to be initialised I think.
	const rotations = [];
	const fourRotations = [0, 1, 2, 3];
	fourRotations.forEach((_, xi) => {
		fourRotations.forEach((_, yi) => {
			fourRotations.forEach((_, zi) => {
				rotations.push([xi, yi, zi]); // clearly this is not right! we can achive all possible right angle rotations with less.
			});
		});
	});

	let pieces = [];
	const calculateRotations = (layout) => {
		const { id, structure } = layout;

		const p = position(dim);
		const transformations = rotations.map(([rx, ry, rz]) => {

			const containerTest = new THREE.Group();
			holder.add(containerTest);

			containerTest.rotation.set(rx * RIGHT_ANGLE, ry * RIGHT_ANGLE, rz * RIGHT_ANGLE);

			// create initial guess at 0,0
			structure.forEach((xLayer, x) => {
				xLayer.forEach((yRow, y) => {
					yRow.forEach((piece, z) => {
						if (piece) {
							var c = cube(0.6);
							c.position.set(p(x), p(y), p(z));
							// c.material.color.setHex(colour);
							containerTest.add(c);
						}
					});
				});
			});

			// this is the magic part 1.
			containerTest.updateMatrixWorld();

			// calculate absolute positions using THREE's nested bodies calculation.
			var min = {x: 10, y: 10, z: 10};
			var max = {x: 0, y: 0, z: 0};

			const vectors = containerTest.children.map((c, index) => {
				const vector = new THREE.Vector3();
				// and the magic part 2. clap clap THREE!
				vector.setFromMatrixPosition(c.matrixWorld);
				// con.log("c", c);
				const cleansed = {};
				Object.entries(vector).forEach(([key,value]) => {
					// remove infinitely small numbers created by matrix rotations.
					var v = ((value > 0 && value < 0.001) || (value < 0 && value > -0.001)) ? 0 : value;
					// con.log(v, value, size);
					cleansed[key] = v / size;
					// work out if they are out of bounds.
					min[key] = Math.min(min[key], cleansed[key]);
					max[key] = Math.max(max[key], cleansed[key]);
				});
				// con.log(cleansed);
				return cleansed;
			});

			// con.log("min", min, "min", max);
			const shift = (newV, oldV, d) => {
				if (min[d] < 0) {
					// con.log(`shifting ${d} up:`, - min[d]);
					newV[d] = oldV[d] - min[d];
				} else if (max[d] > dim - 1) {
					// con.log(`shifting ${d} down:`, - (max[d] - dim + 1));
					newV[d] = oldV[d] - (max[d] - dim + 1);
				} else {
					newV[d] = oldV[d];
				}
				return newV;
			}

			// randomised rotation puts blocks outside of bounds,
			// shift them back into bounds using min and max.
			const shifted = vectors.map((oldV) => {
				var newV = {};
				shift(newV, oldV, "x");
				shift(newV, oldV, "y");
				shift(newV, oldV, "z");
				return newV;
			})

			const dimensions = calculateDimensions(shifted);

			return {structure: shifted, dimensions};
		});
		return {
			id,
			structure,
			transformations,
		}
	}

	const calculateDimensions = (structure) => {
		var w = 0, h = 0, d = 0;
		structure.forEach(({x, y, z}) => {
			w = Math.max(w, x + 1);
			h = Math.max(h, y + 1);
			d = Math.max(d, z + 1);
		});
		return {w, h, d};
	}


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
		const {id, transformations} = piece;
		const transformationIndex = Math.floor(Math.random() * piece.transformations.length);
		const transformation = transformations[transformationIndex];
		const { dimensions, structure } = transformation;

		// con.log('piece', dimensions, structure);

		const p = position(dim);

		const hex = colours.getNextColour();
		const mutated = colours.mutateColour(hex, 30);
		const colour = Number("0x" + mutated.substr(1));

		// trial container to dump blocks in and transform them
		const containerTest = new THREE.Group();
		// post transformation, get transformed coordinates and create blocks in here.
		const containerReal = new THREE.Group();

		holder.add(containerTest);
		holder.add(containerReal);

		// offset the container within the grid.
		const ox = rand.getInteger(0, dim - dimensions.w);
		const oy = rand.getInteger(0, dim - dimensions.h);
		const oz = rand.getInteger(0, dim - dimensions.d);

		const shifted = structure.map(({x, y, z}) => {
			return {
				x: x + ox,
				y: y + oy,
				z: z + oz,
			};
		})

		shifted.forEach((v) => {
			const positionIndex = getIndexFromPosition(v);
			populate(test, positionIndex);
		});

		// con.log("test", test);
		// check if any space has more than one block!
		if (test.some((item) => item > 1)) {
			return;// con.log("invalid!");
		}
		// if we get here we're good!

		const hue = id * 0.1 + Math.random() * 0.1;
		con.log("adding id", id, "at transformationIndex", transformationIndex);

		// populate real and draw a block.!
		shifted.forEach((v) => {
			available--;
			const {x, y, z} = v;
			const c = cube(0.95);
			c.position.set(p(x), p(y), p(z));
			// c.material.color.setHex(`0x${id * 50}ff50`);
			// c.material.color.setHSL(id / layouts.length, 0.5, 0.5);
			c.material.color.setHSL(hue, 0.7, 0.3);
			containerReal.add(c);
			const positionIndex = getIndexFromPosition(v);
			populate(occupied, positionIndex);
		});

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

		controls = new THREE.OrbitControls( camera, renderer.domElement );

		holder = new THREE.Group();
		scene.add(holder);

		pieces = layouts.map(calculateRotations);
		// con.log("pieces", pieces);

		// generate grid dots
		let p = position(dim + 1);
		for (var i = 0; i < Math.pow(dim + 1, 3); i++) {
			var c = cube(0.1);
			var {x, y, z} = getPositionFromIndex(dim + 1)(i);
			c.position.set(p(x) - size / 2, p(y) - size / 2, p(z) - size / 2);
			c.material.color.setHex(0xff7700);
			cubes.push(c);
			holder.add(c);
		}

		stage.appendChild(renderer.domElement);

		// document.addEventListener( 'keydown', onKeyDown, false );

		render();

		animate();
		attemptBlock();
	}

	let a = 0;
	const attemptBlock = () => {
		getBlock();
		if (occupied.every((item) => item === 1)) {
			return con.log("holy fucking shit! we're done here!!", occupied);
		}
		// con.log(available, occupied);
		a++
		if (a > 1000) return con.log("bailing!", available, occupied);
		setTimeout(attemptBlock, 20);
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
		controls.update();
		camera.lookAt( scene.position );
		renderer.render( scene, camera );
	}

	const animate = () => {
		requestAnimationFrame( animate );
		render();
	}

	return {stage, init};
});