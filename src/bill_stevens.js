// must solve this for...
define("bill_stevens", () => { // ... and jan

	const stage = document.createElement("div");

	const RIGHT_ANGLE = Math.PI / 2;

	var camera, controls, scene, projector, renderer, holder, lights;
	const mouse = { x: 0, y: 0 };
	const sw = window.innerWidth, sh = window.innerHeight;
	const dim = 4;
	const size = 30;
	const cubes = [];

	let available = Math.pow(dim, 3);
	const occupied = Array(available).fill(0);
	const solution = Array(available).fill(null);

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

	// comments behind ids are where structure is in source photo
	const layouts = [
		{
			id: 0, // top left
			structure: [
				[
					[1,1],
					[1,0],
				],[
					[0,1],
					[0,0],
				]
			]
		},

		{
			id: 1, // middle left
			structure: [
				[
					[1,1,1],
					[0,1,0],
				],[
					[0,0,0],
					[0,1,0],
				]
			]
		},

		{
			id: 2, // bottom left
			structure: [
				[
					[0,1,1],
					[0,1,0],
				],[
					[0,0,0],
					[1,1,0],
				]
			]
		},

		{
			id: 3, // top 2nd from left
			structure: [
				[
					[1,1,0],
					[0,1,0],
				],[
					[0,1,1],
					[0,0,0],
				]
			]
		},

		{
			id: 4, // middle 2nd from left
			structure: [
				[
					[0,1,1],
					[1,1,0],
				],[
					[0,0,1],
					[0,0,0],
				]
			]
		},

		{
			id: 5, // bottom 2nd from left
			structure: [
				[
					[1,1,1],
					[1,0,0],
				],[
					[0,0,1],
					[0,0,0],
				]
			]
		},

		{
			id: 6, // top centre
			structure: [
				[
					[1,1,0],
					[0,1,1],
					[0,0,1],
				]
			]
		},

		{
			id: 7, // top 2nd from right
			structure: [
				[
					[1,1,1],
					[1,0,0],
				],[
					[0,1,0],
					[0,0,0],
				],
			]
		},

		{
			id: 8, // middle 2nd from right
			structure: [
				[
					[1,1,1],
					[0,1,0],
				],[
					[0,1,0],
					[0,0,0],
				],
			]
		},

		{
			id: 9, // bottom 2nd from right
			structure: [
				[
					[1,1,0],
					[0,1,1],
					[0,1,0],
				],
			]
		},

		{
			id: 10, // top right
			structure: [
				[
					[0,1,0],
					[1,1,1],
					[0,1,0],
				],
			]
		},

		{
			id: 11, // middle right
			structure: [
				[
					[1,1,1],
					[0,0,1],
				],[
					[0,0,1],
					[0,0,0],
				],
			]
		},

		{
			id: 12, // bottom right
			structure: [
				[
					[1,0,0],
					[1,1,1],
				],[
					[1,0,0],
					[0,0,0],
				],
			]
		},

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
		const transformations = [];
		rotations.map(([rx, ry, rz], rotationIndex) => {

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

			// check to see if this rotation is the same as any previous rotations
			const duplicate = transformations.filter((transformation, ti) => {
				// iterate through every previously stored transformation and check all vertices are againt 
				// the new transformation
				const allPointsSame = transformation.structure.every((A, index) => {
					const B = shifted[index];
					return A.x === B.x && A.y === B.y && A.z === B.z;
				})
				// if(allPointsSame) {
				// 	con.log(allPointsSame, ti, transformation.structure, shifted);
				// }
				return allPointsSame;
			})

			holder.remove(containerTest);

			if (transformations.length && duplicate.length > 0) {
				// con.log("transformations.. duplicate::", rotationIndex, rx, ry, rz);
				// as you thought, rotation on z axis is not required. all unique transformations achieved by x and y...
				return;
			}
			// con.log("transformations.. unique::", rotationIndex, rx, ry, rz);
			const dimensions = calculateDimensions(shifted);
			transformations.push({structure: shifted, dimensions});
		});

		con.log("transformations", transformations.length)

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
		const material = new THREE.MeshPhongMaterial({
			color: 0,
			opacity: 0.5, //params.opacity,
			transparent: true
		});
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

		if (available == 59) {
			con.log("test", test)
		for (var i = 0; i < Math.pow(dim, 3); i++) {
			if (test[i] === 1) continue;
			const {x, y, z} = getPositionFromIndex(dim)(i);
			if (x > 0 && getIndexFromPosition({x: x - 1, y, z}) > 0) {
				console.log('fuck');//how the fuck?
			}


			con.log("available", i, x,y,z);
		}
		}



		// if we get here we're good!

		const hue = id * 0.1 + Math.random() * 0.1;
		con.log("adding id", id, "at transformationIndex", transformationIndex);

		// populate real and draw a block.!
		shifted.forEach((v) => {
			available--;
			const {x, y, z} = v;
			const c = cube(0.8);
			c.position.set(p(x), p(y), p(z));
			c.material.color.setHSL(hue, 0.7, 0.3);
			containerReal.add(c);
			const positionIndex = getIndexFromPosition(v);
			populate(occupied, positionIndex);
			solution[positionIndex] = id;
		});

	}

	const init = () => {

		colours.getRandomPalette();

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera( 50, sw / sh, 1, 10000 );
		camera.position.set( 0, 100, 500 );
		scene.add( camera );

		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  		scene.add(ambientLight);

		const light0 = new THREE.DirectionalLight( 0xffffff, 2 );
		light0.position.set( 1, 1, 1 ).normalize();
		scene.add( light0 );

		const light1 = new THREE.DirectionalLight( 0xffffff, 2 );
		light1.position.set( -1, 0, 0 ).normalize();
		scene.add( light1 );
		lights = [light0, light1];

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

		animate(0);
		attemptBlock();
	}

	let a = 0;
	const attemptBlock = () => {
		getBlock();
		if (occupied.every((item) => item === 1)) {
			return con.log("holy fucking shit! we're done here!!", solution);
		}
		// con.log(available, occupied);
		a++
		if (a > 1000) return con.log("bailing!", available, occupied, "\nsolved so far:\n", solution);
		setTimeout(attemptBlock, 1);
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

	const render = (time) => {

		const t = time * 0.001;
		lights.forEach((light, index)=> {
			light.position.set(
				200 * Math.sin(t * 0.19 + index * 0.11),
				200 * Math.cos(t * 0.20 + index * 0.09),
				200 * Math.cos(t * 0.22 + index * 0.10)
			);
		});

		controls.update();
		camera.lookAt( scene.position );
		renderer.render( scene, camera );
	}

	const animate = (time) => {
		requestAnimationFrame( animate );
		render(time);
	}

	return {stage, init};
});