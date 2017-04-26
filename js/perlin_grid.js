var perlin_grid = function(noise) {

	var stage = document.createElement("div");

	var camera, scene, renderer;
	var mouse = {x: 0, y: 0};
	var camPos = {x: 0, y: 0, z: 10};
	var sw = window.innerWidth, sh = window.innerHeight;

	var speed = 4;
	var size = {
		width: 300,
		height: 100,
		depth: 300,
	}
	var edgeSize = 40;
	var gridUnits = 7;
	var gridAbove = [];
	var gridBelow = [];
	var seed = Math.random();

 	function cube(props) {

 		// too late at night to start shader code

		// var colours = {
		// 	slow: {
		// 		r : num(0, 0.2),
		// 		g : num(0.5, 0.9),
		// 		b : num(0.3, 0.7) 
		// 	},
		// 	fast: {
		// 		r: num(0.9, 1.0),
		// 		g: num(0.1, 0.7),
		// 		b: num(0.2, 0.5)
		// 	}
		// }

		// var uniforms = {
		// 	r: { type: "f", value: colours.slow.r},
		// 	g: { type: "f", value: colours.slow.g},
		// 	b: { type: "f", value: colours.slow.b},
		// 	distanceX: { type: "f", value: 1.0},
		// 	distanceZ: { type: "f", value: 1.0},
		// 	pulse: { type: "f", value: 0},
		// 	speed: { type: "f", value: speed},
		// };

		// var material = new THREE.ShaderMaterial( {
		// 	uniforms: uniforms,
		// 	vertexShader: vertexShader,
		// 	fragmentShader: fragmentShader
		// });
		const material = new THREE.MeshPhongMaterial({
			color: props.colour,
			emissive: 0x803000,
		});

		var geometry = new THREE.BoxGeometry(props.width, props.height, props.depth);
		var object = new THREE.Mesh(geometry, material);
		// object.colours = colours;
		return object;
	}

	const draw = (x, z) => {

		var colour = x * 40 << 16 | z * 30 << 8 | 0; // very advanced colouring

		var vertProps = {
			width: edgeSize, 
			height: size.height, 
			depth: edgeSize,
			colour
		}
		var distance = size.width / 2 - edgeSize; // only because size.width == size.depth
		var holder = new THREE.Group();
		var verticalEdgeBL = cube(vertProps); // back left
		verticalEdgeBL.position.set(-distance, 0, -distance)
		holder.add(verticalEdgeBL);
		var verticalEdgeBR = cube(vertProps);
		verticalEdgeBR.position.set(distance, 0, -distance)
		holder.add(verticalEdgeBR);
		var verticalEdgeFL = cube(vertProps);
		verticalEdgeFL.position.set(-distance, 0, distance)
		holder.add(verticalEdgeFL);
		var verticalEdgeFR = cube(vertProps);
		verticalEdgeFR.position.set(distance, 0, distance)
		holder.add(verticalEdgeFR); // front right

		var horizProps = {
			width: size.width - edgeSize, 
			height: edgeSize,
			depth: edgeSize,
			colour
		}
		var horizontalEdgeF = cube(horizProps);
		horizontalEdgeF.position.set(0, size.height - edgeSize, -distance)
		holder.add(horizontalEdgeF);
		var horizontalEdgeB = cube(horizProps);
		horizontalEdgeB.position.set(0, size.height - edgeSize, distance)
		holder.add(horizontalEdgeB);

		return holder;
	}


	function init() {

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera( 90, sw / sh, 1, 10000 );
		camera.position.set( 0, 100, 500 );
		scene.add( camera );

		var light = new THREE.DirectionalLight( 0xffffff, 2 );
		light.position.set( 1, 1, 1 ).normalize();
		scene.add( light );

		var light = new THREE.DirectionalLight( 0xff00ff, 2 );
		light.position.set( -1, 0, 0 ).normalize();
		scene.add( light );

		renderer = new THREE.WebGLRenderer();
		// renderer.sortObjects = false;
		renderer.setSize( sw, sh );

		for (var x = 0; x < gridUnits; x++) {
			for (var z = 0; z < gridUnits; z++) {
				var px = (x - gridUnits / 2 + 0.5) * size.width;
				var py = 0;
				var pz = (z - gridUnits / 2 + 0.5) * size.depth;
				var boxAbove = draw(x, z, 1);
				boxAbove.position.set(px, py, pz);
				scene.add(boxAbove);
				var boxBelow = draw(x, z, -1);
				boxBelow.position.set(px, py, pz);
				boxBelow.rotation.set(Math.PI, Math.PI / 2, 0);
				scene.add(boxBelow);
				gridAbove.push(boxAbove);
				gridBelow.push(boxBelow);
			}
		}

		stage.appendChild(renderer.domElement);

		animate(0);
	}

	function listen(eventNames, callback) {
		for (var i = 0; i < eventNames.length; i++) {
			window.addEventListener(eventNames[i], callback);
		}
	}
	listen(["resize"], function(e){
		sw = window.innerWidth;
		sh = window.innerHeight
		camera.aspect = sw / sh;
		camera.updateProjectionMatrix();
		renderer.setSize(sw, sh);
	});
	listen(["mousedown", "touchstart"], function(e) {
		e.preventDefault();
		isMouseDown = true;
	});
	listen(["mousemove", "touchmove"], function(e) {
		e.preventDefault();
		if (e.changedTouches && e.changedTouches[0]) e = e.changedTouches[0];
		mouse.x = (e.clientX / sw) * 2 - 1;
		mouse.y = -(e.clientY / sh) * 2 + 1;
	});
	listen(["mouseup", "touchend"], function(e) {
		e.preventDefault();
		isMouseDown = false;
	});


	function render(time) {

		for (var y = 0; y < gridUnits * 2; y++) { // using double high grid, first half is top, 2nd half is bottom
			for (var x = 0; x < gridUnits; x++) {
			
				var value = (noise.perlin3(x / gridUnits, y / gridUnits, seed) + 1) / 2;
				value = value * value * value * value; // power the fuck

				var gridIndex = (x + y * gridUnits);
				var scale = 1 + value * 50;

				if (y < gridUnits) {
					gridAbove[gridIndex].position.y = scale * size.height / 2;
				} else {
					gridBelow[gridIndex - gridUnits * gridUnits].position.y = -scale * size.height / 2;
				}
			}
		}
		seed += 0.01;

		camPos.x -= (camPos.x - mouse.x * 1) * 0.02;
		camPos.y -= (camPos.y - mouse.y * 1000) * 0.05;
		var rotY = time * 0.001 + camPos.x;
		camera.position.set(Math.sin(rotY) * 1200, camPos.y, Math.cos(rotY) * 1200);

		camera.lookAt( scene.position );

		renderer.render( scene, camera );

	}

	function animate(time) {
		requestAnimationFrame( animate )
		render(time);
	}

	return {
		init,
		stage
	};

};

define("perlin_grid", ["noise"], perlin_grid);