var pine_three = function() {

var camera, scene, renderer;
var mouse = {x: 0, y: 0};
var camPos = {x: 0, y: 0, z: 0};
var sw = window.innerWidth, sh = window.innerHeight;

function num(min, max) { return Math.random() * (max - min) + min; }

var branchingAngle = num(0, 10);

var holder;
var vectors = [];
var generationComplete = false;

var attempts = 0;
var bail = 300;

function cylinder(props) {
	var group = new THREE.Group();
	var material = new THREE.MeshLambertMaterial({color: props.colour});
	//radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, thetaStart, thetaLength
	var geometry = new THREE.CylinderGeometry(props.radius, props.radius, props.height, 15);
	var object = new THREE.Mesh(geometry, material);
	object.position.y = props.height / 2;
	group.add(object);
	return {
		colour: props.colour,
		group: group,
		object: object
	};
}

function init() {

	colours.getRandomPalette();

	scene = new THREE.Scene();
	// scene.fog = new THREE.FogExp2(0x000000, 0.0015);

	camera = new THREE.PerspectiveCamera( 80, sw / sh, 1, 10000 );
	scene.add(camera);

	var lightAbove = new THREE.DirectionalLight(0xffffff, 1.5);
	lightAbove.position.set(0, 200, 100);
	scene.add(lightAbove);

	var lightLeft = new THREE.DirectionalLight(0xffffff, 4);
	lightLeft.position.set(-100, 0, 100);
	scene.add(lightLeft);

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize( sw, sh );

	holder = new THREE.Group();
	scene.add(holder);

	var segmentRadius = 10, segmentLength  = 50;

	function drawSection(parent, endPoint) {
		var colour = colours.mutateColour(parent.colour, 50);
		var child = cylinder({radius: segmentRadius, height: segmentLength, colour: colour});
		// child.group.position.set(endPoint.x, endPoint.y, endPoint.z);
		// child.group.rotation.z = num(-0.5, 0.5) * 2 * Math.PI * attempts / bail * branchingAngle;
		// child.group.rotation.y = num(0, 2) * Math.PI;
		parent.group.add(child.group);
		parent.group.updateMatrixWorld();
		return child;
	}

	var colour = colours.getRandomColour();

	var endPoint = new THREE.Vector3(0, 0, 0);

	var baseSection = {
		colour: colour,
		group: holder
	}

	var one = drawSection(baseSection, endPoint);

	document.body.appendChild(renderer.domElement);

/*
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
	listen(["mousemove", "touchmove"], function(e) {
		e.preventDefault();
		if (e.changedTouches && e.changedTouches[0]) e = e.changedTouches[0];
		mouse.x = (e.clientX / sw) * 2 - 1;
		mouse.y = -(e.clientY / sh) * 2 + 1;
	});
*/

	render(0);

}



function render(time) {

	//if (time > 10000 && holder.rotation.y < Math.PI * 2)
	if (generationComplete) {
		holder.rotation.y += 0.01;
	}

	// camPos.x = mouse.x * 100;
	// camPos.y = mouse.y * 100;
	camPos.z = 1000;
	camera.position.set(camPos.x, camPos.y, camPos.z);
	camera.lookAt( scene.position );
	renderer.render( scene, camera );
	requestAnimationFrame( render );
}

return {
	init: init,
	resize: function() {}
}

};

define("pine_three", pine_three);