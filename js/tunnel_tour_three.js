var tunnel_tour_three = function() {

var camera, scene, renderer;
var sw = window.innerWidth, sh = window.innerHeight;
var light1, light2, light3;
var mouse = {x: 0, y: 0};
var isMouseDown = false;
var bits = 20;
var layers = 50;
var size = 15
var radius = 200;
var groups = [];
var camZ = 100;

function groupRotation(index, time) {
	return Math.floor(index * 0.015 + time * 0.00025) / bits * Math.PI;
}

function init() {

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0xd0d0d0, 0.0006);

	camera = new THREE.PerspectiveCamera(80, sw / sh, 1, 10000);
	scene.add( camera );

	var lightwhite = new THREE.DirectionalLight(0xffffff, 1.5);
	lightwhite.position.set(0, 0, 200);
	scene.add(lightwhite);

	light1 = new THREE.DirectionalLight(0xff90ff, 1);
	scene.add(light1);

	light2 = new THREE.DirectionalLight(0x0080ff, 1);
	scene.add(light2);

	light3 = new THREE.DirectionalLight(0xf080ff, 1);
	scene.add(light3);

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize(sw, sh);
	renderer.setClearColor(scene.fog.color);

	for (var j = 0, jl = layers; j < jl; j++) {
		var group = new THREE.Group();
		group.position.set(0, 0, j * -100);
		group.rotation.z = groupRotation(j, 0);
		for (var i = 0; i < bits; i++) {
			var a = (j % 2 * 0.5 + i) / bits * Math.PI * 2;
			var material = new THREE.MeshLambertMaterial({color: 0xa0a0a0});
			var geometry = new THREE.BoxGeometry(size, size, size);
			var box = new THREE.Mesh(geometry, material);
			box.position.set(Math.sin(a) * radius, Math.cos(a) * radius, 0);
			box.rotation.set(0, 0, -a);
			group.add(box);
		};
		scene.add(group);
		groups[j] = group;
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
	listen(["mousedown", "touchstart"], function(e) {
		e.preventDefault();
		isMouseDown = true;
	});
	listen(["mouseup", "touchend"], function(e) {
		e.preventDefault();
		isMouseDown = false;
	});

	render(0);
}

function render(time) {

	camZ -= (camZ - (isMouseDown ? -3000 : 100)) * 0.01;
 
	camera.position.set(Math.sin(time * 0.001) * 100, Math.cos(time * 0.00101) * 100, camZ);
	light1.position.set(Math.cos(time * -0.0001) * 200, Math.sin(time * -0.0001) * 200, 0);
	light2.position.set(Math.sin(1 + time * -0.0003) * 200, Math.cos(1 + time * -0.0003) * 200, 0);
	light3.position.set(Math.sin(2 + time * -0.0004) * 200, Math.cos(2 + time * -0.0004) * 200, 0);
	renderer.render( scene, camera );
	requestAnimationFrame( render );

	for (var j = 0, jl = layers; j < jl; j++) {
		var group = groups[j];
		var gr = groupRotation(j, time);
		group.rotation.z -= (group.rotation.z - gr) * 0.1;
	};
}

return {
	init: init,
	resize: function() {}
}

};

define("tunnel_tour_three", tunnel_tour_three);