var molecular_three = function() {

var camera, scene, renderer;
var mouse = {x: 0, y: 0};
var camPos = {x: 0, y: 0, z: 0};
var sw = window.innerWidth, sh = window.innerHeight;

function num(min, max) { return Math.random() * (max - min) + min; }

var segmentLength = 50;
var segmentRadius = 10;
var sphereRadius = segmentRadius * 1.2;


var attempts = 0;
var bail = 300;


var renderMessage = dom.element("div", {innerHTML: "rendering", style:{
	color:"white",
  position: "absolute",
  top: "10px",
  width: "100%",
  textAlign: "center",
}});

function sphere(props) {
	var widthSegments = 10, heightSegments = 10;
	var material = new THREE.MeshLambertMaterial({color: props.colour});
	var geometry = new THREE.SphereGeometry(props.radius, widthSegments, heightSegments);
	var object = new THREE.Mesh(geometry, material);
	return object;
}

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

function getEndsCylinder(cylinder) {

	var numVertices = cylinder.object.geometry.vertices.length;

	/*
	for (var k = 0, kl = c.geometry.vertices.length; k < kl; k++) {
		var v = c.geometry.vertices[k];
		var s = sphere({radius: 1});
		scene.add(s);
		s.position.set(v.x, v.y, v.z);
		con.log(v);
	}
	*/

	// var e0 = cylinder.object.geometry.vertices[numVertices - 1];
	// {
	// 	x: e0.x + cylinder.object.position.x,
	// 	y: e0.y + cylinder.object.position.y,
	// 	z: e0.z + cylinder.object.position.z
	// }

	var e1 = cylinder.object.geometry.vertices[numVertices - 2];
	// con.log(e0,e1)
	var end = new THREE.Vector3(
		e1.x + cylinder.object.position.x,
	  e1.y + cylinder.object.position.y,
		e1.z + cylinder.object.position.z
	);

	return end;
}

var holder;
var vectors = [];
var generationComplete = false;

function init() {

	colours.getRandomPalette();

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x000000, 0.0015);

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

	// holder.position.y = -100;


	function drawSection(c, v) {

		var colour = colours.mutateColour(c.colour, 50);

		var c2 = cylinder({radius: segmentRadius, height: segmentLength, colour: colour});
		c2.group.position.set(v.x, v.y, v.z);
		c2.group.rotation.z = num(-0.5, 0.5) * 0.2 * Math.PI * (attempts / bail * 6);
		c2.group.rotation.y = num(0, 2) * Math.PI;

		var end = getEndsCylinder(c2);
		var endSphere = sphere({radius: 3, colour: 0xff0000}); // this is just the point to draw.
		endSphere.position.set(end.x, end.y, end.z);
		c2.group.add(endSphere);

		c.group.add(c2.group);

		c.group.updateMatrixWorld();

		var globalPosition = new THREE.Vector3();
		globalPosition.setFromMatrixPosition(endSphere.matrixWorld);

		c2.group.remove(endSphere); // done with calc ditch it... 
		

		var st = new Date().getTime();
		var distance;
		var distanceOk = true;
		for (var i = 0, il = vectors.length; i < il && distanceOk; i++) {

			if (globalPosition == vectors[i]) con.log("same one", globalPosition, vectors[i]);

			distance = globalPosition.distanceTo(vectors[i]);
			if (distance < segmentLength - 5) {
				distanceOk = false;
			}
		};
		var en = new Date().getTime();
		var proc = en - st;
		if (proc > 3) con.warn("proc time = ", proc);
		if (distanceOk) {

			vectors.push(globalPosition);

			// colour = colours.mutateColour(colour, 30);

			var s = sphere({radius: sphereRadius, colour: colour});
			s.position.set(globalPosition.x, globalPosition.y, globalPosition.z);
			holder.add(s);

			return c2;

		} else {

			// con.warn("bad distance", distance);

			c2.group.remove(endSphere);
			c.group.remove(c2.group);

			return null;
			
		}

	}


	function addSection(c) {
		attempts ++;

		if (attempts < bail) {

			renderMessage.innerHTML = "Rendering " + Math.round(attempts/bail * 100) + "%";

			var v = getEndsCylinder(c);

			var kids = parseInt(num(1, 3));
			for (var i = 0; i < kids; i++) {

				var c2 = drawSection(c, v);

				if (c2) {

					(function(a, parent) {
						var timeout = a * 10;
						// con.log("timeout", timeout);
						setTimeout(function() {
							addSection(parent);
						}, timeout);
					})(attempts, c2);
				

				} else {
					// con.log("this one ends here!");
				}


			};
		} else {
			generationComplete = true;
			// con.log(vectors);
			if (renderMessage) document.body.removeChild(renderMessage);
			renderMessage = null;
		}

	}

	var colour = colours.getRandomColour();

	var seeds = 32;//parseInt(num(1, 10));

	for (var j = 0; j < seeds; j++) {

	
		var c = cylinder({radius: segmentRadius, height: segmentLength, colour: colour});
		c.group.rotation.set(num(0,2) * Math.PI, num(0,2) * Math.PI, num(0,2) * Math.PI);
		holder.add(c.group);

		var end = getEndsCylinder(c);
		var endSphere = sphere({radius: sphereRadius, colour: colour});
		endSphere.position.set(end.x, end.y, end.z);
		c.group.add(endSphere);

		addSection(c);
	};

	
	// addSection(c);

	document.body.appendChild(renderer.domElement);
	document.body.appendChild(renderMessage);


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

define("molecular_three", molecular_three);