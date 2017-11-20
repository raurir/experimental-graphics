define("cannon_demo", function() {
/* this is 99+% hacked from schteppe's demos */

var Demo = function(options){

	options = options || {};
	var that = this;

	// API
	this.create = create;
	this.start = start;

	// Global settings
	var settings = this.settings = {
		stepFrequency: 60,
		quatNormalizeSkip: 2,
		quatNormalizeFast: true,
		gx: 0,
		gy: 0,
		gz: 0,
		iterations: 3,
		tolerance: 0.0001,
		k: 1e6,
		d: 3,
		scene: 0,
		paused: false,
		rendermode: "solid",
		constraints: false,
		contacts: false,  // Contact points
		cm2contact: false, // center of mass to contact points
		normals: false, // contact normals
		axes: false, // "local" frame axes
		particleSize: 0.1,
		shadows: false,
		aabbs: false,
		profiling: false,
		maxSubSteps:3
	};


	if(settings.stepFrequency % 60 !== 0){
		throw new Error("stepFrequency must be a multiple of 60.");
	}

	var bodies = this.bodies = [];
	var visuals = this.visuals = [];
	var demo;

	var particleGeo = this.particleGeo = new THREE.SphereGeometry( 1, 16, 8 );

	// Material
	var solidMaterial = new THREE.MeshPhongMaterial({
	  color: 0x302c2a,
	  emissive: 0,
	  specular: 0x513a30,
	  shininess: 80
	})
	this.wireframeMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000, wireframe: true } );
	this.currentMaterial = solidMaterial;
	var particleMaterial = this.particleMaterial = new THREE.MeshLambertMaterial( { color: 0xff0000 } );


	// Create physics world
	var world = this.world = new CANNON.World();
	world.broadphase = new CANNON.NaiveBroadphase();

	var light, scene, ambient, stats, info;

	function create(initfunc){
		demo = initfunc;
	}

	function makeSureNotZero(vec){
		if(vec.x===0.0){
			vec.x = 1e-6;
		}
		if(vec.y===0.0){
			vec.y = 1e-6;
		}
		if(vec.z===0.0){
			vec.z = 1e-6;
		}
	}


	function updateVisuals(){
		var N = bodies.length;

		// Read position data into visuals
		for(var i=0; i<N; i++){
			var b = bodies[i], visual = visuals[i];
			visual.position.copy(b.position);
			if(b.quaternion){
				visual.quaternion.copy(b.quaternion);
			}
		}
	}

	var SHADOW_MAP_WIDTH = 512;
	var SHADOW_MAP_HEIGHT = 512;
	var MARGIN = 0;
	var SCREEN_WIDTH = window.innerWidth;
	var SCREEN_HEIGHT = window.innerHeight - 2 * MARGIN;
	var camera, controls, renderer;
	var container;
	var NEAR = 5, FAR = 2000;

	init();
	animate();

	function init() {

		container = document.getElementById("experiment-holder");

		// Camera
		camera = new THREE.PerspectiveCamera( 24, SCREEN_WIDTH / SCREEN_HEIGHT, NEAR, FAR );

		// camera.up.set(0, 0, 1);
		camera.position.set(0, -100, 50);
		// camera.position.set(0, 200, 150);
		// camera.position.set(200, 200, 200);

		// SCENE
		scene = that.scene = new THREE.Scene();
		scene.fog = new THREE.Fog( 0x222222, 1000, FAR );

		camera.lookAt( scene.position );

		// LIGHTS
		ambient = new THREE.AmbientLight( 0x222222 );
		scene.add( ambient );

		light = new THREE.SpotLight( 0xffffff );
		light.position.set( 30, -100, 40 );
		light.target.position.set( 0, 0, 0 );

		light.castShadow = true;

		light.shadow.camera.near = 10;
		light.shadow.camera.far = 100;
		// light.shadow.camera.fov = 30;

		// light.shadowMapBias = 0.0039;
		// light.shadowMapDarkness = 0.5;
		light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
		light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

		//light.shadowCameraVisible = true;

		scene.add( light );
		scene.add( camera );

		// RENDERER
		renderer = new THREE.WebGLRenderer( { clearColor: 0x000000, clearAlpha: 1, antialias: false } );
		renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );
		renderer.domElement.style.position = "relative";
		renderer.domElement.style.top = MARGIN + 'px';
		container.appendChild( renderer.domElement );

		document.addEventListener('mousemove',onDocumentMouseMove);
		window.addEventListener('resize',onWindowResize);

		// renderer.setClearColor( scene.fog.color, 1 );
		// renderer.autoClear = false;

		renderer.shadowMap.enabled = true;
		renderer.shadowMap.type = THREE.PCFSoftShadowMap;

		// Trackball controls
		if (options.trackballControls) {
			controls = new THREE.TrackballControls( camera, renderer.domElement );
			controls.rotateSpeed = 1.0;
			controls.zoomSpeed = 1.2;
			controls.panSpeed = 0.2;
			controls.noZoom = false;
			controls.noPan = false;
			controls.staticMoving = false;
			controls.dynamicDampingFactor = 0.3;
			var radius = 100;
			controls.minDistance = 0.0;
			controls.maxDistance = radius * 1000;
			//controls.keys = [ 65, 83, 68 ]; // [ rotateKey, zoomKey, panKey ]
			controls.screen.width = SCREEN_WIDTH;
			controls.screen.height = SCREEN_HEIGHT;
		}
	}

	var t = 0, newTime, delta;

	function animate(){
		requestAnimationFrame( animate );
		updateVisuals();
		updatePhysics();
		render();
	}

	var lastCallTime = 0;
	function updatePhysics(){
		// Step world
		var timeStep = 1 / settings.stepFrequency;

		var now = Date.now() / 1000;

		if(!lastCallTime){
			// last call time not saved, cant guess elapsed time. Take a simple step.
			world.step(timeStep);
			lastCallTime = now;
			return;
		}

		var timeSinceLastCall = now - lastCallTime;

		world.step(timeStep, timeSinceLastCall, settings.maxSubSteps);

		lastCallTime = now;
	}

	function onDocumentMouseMove( event ) {
	}

	function onWindowResize( event ) {
		SCREEN_WIDTH = window.innerWidth;
		SCREEN_HEIGHT = window.innerHeight;

		renderer.setSize( SCREEN_WIDTH, SCREEN_HEIGHT );

		camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
		camera.updateProjectionMatrix();

		if (controls) {
			controls.screen.width = SCREEN_WIDTH;
			controls.screen.height = SCREEN_HEIGHT;
		}
		camera.radius = ( SCREEN_WIDTH + SCREEN_HEIGHT ) / 4;
	}

	function render(){
		controls && controls.update();
		renderer.clear();
		renderer.render( that.scene, camera );
	}

	function start(){
		buildScene(0);
	}

	function buildScene(n){
		/*
		// Remove current bodies and visuals
		var num = visuals.length;
		for(var i=0; i<num; i++){
			world.remove(bodies.pop());
			var mesh = visuals.pop();
			that.scene.remove(mesh);
		}
		// Remove all constraints
		while(world.constraints.length){
			world.removeConstraint(world.constraints[0]);
		}
		*/
		demo();
	}

};

Demo.prototype = {
    constructor: Demo
}

Demo.prototype.getWorld = function(){
	return this.world;
};

Demo.prototype.addVisual = function(body, material){
	// What geometry should be used?
	var mesh;
	if(body instanceof CANNON.Body){
		mesh = this.shape2mesh(body, material);
	} else {
		con.log('custom body!!!', body);
	}
	if(mesh) {
		// Add body
		this.bodies.push(body);
		this.visuals.push(mesh);
		body.visualref = mesh;
		body.visualref.visualId = this.bodies.length - 1;
		//mesh.useQuaternion = true;
		this.scene.add(mesh);
	}
};

Demo.prototype.addVisuals = function(bodies){
	for (var i = 0; i < bodies.length; i++) {
		this.addVisual(bodies[i]);
	}
};

Demo.prototype.removeVisual = function(body){
	if(body.visualref){
		var bodies = this.bodies,
			visuals = this.visuals,
			old_b = [],
			old_v = [],
			n = bodies.length;

		for(var i=0; i<n; i++){
			old_b.unshift(bodies.pop());
			old_v.unshift(visuals.pop());
		}

		var id = body.visualref.visualId;
		for(var j=0; j<old_b.length; j++){
			if(j !== id){
				var i = j>id ? j-1 : j;
				bodies[i] = old_b[j];
				visuals[i] = old_v[j];
				bodies[i].visualref = old_b[j].visualref;
				bodies[i].visualref.visualId = i;
			}
		}
		body.visualref.visualId = null;
		this.scene.remove(body.visualref);
		body.visualref = null;
	}
};

Demo.prototype.removeAllVisuals = function(){
	while(this.bodies.length) {
		this.removeVisual(this.bodies[0]);
	}
};

var hackyMcHack = 0;
Demo.prototype.shape2mesh = function(body, material){

	material = material || this.currentMaterial;

	var wireframe = this.settings.renderMode === "wireframe";
	var obj = new THREE.Object3D();

	function addMesh(mesh, shapeIndex) {
		mesh.receiveShadow = true;
		mesh.castShadow = true;
		if(mesh.children){
			for(var i=0; i<mesh.children.length; i++){
				mesh.children[i].castShadow = true;
				mesh.children[i].receiveShadow = true;
				if(mesh.children[i]){
					for(var j=0; j<mesh.children[i].length; j++){
						mesh.children[i].children[j].castShadow = true;
						mesh.children[i].children[j].receiveShadow = true;
					}
				}
			}
		}

		var o = body.shapeOffsets[shapeIndex];
		var q = body.shapeOrientations[shapeIndex];
		mesh.position.set(o.x, o.y, o.z);
		mesh.quaternion.set(q.x, q.y, q.z, q.w);

		obj.add(mesh);
	}


	if (body.custom) {

		// this hack only allows for one body shape currently.
		var shape = body.shapes[0];
		var mesh = new THREE.Object3D();

		// allow for ball_and_chain demo
		switch (body.customType) {

		case "CHAIN_LINK" :
			var box_geometry = new THREE.BoxGeometry(shape.halfExtents.x * 2,
				shape.halfExtents.y * 2,
				shape.halfExtents.z * 2);
			var submeshFrame = new THREE.Mesh( box_geometry, this.wireframeMaterial );
			// mesh.add(submeshFrame);

			var link = new THREE.Object3D();

			var points = [];
			var divisions = 10;
			var widthHalf = 0.8;
			var pitch = shape.halfExtents.z;
			var wireSizeHalf = 0.3;
			var segments = 10;
			for (var i = 0; i <= divisions; i++) {
				var a = i / divisions * Math.PI * -2;
				points.push(new THREE.Vector2(widthHalf + Math.sin(a) * wireSizeHalf, Math.cos(a) * wireSizeHalf));
			}
			var geometry = new THREE.LatheBufferGeometry(points, segments, 0, Math.PI);
			var linkEnd0 = new THREE.Mesh(geometry, material);
			linkEnd0.position.set(0, 0, pitch);
			linkEnd0.rotation.set(0, -Math.PI / 2, 0);
			link.add(linkEnd0);

			var linkEnd1 = new THREE.Mesh(geometry, material);
			linkEnd1.position.set(0, 0, -pitch);
			linkEnd1.rotation.set(0, -Math.PI / 2, Math.PI);
			link.add(linkEnd1);

			// CylinderBufferGeometry(radiusTop, radiusBottom, height, radiusSegments, heightSegments)
			var geometry = new THREE.CylinderBufferGeometry(wireSizeHalf, wireSizeHalf, pitch * 2, segments);
			var cylinder0 = new THREE.Mesh(geometry, material);
			cylinder0.rotation.set(Math.PI / 2, 0, 0);
			cylinder0.position.set(widthHalf, 0, 0);
			link.add(cylinder0);
			var cylinder1 = new THREE.Mesh(geometry, material);
			cylinder1.rotation.set(Math.PI / 2, 0, 0);
			cylinder1.position.set(-widthHalf, 0, 0);
			link.add(cylinder1);

			linkEnd0.receiveShadow = true; linkEnd0.castShadow = true;
			linkEnd1.receiveShadow = true; linkEnd1.castShadow = true;
			cylinder0.receiveShadow = true; cylinder0.castShadow = true;
			cylinder1.receiveShadow = true; cylinder1.castShadow = true;

			mesh.add(link);

			link.rotation.z = ((hackyMcHack++) % 2) * Math.PI / 2;
			break;
		default :
			throw new Error("need to supply customType!");
		}
		addMesh(mesh, 0);

		return obj;
	}


	for (var l = 0; l < body.shapes.length; l++) {
		var shape = body.shapes[l];
		var mesh;

		switch(shape.type){

		case CANNON.Shape.types.SPHERE:
			var sphere_geometry = new THREE.SphereGeometry( shape.radius, 18, 18);
			mesh = new THREE.Mesh( sphere_geometry, material );
			break;

		case CANNON.Shape.types.PARTICLE:
			mesh = new THREE.Mesh( this.particleGeo, this.particleMaterial );
			var s = this.settings;
			mesh.scale.set(s.particleSize,s.particleSize,s.particleSize);
			break;

		case CANNON.Shape.types.PLANE:
			var geometry = new THREE.PlaneGeometry(10, 10, 4, 4);
			mesh = new THREE.Object3D();
			var submesh = new THREE.Object3D();
			var ground = new THREE.Mesh( geometry, new THREE.MeshLambertMaterial({
			  color: 0x909090
			}));
			ground.scale.set(100, 100, 100);
			submesh.add(ground);

			ground.castShadow = true;
			ground.receiveShadow = true;

			mesh.add(submesh);
			break;

        case CANNON.Shape.types.BOX:
            var box_geometry = new THREE.BoxGeometry(  shape.halfExtents.x*2,
                                                        shape.halfExtents.y*2,
                                                        shape.halfExtents.z*2 );
            mesh = new THREE.Mesh( box_geometry, material );
            break;

		case CANNON.Shape.types.CONVEXPOLYHEDRON:
			var geo = new THREE.Geometry();

			// Add vertices
			for (var i = 0; i < shape.vertices.length; i++) {
				var v = shape.vertices[i];
				geo.vertices.push(new THREE.Vector3(v.x, v.y, v.z));
			}

			for(var i=0; i < shape.faces.length; i++){
				var face = shape.faces[i];

				// add triangles
				var a = face[0];
				for (var j = 1; j < face.length - 1; j++) {
					var b = face[j];
					var c = face[j + 1];
					geo.faces.push(new THREE.Face3(a, b, c));
				}
			}
			geo.computeBoundingSphere();
			geo.computeFaceNormals();
			mesh = new THREE.Mesh( geo, material );
			break;

		case CANNON.Shape.types.HEIGHTFIELD:
			var geometry = new THREE.Geometry();

			var v0 = new CANNON.Vec3();
			var v1 = new CANNON.Vec3();
			var v2 = new CANNON.Vec3();
			for (var xi = 0; xi < shape.data.length - 1; xi++) {
				for (var yi = 0; yi < shape.data[xi].length - 1; yi++) {
					for (var k = 0; k < 2; k++) {
						shape.getConvexTrianglePillar(xi, yi, k===0);
						v0.copy(shape.pillarConvex.vertices[0]);
						v1.copy(shape.pillarConvex.vertices[1]);
						v2.copy(shape.pillarConvex.vertices[2]);
						v0.vadd(shape.pillarOffset, v0);
						v1.vadd(shape.pillarOffset, v1);
						v2.vadd(shape.pillarOffset, v2);
						geometry.vertices.push(
							new THREE.Vector3(v0.x, v0.y, v0.z),
							new THREE.Vector3(v1.x, v1.y, v1.z),
							new THREE.Vector3(v2.x, v2.y, v2.z)
						);
						var i = geometry.vertices.length - 3;
						geometry.faces.push(new THREE.Face3(i, i+1, i+2));
					}
				}
			}
			geometry.computeBoundingSphere();
			geometry.computeFaceNormals();
			mesh = new THREE.Mesh(geometry, material);
			break;

		case CANNON.Shape.types.TRIMESH:
			var geometry = new THREE.Geometry();

			var v0 = new CANNON.Vec3();
			var v1 = new CANNON.Vec3();
			var v2 = new CANNON.Vec3();
			for (var i = 0; i < shape.indices.length / 3; i++) {
				shape.getTriangleVertices(i, v0, v1, v2);
				geometry.vertices.push(
					new THREE.Vector3(v0.x, v0.y, v0.z),
					new THREE.Vector3(v1.x, v1.y, v1.z),
					new THREE.Vector3(v2.x, v2.y, v2.z)
				);
				var j = geometry.vertices.length - 3;
				geometry.faces.push(new THREE.Face3(j, j+1, j+2));
			}
			geometry.computeBoundingSphere();
			geometry.computeFaceNormals();
			mesh = new THREE.Mesh(geometry, material);
			break;

		default:
			throw "Visual type not recognized: "+shape.type;
		}

		addMesh(mesh, l);
	}

	return obj;
};

return Demo;

});