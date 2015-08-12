var molecular_three = function() {

var camera, scene, renderer;
var mouse = {x: 0, y: 0};
var camPos = {x: 0, y: 0, z: 0};
var sw = window.innerWidth, sh = window.innerHeight;

function num(min, max) { return Math.random() * (max - min) + min; }

con.log(colours);

var segmentIndex = 0;
var segmentLength = 200;
var segmentsInitial = 1;

function sphere(props) {
	var widthSegments = 10, heightSegments = 10;
	var material = new THREE.MeshLambertMaterial({color: 0xf0a0a0});
	var geometry = new THREE.SphereGeometry(props.radius, widthSegments, heightSegments);
	var object = new THREE.Mesh(geometry, material);
	return object;
}

function cylinder(props) {
	var group = new THREE.Group();
	var material = new THREE.MeshLambertMaterial({color: props.colour});
	//radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, thetaStart, thetaLength
	var geometry = new THREE.CylinderGeometry(props.radius, props.radius, props.height, 14 );
	var object = new THREE.Mesh(geometry, material);
	object.position.y = props.height / 2;
	group.add(object);
	return {
		colour: props.colour,
		group: group,
		object: object
	};
}

function getEndsCylinder(cylinder) {
	var numVertices = cylinder.object.geometry.vertices.length;
	var e0 = cylinder.object.geometry.vertices[numVertices - 1];
	var e1 = cylinder.object.geometry.vertices[numVertices - 2];
	// con.log(e0,e1)
	return [{
		x: e0.x + cylinder.object.position.x,
		y: e0.y + cylinder.object.position.y,
		z: e0.z + cylinder.object.position.z
	},{
		x: e1.x + cylinder.object.position.x,
		y: e1.y + cylinder.object.position.y,
		z: e1.z + cylinder.object.position.z
	}]
}

var holder;

function init() {

	colours.getRandomPalette();

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 100, sw / sh, 1, 10000 );
	scene.add(camera);



	var lightAbove = new THREE.DirectionalLight(0xffffff, 0.5);
	lightAbove.position.set(0, 200, 100);
	scene.add(lightAbove);

	var lightLeft = new THREE.DirectionalLight(0xffffff, 1);
	lightLeft.position.set(-100, 0, 100);
	scene.add(lightLeft);

	renderer = new THREE.WebGLRenderer({antialias: true});
	renderer.setSize( sw, sh );

	holder = new THREE.Group();
	scene.add(holder);

	// holder.position.y = -100;

	var attempts = 0;
	var bail = 140;

	function addSection(c) {

		/*
		for (var k = 0, kl = c.geometry.vertices.length; k < kl; k++) {
			var v = c.geometry.vertices[k];
			var s = sphere({radius: 1});
			scene.add(s);
			s.position.set(v.x, v.y, v.z);
			con.log(v);
		}
		*/

		var ends = getEndsCylinder(c);

		// var v = ends[0];
		// var s = sphere({radius: 5});
		// c.group.add(s);
		// s.position.set(v.x, v.y, v.z);

		var v = ends[1];
		// var s = sphere({radius: 3});
		// c.group.add(s);
		// s.position.set(v.x, v.y, v.z);


		// c = c2;

		attempts ++;

		if (attempts < bail) {
			var kids = parseInt(num(1, 3));
			for (var i = 0; i < kids; i++) {

				var colour = colours.mutateColour(c.colour, 30);

				var c2 = cylinder({radius: 2, height: 20, colour: colour});
				c2.group.position.set(v.x, v.y, v.z);
				c2.group.rotation.z = num(-0.5, 0.5) * Math.PI;
				c2.group.rotation.y = num(0, 2) * Math.PI;
				c.group.add(c2.group);

				(function(a, parent) {
					setTimeout(function() {
						addSection(parent);
					}, a * 10);
				})(attempts, c2);
			};
		}

	}

	var seeds = 13;

	for (var j = 0; j < seeds; j++) {

		var colour = colours.getRandomColour();

		var c = cylinder({radius: 2, height: 20, colour: colour});
		c.group.rotation.set(num(0,2) * Math.PI, num(0,2) * Math.PI, num(0,2) * Math.PI);
		holder.add(c.group);

		addSection(c);
	};

	
	// addSection(c);

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

	if (time > 10000 && holder.rotation.y < Math.PI * 2)holder.rotation.y += 0.01;

	// camPos.x = mouse.x * 100;
	// camPos.y = mouse.y * 100;
	camPos.z = 150;
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

define("molecular_three", molecular_three);