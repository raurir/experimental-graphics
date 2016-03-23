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
	var polyhedron;

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





	function draw(props) {
		var i, il;
		var faces = [], faceRange = [], totalFaces = 0;
		props.face.map((face) => { 
			for (i = 0, il = face.length - 2; i < il; i++) {
				faces.push(face[0], face[i + 1], face[i + 2]);
			}
			totalFaces += il;
			faceRange.push(totalFaces);
		});

		var vertices = [];
		props.vertex.map((vertex) => { 
			vertex.map((vertexIndex) => {
				vertices.push(vertexIndex);
			});
		});

		var materials = [];

		for (i = 0, il = props.face.length; i < il; i++) {
			// var img = new Image();
			// img.src = i + '.png';
			// var tex = new THREE.Texture(img);
			// img.tex = tex;
			// img.onload = function() {
			//   this.tex.needsUpdate = true;
			// };

			// var pattern = createPattern(1000);
			// var texture = new THREE.Texture(pattern);
			// texture.needsUpdate = true;
			// var material = new THREE.MeshBasicMaterial( {map: texture, side:THREE.DoubleSide } );
			// material.transparent = true;

			var r = Math.round(Math.random() * 255);
			var g = Math.round(Math.random() * 255);
			var b = Math.round(Math.random() * 255);
			var col = r << 16 | g << 8 | b;

			var material = new THREE.MeshLambertMaterial( { color: col } )
			// var material = new THREE.MeshBasicMaterial( { color: col } )
			// var mat = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture});

			materials.push(material);
		}

		var geometry = new THREE.PolyhedronGeometry(vertices, faces, 200, 0);

		con.log('geometry', geometry);

		var materialIndex = 0;
		for (i = 0, il = geometry.faces.length; i < il; i++) {
			if (faceRange.indexOf(i) > -1) materialIndex++;
			geometry.faces[ i ].materialIndex = materialIndex;
		}

		// var material = new THREE.MeshLambertMaterial( { color: col } )

		var material = new THREE.MeshFaceMaterial( materials );
		var object = new THREE.Mesh( geometry, material );

		return object;
	}



	function init() {

		var time1 = new Date().getTime();

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera( 70, sw / sh, 1, 10000 );
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

		// var mesh = POLYHEDRA.TruncatedCubocahedron;
		// var mesh = POLYHEDRA.J74;
		// var mesh = POLYHEDRA.Dodecahedron;
		// var mesh = POLYHEDRA.J22;
		var mesh = POLYHEDRA.Icosidodecahedron;
		// con.log("POLYHEDRA", mesh);

		polyhedron = draw(mesh);
		scene.add(polyhedron);

		stage.appendChild(renderer.domElement);

		document.addEventListener( 'mousemove', onDocumentMouseMove, false );


		var time2 = new Date().getTime();
		render();
		var time3 = new Date().getTime();

		con.log("times", time2 - time1, time3 - time2);
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

		// camera.position.x = camRadius * Math.sin( theta * Math.PI / 360 );
		// camera.position.y = mouse.y * 10;
		// camera.position.z = camRadius * Math.cos( theta * Math.PI / 360 );

		polyhedron.rotation.y = theta * 0.1;

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