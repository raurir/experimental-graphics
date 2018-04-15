var camera, scene, projector, renderer;
var mouse = { x: 0, y: 0 };
var sw = window.innerWidth, sh = window.innerHeight;
sw = sh = 400;
var theta = 0;
var h = [];
var i = 0;
var radius = 20;
var n;


var settings = {};
settings.lineScale = 1;
settings.lineSize = 1 + Math.random() * 10 * settings.lineScale;
settings.lineGap = 2 + Math.random() * 3 * settings.lineScale;
settings.baseRotation = 0;
settings.varyRotation = Math.random() * Math.PI * 2




function draw(props) {
	var col = 0xff002000;
	var material = new THREE.MeshLambertMaterial( { color: col } )
	//radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded, thetaStart, thetaLength
	var geometry = new THREE.CylinderGeometry(props.radius, props.radius, props.height, 14 );
	var object = new THREE.Mesh(geometry, material);
	return object;
}


function init() {

	con.log('init');

	scene = new THREE.Scene();

	camera = new THREE.PerspectiveCamera( 70, sw / sh, 1, 10000 );
	camera.position.set( 0, 300, 500 );
	scene.add( camera );

	var light = new THREE.DirectionalLight( 0xffffff, 2 );
	light.position.set( 1, 1, 1 ).normalize();
	scene.add( light );

	var light = new THREE.DirectionalLight( 0xffffff );
	light.position.set( -1, -1, -1 ).normalize();
	scene.add( light );

	renderer = new THREE.WebGLRenderer();
	renderer.sortObjects = false;
	renderer.setSize( sw, sh );

	for (var i = 0, il = 10; i < il; i++) {
		var scale = 1 - (i / il) + 0.5;
		var height = 100 * scale;
		var radius = 20 * scale;
		var cylinder = draw({height: i * height, radius: radius});
		cylinder.position.set(0, height, 0);
		cylinder.rotation.set(0, 0, i * 0.2);
		scene.add(cylinder);
	};


	document.body.appendChild(renderer.domElement);

	document.addEventListener( 'mousemove', onDocumentMouseMove, false );

}

function onDocumentMouseMove( event ) {
	event.preventDefault();
	mouse.x = ( event.clientX / sw ) * 2 - 1;
	mouse.y = - ( event.clientY / sh ) * 2 + 1;
}

function render() {

	var camRadius = 500;

	// theta += mouse.x * 4;

	camera.position.x = camRadius * Math.sin( theta * Math.PI / 360 );
	camera.position.y = mouse.y * 130;
	camera.position.z = camRadius * Math.cos( theta * Math.PI / 360 );

	camera.lookAt( scene.position );

	renderer.render( scene, camera );

}

function animate() {
	requestAnimationFrame( animate );
	render();
}

setTimeout(function() {
	init();
	animate();
},100);


