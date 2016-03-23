var polyhedra_three = function() {

	var stage = document.createElement("div");

	var camera, scene, projector, renderer;
	var mouse = { x: 0, y: 0 };
	var sw = window.innerWidth, sh = window.innerHeight;
	sw = sh = 400;
	var theta = 0;
	var h = [];
	var i = 0;
	var radius = 20;
	var n;



	// polys: http://stemkoski.github.io/Three.js/
	// http://stemkoski.github.io/Three.js/js/polyhedra.js

	// var t = ( 1 + Math.sqrt( 5 ) ) / 2
	// var CodedIcosahedron = {
	// 	name: "CodedIcosahedron",
	//  	vertices: [
	// 		-1,  t,  0,1,  t,  0,-1, -t,  0,1, -t,  0,
	// 		0, -1,  t,0,  1,  t,0, -1, -t,0,  1, -t,
	// 		t,  0, -1,t,  0,  1,-t,  0, -1,-t,  0,  1
	// 	],
	// 	faces:[
	// 		0, 11,  5,
	// 		0,  5,  1,
	// 		0,  1,  7,
	// 		0,  7, 10,
	// 		0, 10, 11,
	// 		1,  5,  9,5, 11,  4,11, 10,  2,10,  7,  6,7,  1,  8,
	// 		3,  9,  4,3,  4,  2,3,  2,  6,3,  6,  8,3,  8,  9,
	// 		4,  9,  5,2,  4, 11,6,  2, 10,8,  6,  7,9,  8,  1
	// 	]
	// }



	var settings = {};
	settings.lineScale = 1;
	settings.lineSize = 1 + Math.random() * 10 * settings.lineScale;
	settings.lineGap = 2 + Math.random() * 3 * settings.lineScale;
	settings.baseRotation = 0;
	settings.varyRotation = Math.random() * Math.PI * 2

	function createPattern(size) {

		// con.log('createCanvas, size', size);
		var half = size / 2;
		var canvas = dom.canvas(size, size);
		// document.body.appendChild(canvas.canvas);
		// canvas.canvas.style.border = '2px solid black'
		var ctx = canvas.ctx;
		// puts the canvas centre so the whole area has a pattern
		ctx.save();
		ctx.translate(half, half);
		ctx.rotate(settings.baseRotation + Math.random() * settings.varyRotation);
		ctx.translate(-half, -half);

		ctx.fillStyle = colours.getRandomColour();

		var padding = Math.sqrt( half * half * 2) - half; // the gaps between the corner when rotated 45 degrees

		// draw bg. not good for shirts!!!
		//ctx.fillRect(-padding, -padding, size + padding * 2, size + padding * 2);

		// if (settings.varyPerRegion) {
		// 	settings.lineScale = 0.5 + frand(settings.overallScale);
		// 	settings.lineSize = 1 + frand(10) * settings.lineScale;
		// 	settings.lineGap = 2 + frand(3) * settings.lineScale;
		// }

		var colour;
		// if (settings.varyDuotone) {
		// 	colour = colours.getNextColour();
		// }
		var y = -padding;
		while(y < size + padding) {
			// if (settings.varyPerLine) {
			// 	settings.lineSize = 1 + frand(10) * settings.lineScale;
			// 	settings.lineGap = 2 + frand(3) * settings.lineScale;
			// }
			// if (!settings.varyDuotone) {
				colour = colours.getNextColour();
			// }
			ctx.fillStyle = colour;
			ctx.fillRect(-padding, y, size + padding * 2, settings.lineSize);
			y += settings.lineSize + settings.lineGap;
		}

		// ctx.restore();

		return canvas.canvas;
	}






function draw(data)
{
	// this draw function directly stolen from stemkoski - http://stemkoski.github.io/Three.js/Polyhedra.html
	var polyhedron = new THREE.Object3D();
	
	// convert vertex data to THREE.js vectors
	var vertex = [] 
	for (var i = 0; i < data.vertex.length; i++)
		vertex.push( new THREE.Vector3( data.vertex[i][0], data.vertex[i][1], data.vertex[i][2] ).multiplyScalar(100) );

	var vertexGeometry = new THREE.SphereGeometry( 6, 12, 6 );
	var vertexMaterial = new THREE.MeshLambertMaterial( { color: 0x222244 } );
	var vertexSingleMesh = new THREE.Mesh( vertexGeometry );

	// var vertexAmalgam = new THREE.Geometry();
	// for (var i = 0; i < data.vertex.length; i++)
	// {
	// 	var vMesh = vertexSingleMesh.clone();
	// 	vMesh.position = vertex[i];
	// 	THREE.GeometryUtils.merge( vertexAmalgam, vMesh );
	// }
	// var vertexMesh = new THREE.Mesh( vertexAmalgam, vertexMaterial );
	// polyhedron.add( vertexMesh );
	

	
	// convert face data to a single (triangulated) geometry
	var faceMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors, side: THREE.FrontSide, transparent: false, opacity:0.8 } );
	var faceColors = 
	{
	    3: new THREE.Color( 0xcc0000 ),
	    4: new THREE.Color( 0x00cc00 ),
	    5: new THREE.Color( 0x0000cc ),
	    6: new THREE.Color( 0xcccc00 ),
	    7: new THREE.Color( 0x999999 ),
	    8: new THREE.Color( 0x990099 ),
	    9: new THREE.Color( 0xff6600 ),
	    10: new THREE.Color( 0x6666ff )
	};
	
	var geometry = new THREE.Geometry();
	geometry.vertices = vertex;
	var faceIndex = 0;
	for (var faceNum = 0; faceNum < data.face.length; faceNum++)
	{
		for (var i = 0; i < data.face[faceNum].length - 2; i++)
		{
			geometry.faces[faceIndex] = new THREE.Face3( data.face[faceNum][0], data.face[faceNum][i+1], data.face[faceNum][i+2] );
			geometry.faces[faceIndex].color = faceColors[data.face[faceNum].length];
			faceIndex++;
		}
	}
	
	geometry.computeFaceNormals();
	geometry.computeVertexNormals();

	faces = new THREE.Mesh(geometry, faceMaterial);
	faces.scale.multiplyScalar(1.01);
	polyhedron.add(faces);
	
	var interiorMaterial = new THREE.MeshBasicMaterial( { color: 0xffffff, vertexColors: THREE.FaceColors, side: THREE.BackSide } );
	
	var interiorFaces = new THREE.Mesh(geometry, interiorMaterial);
	interiorFaces.scale.multiplyScalar(0.99);
	polyhedron.add( interiorFaces );
	
	return polyhedron;
}




















	function drawOld(props) {

		con.log(props);

		var tempFaces = [];
		props.face.map((face) => { face.map((vertex) => { tempFaces.push(vertex); }) })

		var tempVertices = [];
		props.vertex.map((vertex) => { vertex.map((vertexIndex) => { tempVertices.push(vertexIndex); }) })

		var faces = tempFaces;
		var vertices = tempVertices

		var materials = [];
		for (var i=0; i < faces.length / 3; i++) {
			// var img = new Image();
			// img.src = i + '.png';
			// var tex = new THREE.Texture(img);
			// img.tex = tex;
			// img.onload = function() {
			//   this.tex.needsUpdate = true;
			// };

			var pattern = createPattern(1000);
			var texture = new THREE.Texture(pattern);
			texture.needsUpdate = true;
			var material = new THREE.MeshBasicMaterial( {map: texture, side:THREE.DoubleSide } );
			// material.transparent = true;

			// var material = new THREE.MeshLambertMaterial( { color: col } )

			var mat = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture});
			materials.push(material);
		}

		var geometry = new THREE.PolyhedronGeometry( vertices, faces, 200, 0 );
		// var geometry = new THREE.BoxGeometry( 200, 200, 400, 1, 1, 1 );

		for (var i=0; i < geometry.faces.length; i++) {
			con.log(i, geometry.faces[ i ] );
			geometry.faces[ i ].materialIndex = i;
		}

		var material = new THREE.MeshFaceMaterial( materials );
		var object = new THREE.Mesh( geometry, material );

		// var object = THREE.SceneUtils.createMultiMaterialObject(geometry, materials);

		// object.position.x = props.x;
		// object.position.y = props.y;
		// object.position.z = props.z;

		return object;
	}


	function init() {

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

		var mesh = POLYHEDRA.TruncatedCubocahedron;
		// var mesh = POLYHEDRA.J22 //Icosidodecahedron;
		con.log("POLYHEDRA", mesh);

		var object = draw(mesh);
		scene.add( object );

		stage.appendChild(renderer.domElement);

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );

		animate();
	}

	function onDocumentMouseMove( event ) {
		event.preventDefault();
		mouse.x = ( event.clientX / sw ) * 2 - 1;
		mouse.y = - ( event.clientY / sh ) * 2 + 1;
	}

	function render() {

		var camRadius = 500;

		theta += mouse.x * 4;

		camera.position.x = camRadius * Math.sin( theta * Math.PI / 360 );
		camera.position.y = mouse.y * 10;
		camera.position.z = camRadius * Math.cos( theta * Math.PI / 360 );

		camera.lookAt( scene.position );

		renderer.render( scene, camera );

	}

	function animate() {
		requestAnimationFrame( animate );
		render();
	}

  var experiment = {
    stage: stage,
    init: init,
  }

  return experiment;

};

define("polyhedra_three", polyhedra_three);