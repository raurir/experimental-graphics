



var camera, scene, projector, renderer, group;
var mouse = { x: 0, y: 0 };
var sw = window.innerWidth, sh = window.innerHeight;
var theta = 0;
var cols = 30;
var rows = 16;
var gap = 20;
var size = {
	width: 100,
	height: 30,
	depth: 200,
}
var boxes = [];
var boxes1d = [];


function draw(props) {
	var col = 0x909090;

	function num(min, max) { return Math.random() * (max - min) + min; }

  var uniforms = {
    // time: { type: "f", value: 1.0 },
    // index: { type: "f", value: i / il},
    // resolution: { type: "v2", value: new THREE.Vector2() },
    red: { type: "f", value: num(0, 0.2) },
    green: { type: "f", value:num(0.5, 0.9)},
    blue: { type: "f", value: num(0.3, 0.7) },
    distance: { type: "f", value: 1.0},
  };

  var material = new THREE.ShaderMaterial( {
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader
  });


	// con.log("CustomMaterial:", THREE.CustomMaterial);
	// var material = new THREE.CustomMaterial( { color: col } );
	var material = new THREE.MeshLambertMaterial({ color: col });
	var geometry = new THREE.BoxGeometry(props.width, props.height, props.depth);
	var object = new THREE.Mesh(geometry, material);
	return object;
}

function getX(xi) {
	return (xi - cols / 2) * (size.width + gap);
};

function getZ(zi) {
	return zi * (size.depth + gap);
};

var emptySlot = "emptySlot";


function init() {

	scene = new THREE.Scene();
	// scene.fog = new THREE.FogExp2(0x002000, 0.001);

	camera = new THREE.PerspectiveCamera( 100, sw / sh, 1, 10000 );
	camera.position.set( 0, 300, 500 );
	scene.add( camera );

	var lightAbove = new THREE.DirectionalLight(0xff8080, 2);
	lightAbove.position.set(0, 1, 0.25).normalize();
	scene.add( lightAbove );

	lightAbove.castShadow = true;

	var lightBelow = new THREE.DirectionalLight(0x002000, 2);
	lightBelow.position.set(0, -1, 0.25).normalize();
	scene.add( lightBelow );

	var lightLeft = new THREE.DirectionalLight(0xff0000, 4);
	lightLeft.position.set(-1, 1, 0.25).normalize();
	scene.add( lightLeft );

	var lightRight = new THREE.DirectionalLight(0x80ffff, 1);
	lightRight.position.set(1, 1, 0.25).normalize();
	scene.add( lightRight );

	group = new THREE.Group();
	scene.add(group);

	renderer = new THREE.WebGLRenderer({antialias: true});
	// renderer.sortObjects = false;
	renderer.setSize( sw, sh );

	// renderer.setClearColor( scene.fog.color );


	boxes = {
		bottom: [],
		top: []
	};

	for (var j = 0, jl = rows; j < jl; j++) {
		boxes.bottom[j] = [];
		boxes.top[j] = [];
		for (var i = 0, il = cols; i < il; i++) {
			boxes.bottom[j][i] = emptySlot;
			boxes.top[j][i] = emptySlot;
		};
	};

	var created = 0;
	function createBox() {
		var xi = Math.floor(Math.random() * cols), xai = xi;// + cols / 2;
		var yi = Math.random() > 0.5 ? 1 : -1, yai = yi === -1 ? "bottom" : "top";
		var zi = Math.floor(Math.random() * rows), zai = zi;

		var x = getX(xi);
		var y = yi * 200;
		var z = getZ(zi);

		if (boxes[yai][zai][xai] === emptySlot) {
			created++;
			var box = draw(size);
			// box.position.set(x, y, z);
			box.position.y = y;
			box.isWarping = false;
			box.offset = {x: x, z: 0};
			box.posZ = z;
			// box.rotation.set(0, 0, i * 0.2);
			boxes[yai][zai][xai] = box;

			boxes1d.push(box);

			group.add(box);
		}
	}


	for (var i = 0, il = rows * cols; i < il; i++) {
		createBox();
	};

	document.body.appendChild(renderer.domElement);

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

}

function onDocumentMouseMove( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / sw ) * 2 - 1;
	mouse.y = - ( event.clientY / sh ) * 2 + 1;
}

var posZ = 0;

function render(time) {

	theta += 0.01;

	var camRadius = 10;
	var speed = isMouseDown ? 0 : 6;

	var zDistance = rows * (size.depth + gap);

	function move(x, y, z) {
		var box = boxes[y][z][x];

		if (box !== emptySlot) {

			box.position.x = box.offset.x;
			box.position.z = box.offset.z + box.posZ;

			if (box.position.z > 0) {
				box.posZ -= zDistance;
			} else {
				// box.posZ += speed;
			}

			// return;
			if (isMouseDown) return;
			if (!box.isWarping) {
				if (Math.random() > 0.999) {
					// con.log("do it");

					var dir = Math.floor(Math.random() * 4), xn = x, zn = z, xo = 0, zo = 0;
					switch (dir) {
						case 0 : xn++; xo = 1; break;
						case 1 : xn--; xo = -1; break;
						case 2 : zn++; zo = 1; break;
						case 3 : zn--; zo = -1; break;
					}

					if (boxes[y][zn] && boxes[y][zn][xn] === emptySlot) {

						boxes[y][z][x] = emptySlot;

						box.isWarping = true;
						// box.position.x = getX(xn);
						// box.position.z = getZ(zn);

						boxes[y][zn][xn] = box;

						// con.log( box.offset.x,  box.offset.z);

						TweenMax.to(box.offset, 0.1, {
							x: box.offset.x + xo * (size.width + gap),
							z: box.offset.z + zo * (size.depth + gap),
							// x: getX(xn),
							// z: getZ(zn),
						});
						TweenMax.to(box.offset, 0.2, {
							onComplete: function() {
								box.isWarping = false;
							}
						});

					}
				}
			}

		}
	}



	var box;

	// con.log(boxes);

	for (var b = 0, bl = boxes1d.length; b < bl; b++) {
		boxes1d[b].posZ += speed;

		// normalized distance from camera
		var distance = 1 - ((zDistance-boxes1d[b].posZ) / (zDistance) - 1);

		// boxes1d[b].material.uniforms.distance.value = distance;
		// if (b ==0) con.log(zDistance, distanceFromCamera)
	}

	for (var j = 0, jl = rows; j < jl; j++) { // iterate through rows: z
		for (var i = 0, il = cols; i < il; i++) { // iterate throw cols: x
			// move(boxes.bottom[j][i]);
			// move(boxes.top[j][i]);
			move(i, "bottom", j);
			move(i, "top", j);
		};
	};

	// camera.position.set(
	// 	-700,//camRadius * Math.sin(theta),
	// 	100,//mouse.y * -20,
	// 	700//camRadius * Math.cos(theta * Math.PI / 360)
	// );

	camera.position.set(
		mouse.x * -20,
		0,
		10
	);

	camera.lookAt( scene.position );

	// camera.rotation.z = time * 0.0001;
	// camera.rotation.y = -Math.PI / 2;//-= mouse.x * 0.1;

	renderer.render( scene, camera );

	requestAnimationFrame( render );
}

function animate() {
	render(0);
}

var isMouseDown = false;

setTimeout(function() {

	window.addEventListener("mousedown", function() {
		isMouseDown = !isMouseDown;
	});

	// require(["three_custom_material"], function(b) {

		// con.log(THREE.CustomMaterial);

	init();
	animate();

	// })

},100);




var vertexShader = [
"varying vec2 vUv;",
"void main()",
"{",
"  vUv = uv;",
"  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );",
"  gl_Position = projectionMatrix * mvPosition;",
"}"].join("");

var fragmentShader = [
// "uniform float time;",
"uniform float red;",
"uniform float green;",
"uniform float blue;",
"uniform float distance;",

"varying vec2 vUv;",

"void main( void ) {",
"  vec2 position = abs(-1.0 + 2.0 * vUv);",
"  float edging = abs((pow(position.y, 5.0) + pow(position.x, 5.0)) / 2.0);",
"  float perc = (0.2 + edging * 0.6) * distance;",
"  float r = red * perc;",
"  float g = green * perc;",
"  float b = blue * perc;",
"  gl_FragColor = vec4( r, g, b, 1.0 );",
"}"].join("");

