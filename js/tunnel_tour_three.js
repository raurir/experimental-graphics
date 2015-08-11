var tunnel_tour_three = function() {


var camera, scene, renderer;
var mouse = {x: 0, y: 0};
var camPos = {x: 0, y: 0, z: 500};
var sw = window.innerWidth, sh = window.innerHeight;

function num(min, max) { return Math.random() * (max - min) + min; }

function init() {

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 100, sw / sh, 1, 10000 );
	scene.add( camera );

	var lightAbove = new THREE.DirectionalLight(0xffffff, 2);
	lightAbove.position.set(0, 199, 100);//.normalize();
	scene.add(lightAbove);

	var lightLeft = new THREE.DirectionalLight(0x0080ff, 2);
	lightLeft.position.set(-100, 0, 100);//.normalize();
	scene.add(lightLeft);

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize( sw, sh );

	function draw(props) {
		var material = new THREE.MeshLambertMaterial({color: 0xa0a0a0});
		var geometry = new THREE.BoxGeometry(props.width, props.height, props.depth);
		var object = new THREE.Mesh(geometry, material);
		return object;
	}

	var p = 10;

	function createStraight(groupPos) {
		var group = new THREE.Group();
		group.position.set(groupPos.x, groupPos.y, groupPos.z);

		p++;
		var bits = 20;//;//parseInt(num(3, 15));

		var size = {width: 20, height: 20, depth: 100};
		var radius = 200;//num(100, 200);

		for (var i = 0, il = bits; i < il; i++) {
			var a = ((p % 2 == 0 ? 0 : 0.5 / il) + i / il) * Math.PI * 2;
			var x = Math.sin(a) * radius;
			var y = Math.cos(a) * radius;
			var z = 0;
			var box = draw(size);
			box.position.set(x, y, z);
			box.rotation.set(0, 0, -a);
			group.add(box);
		};
		scene.add(group);
	}

	for (var j = 0, jl = 30; j < jl; j++) {
		createStraight({x: 0, y: 0, z: j * -150});
	};

	document.body.appendChild(renderer.domElement);


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
	// listen(["mousedown", "touchstart"], function(e) {
	// 	e.preventDefault();
	// 	isMouseDown = true;
	// });
	listen(["mousemove", "touchmove"], function(e) {
		e.preventDefault();
		if (e.changedTouches && e.changedTouches[0]) e = e.changedTouches[0];
		mouse.x = (e.clientX / sw) * 2 - 1;
		mouse.y = -(e.clientY / sh) * 2 + 1;
	});
	// listen(["mouseup", "touchend"], function(e) {
	// 	e.preventDefault();
	// 	isMouseDown = false;
	// });


	render(0);

}

function render(time) {

	camPos.x = mouse.x * 100;
	camPos.y = mouse.y * 100;
	camPos.z = 500;

	camera.position.set(camPos.x, camPos.y, camPos.z);
	camera.lookAt( scene.position );

	// camera.rotation.z = time * 0.0001;
	// camera.rotation.y = camPos.x / -1000;
	// camera.rotation.x = camPos.y / 1000;
	// camera.rotation.z = (camPos.x - mouse.x * 400) / 2000;

	renderer.render( scene, camera );

	// if (time < 800)
		requestAnimationFrame( render );
}

return {
	init: init,
	resize: function() {}
}

};

define("tunnel_tour_three", tunnel_tour_three);