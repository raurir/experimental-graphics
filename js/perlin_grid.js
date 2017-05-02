
var vertexShader = `varying vec2 vUv;
void main()
{
  vUv = uv;
  vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
  gl_Position = projectionMatrix * mvPosition;
}`;

var fragmentShader = `
uniform float r;
uniform float g;
uniform float b;
uniform float distance;
uniform float pulse;
uniform float rows;
uniform float cols;
varying vec2 vUv;
float checkerRows = 1.5;
float checkerCols = 2.0;
void main( void ) {
  vec2 position = abs(-1.0 + 2.0 * vUv);

  float edging = abs((pow(position.y, 5.0) + pow(position.x, 5.0)) / 1.0);

  float perc = 0.25 + distance * edging * 0.75;
  vec2 checkPosition = vUv;
  
  float checkerX = mod(checkPosition.x, 1.0 / rows) * rows; // loop of 0 to 1 per row: /|/|/|//
  checkerX = abs(checkerX - 0.5) * 2.0; // make up and down: /\/\/\ 
  checkerX = pow(checkerX, 3.0); // power to sharpen edges: \__/\__/

  float checkerY = mod(checkPosition.y, 1.0 / cols) * cols;
  checkerY = abs(checkerY - 0.5) * 2.0;
  checkerY = pow(checkerY, 3.0);

  // float checker = (checkerX * checkerY) * 2.0;
  float checker = (checkerX + checkerY) * 0.5;
  float r1 = r * checker + 0.1;
  float g1 = g * checker + 0.05;
  float b1 = b * checker + 0.2;
  float red = r1 * perc + pulse;
  float green = g1 * perc + pulse;
  float blue = b1 * perc + pulse + 0.05;

  // float red = r;
  // float green = g;
  // float blue = b;

  gl_FragColor = vec4(red, green, blue, 1.0);
}`;

var perlin_grid = function(noise) {

	var stage = document.createElement("div");

	var camera, scene, renderer;
	var mouse = {x: 0, y: 0};
	var camPos = {x: 0, y: 0, z: 10};
	var sw = window.innerWidth, sh = window.innerHeight;

	var size = {
		width: 300,
		height: 100,
		depth: 300,
	}
	var edgeSize = 50;
	var gridUnits = 7;
	var gridAbove = [];
	var gridBelow = [];
	var seed = Math.random();

	var holderAbove, holderBelow;

	function num(min, max) { return Math.random() * (max - min) + min; }

	function createMaterial(rows, cols, colourRand, distance) {
		var colourBase = {r: 0.7, g: 0.3, b: 0.6};
		var colour = {
			r: colourBase.r + colourRand.r,
			g: colourBase.g + colourRand.g,
			b: colourBase.b + colourRand.b
		}

		var uniforms = {
			r: { type: "f", value: colour.r},
			g: { type: "f", value: colour.g},
			b: { type: "f", value: colour.b},
			// distanceX: { type: "f", value: 1.0},
			distance: { type: "f", value: distance},
			pulse: { type: "f", value: 0},
			rows: { type: "f", value: rows},
			cols: { type: "f", value: cols},
		};

		var material = new THREE.ShaderMaterial( {
			uniforms: uniforms,
			vertexShader: vertexShader,
			fragmentShader: fragmentShader
		});
		return material;
	}

	function cube(options) {
		var width = options.dimensions.width;
		var height = options.dimensions.height;
		var depth = options.dimensions.depth;
		var colour = options.colour;
		var checker = options.checker;
		var distance = options.distance;
		// these coloured vars are just for debugging
		var shaderRed = createMaterial(checker[0][0], checker[0][1], colour, distance);
		var shaderYellow = createMaterial(checker[1][0], checker[1][1], colour, distance);
		var shaderGreen = createMaterial(checker[2][0], checker[2][1], colour, distance);
		var shaderBlue = createMaterial(checker[3][0], checker[3][1], colour, distance);
		var shaderCyan = createMaterial(checker[4][0], checker[4][1], colour, distance);
		var shaderMagenta = createMaterial(checker[5][0], checker[5][1], colour, distance);

		// const material = new THREE.MeshPhongMaterial({
		// 	color: props.colour,
		// 	emissive: 0x803000,
		// });

		var geometry = new THREE.BoxGeometry(width, height, depth);
		var mesh = new THREE.Mesh(geometry, new THREE.MeshFaceMaterial([
			shaderRed,
			shaderYellow,
			shaderGreen,
			shaderBlue,
			shaderCyan, 
			shaderMagenta
		]));

		// mesh.colours = colours;
		return mesh;
	}

	const draw = (x, z, distanceFromCentre) => {

		var colourRand = {
			r: num(0, 0.5),
			g: num(0, 0.5),
			b: num(0, 0.5)
		}

		var vertProps = {
			width: edgeSize, 
			height: size.height, 
			depth: edgeSize,
		}

		var distance = size.width / 2 - edgeSize; // only because size.width == size.depth
		var holder = new THREE.Group();
		var verticalEdgeBL = cube({ // back left
			dimensions: vertProps,
			checker: [[1,2],[1,2],[1,1],[1,1],[1,2],[1,2]],
			colour: colourRand, 
			distance: distanceFromCentre
		});
		verticalEdgeBL.position.set(-distance, 0, -distance)
		holder.add(verticalEdgeBL);
		var verticalEdgeBR = cube({
			dimensions: vertProps,
			checker: [[1,2],[1,2],[1,1],[1,1],[1,2],[1,2]],
			colour: colourRand, 
			distance: distanceFromCentre
		});
		verticalEdgeBR.position.set(distance, 0, -distance)
		holder.add(verticalEdgeBR);
		var verticalEdgeFL = cube({
			dimensions: vertProps,
			checker: [[1,2],[1,2],[1,1],[1,1],[1,2],[1,2]],
			colour: colourRand, 
			distance: distanceFromCentre
		});
		verticalEdgeFL.position.set(-distance, 0, distance)
		holder.add(verticalEdgeFL);
		var verticalEdgeFR = cube({
			dimensions: vertProps,
			checker: [[1,2],[1,2],[1,1],[1,1],[1,2],[1,2]],
			colour: colourRand, 
			distance: distanceFromCentre
		});
		verticalEdgeFR.position.set(distance, 0, distance)
		holder.add(verticalEdgeFR); // front right

		var horizProps = {
			width: size.width - edgeSize, 
			height: edgeSize,
			depth: edgeSize,
		}
		var horizontalEdgeF = cube({
			dimensions: horizProps,
			checker: [[1,1],[1,1],[5,1],[5,1],[5,1],[5,1]],
			colour: colourRand, 
			distance: distanceFromCentre
		});
		horizontalEdgeF.position.set(0, (size.height + edgeSize) / 2, -distance)
		holder.add(horizontalEdgeF);
		var horizontalEdgeB = cube({
			dimensions: horizProps,
			checker: [[1,1],[1,1],[5,1],[5,1],[5,1],[5,1]],
			colour: colourRand, 
			distance: distanceFromCentre
		});
		horizontalEdgeB.position.set(0, (size.height + edgeSize) / 2, distance)
		holder.add(horizontalEdgeB);

		return holder;
	}


	function init() {
		return;

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera( 90, sw / sh, 1, 10000 );
		camera.position.set( 0, 100, 500 );
		scene.add( camera );

		var light = new THREE.DirectionalLight( 0xffffff, 2 );
		light.position.set( 1, 1, 1 ).normalize();
		scene.add( light );

		var light = new THREE.DirectionalLight( 0xff00ff, 2 );
		light.position.set( -1, 0, 0 ).normalize();
		scene.add( light );

		renderer = new THREE.WebGLRenderer({antialias: true});
		// renderer.sortObjects = false;
		renderer.setSize( sw, sh );

		holderAbove = new THREE.Group();
		scene.add(holderAbove);

		holderBelow = new THREE.Group();
		scene.add(holderBelow);

		for (var x = 0; x < gridUnits; x++) {
			for (var z = 0; z < gridUnits; z++) {
				var px = (x - gridUnits / 2 + 0.5) * size.width;
				var py = 0;
				var pz = (z - gridUnits / 2 + 0.5) * size.depth;

				var distanceFromCentre = 1 - Math.sqrt(px * px + pz * pz) / 1200;

				// con.log("distanceFromCentre", distanceFromCentre)

				var boxAbove = draw(x, z, distanceFromCentre);
				boxAbove.position.set(px, py, pz);
				holderAbove.add(boxAbove);
				gridAbove.push(boxAbove);
				
				var boxBelow = draw(x, z, distanceFromCentre);
				boxBelow.position.set(px, py, pz);
				boxBelow.rotation.set(Math.PI, Math.PI / 2, 0);
				holderBelow.add(boxBelow);
				gridBelow.push(boxBelow);
			}
		}

		// var boxAbove = draw(0, 0, 1);
		// scene.add(boxAbove);

		stage.appendChild(renderer.domElement);

		animate(0);
	}

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
	listen(["mousemove", "touchmove"], function(e) {
		e.preventDefault();
		if (e.changedTouches && e.changedTouches[0]) e = e.changedTouches[0];
		mouse.x = (e.clientX / sw) * 2 - 1;
		mouse.y = -(e.clientY / sh) * 2 + 1;
	});
	listen(["mouseup", "touchend"], function(e) {
		e.preventDefault();
		isMouseDown = false;
	});


	function render(time) {
		
		for (var y = 0; y < gridUnits * 2; y++) { // using double high grid, first half is top, 2nd half is bottom
			for (var x = 0; x < gridUnits; x++) {

				var value = (noise.perlin3(x / gridUnits, y / gridUnits, seed) + 1) / 2;
				value = value * value * value * value; // power the fuck

				var gridIndex = (x + y * gridUnits);
				var scale = 1 + value * 50;

				var holder;
				if (y < gridUnits) {
					holder = gridAbove[gridIndex];
					holder.position.y = scale * size.height / 2;
				} else {
					holder = gridBelow[gridIndex - gridUnits * gridUnits]
					holder.position.y = -scale * size.height / 2;
				}

				// con.log("holder", holder)
				// for (var m = 0; m < holder.children.length; m++) {
				// 	var mesh = holder.children[m];
				// 	for (var n = 0; n < mesh.material.materials.length; n++) {
				// 		var material = mesh.material.materials[n];
				// 		if (Math.random() > 0.99) {
				// 			material.uniforms.pulse.value = 1;
				// 		}
				// 		material.uniforms.pulse.value -= material.uniforms.pulse.value * 0.1 / (1 + 1);

				// 	}
				// }

			}
		}
		

		seed += 0.01;
		var camDistance = 400;
		camPos.x -= (camPos.x - mouse.x * 1) * 0.02;
		camPos.y -= (camPos.y - mouse.y * 1000) * 0.05;
		// var rotY = time * 0.001 + camPos.x;
		var rotY = camPos.x * 4;
		camera.position.set(Math.sin(rotY) * camDistance, camPos.y, Math.cos(rotY) * camDistance);

		camera.lookAt( scene.position );

		renderer.render( scene, camera );

	}

	function animate(time) {
		requestAnimationFrame( animate );
		if (Math.random() > 0.99) {
			var holder = Math.random() > 0.5 ? holderAbove : holderBelow;
			TweenMax.to(holder.rotation, 0.75, {
				y: Math.PI / 2 * Math.round(num(-2, 2)),
				eade: Quad.easeInOut
			})
		}
		render(time);
	}

	return {
		init,
		stage
	};

};

define("perlin_grid", ["noise"], perlin_grid);










// hack of https://github.com/hughsk/web-audio-analyser

var AudioContext = window.AudioContext || window.webkitAudioContext

// module.exports = WebAudioAnalyser

var fftSize = 128

function WebAudioAnalyser(audio, ctx, opts) {
  if (!(this instanceof WebAudioAnalyser)) return new WebAudioAnalyser(audio, ctx, opts)
  if (!(ctx instanceof AudioContext)) (opts = ctx), (ctx = null)

  opts = opts || {}
  this.ctx = ctx = ctx || new AudioContext

  if (!(audio instanceof AudioNode)) {
	audio = (audio instanceof Audio || audio instanceof HTMLAudioElement)
	  ? ctx.createMediaElementSource(audio)
	  : ctx.createMediaStreamSource(audio)
  }

  this.analyser = ctx.createAnalyser()

  this.analyser.fftSize = fftSize

  this.stereo   = !!opts.stereo
  this.audible  = opts.audible !== false
  this.wavedata = null
  this.freqdata = null
  this.splitter = null
  this.merger   = null
  this.source   = audio

  if (!this.stereo) {
	this.output = this.source
	this.source.connect(this.analyser)
	if (this.audible)
	  this.analyser.connect(ctx.destination)
  } else {
	this.analyser = [this.analyser]
	this.analyser.push(ctx.createAnalyser())

	this.splitter = ctx.createChannelSplitter(2)
	this.merger   = ctx.createChannelMerger(2)
	this.output   = this.merger

	this.source.connect(this.splitter)

	for (var i = 0; i < 2; i++) {
	  this.splitter.connect(this.analyser[i], i, 0)
	  this.analyser[i].connect(this.merger, 0, i)
	}

	if (this.audible)
	  this.merger.connect(ctx.destination)
  }
}

WebAudioAnalyser.prototype.waveform = function(output, channel) {
  if (!output) output = this.wavedata || (
	this.wavedata = new Uint8Array((this.analyser[0] || this.analyser).frequencyBinCount)
  )

  var analyser = this.stereo
	? this.analyser[channel || 0]
	: this.analyser

  analyser.getByteTimeDomainData(output)

  return output
}

WebAudioAnalyser.prototype.frequencies = function(output, channel) {
  if (!output) output = this.freqdata || (
	this.freqdata = new Uint8Array((this.analyser[0] || this.analyser).frequencyBinCount)
  )

  var analyser = this.stereo
	? this.analyser[channel || 0]
	: this.analyser

  analyser.getByteFrequencyData(output)

  return output
}

analyse = WebAudioAnalyser

var analyser;
var bars = new Array(fftSize / 2)
var lastBars = new Array(fftSize / 2)
var d = document.createElement("div");
document.body.appendChild(d);
function createFreqBar(index) { 
	var div = document.createElement("div");
	div.style.width = "100%"
	div.style.height = "100px"
	div.style.position = "absolute"
	div.style.top = index * 100 + "px";
	document.body.appendChild(div);
	return div;
}
var low = createFreqBar(0);
var high = createFreqBar(1);



var audio  = new Audio
audio.crossOrigin = 'Anonymous'
audio.src = 'tribal.mp3'
audio.loop = true
audio.addEventListener('canplay', function() {
	console.log('playing!')
	analyser = analyse(audio, { audible: true, stereo: false, fftSize: 16 })

		// var bufferLength = analyser.frequencyBinCount;

	audio.play()
	audio.currentTime = 50
	render()
})
audio.addEventListener('error', function(e) {
	  switch (e.target.error.code) {
	 case e.target.error.MEDIA_ERR_ABORTED:
	   alert('You aborted the video playback.');
	   break;
	 case e.target.error.MEDIA_ERR_NETWORK:
	   alert('A network error caused the audio download to fail.');
	   break;
	 case e.target.error.MEDIA_ERR_DECODE:
	   alert('The audio playback was aborted due to a corruption problem or because the video used features your browser did not support.');
	   break;
	 case e.target.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
	   alert('The video audio not be loaded, either because the server or network failed or because the format is not supported.');
	   break;
	 default:
	   alert('An unknown error occurred.');
	   break;
   }
});



function render() {
  if (analyser) {
	requestAnimationFrame(render)
	var waveform = analyser.waveform()
	var size = waveform.length
	var frequencies = analyser.frequencies()
	// con.log(size, frequencies.length)

	low.style.background = Math.floor(frequencies[0] / 10) > Math.floor(lastBars[0] / 10) ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.5)"
	high.style.background = Math.floor(frequencies[16] / 10) > Math.floor(lastBars[16] / 10) ? "rgba(255,255,128,0.7)" : "rgba(255,255,128,0.5)"

	for (var i = 0, n = 0; i < size; i += 1, n += 3) {
	  var freq = Math.floor(frequencies[i] / 10);
	  bars[i] = freq;
	  lastBars[i] = frequencies[i];
	}
	d.innerHTML = bars.map((freq) => {
		var f = 0, bar = "";
		while (f++ < freq) {
			bar += "#";
		}
		return bar;
	}).join("<br>");
  }
}


