define("codevember", ["exps_details"], function(experimentsDetails) {

	var pixels = 10;
	var cubeSize = 400;
	var gridSize = 440;
	var cubeDepth = 50;
	var grid = [];
	var camera, scene, renderer;
	var camPos = {x: 0, y: 0, z: 0};
	var sw = window.innerWidth, sh = window.innerHeight;
	var lightA, lightB, lightC;

	function cube() {
		const material = new THREE.MeshPhongMaterial({
			color: 0x00487b,
			specular: 0x99e6ff,
			shininess: 30
		});
		const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeDepth);
		const mesh = new THREE.Mesh(geometry, material);
		return mesh;
	}

	function init() {
		createScene();
		createText();
	}

	function createText() {
		var codevember = experimentsDetails.getFeature("codevember");

		document.body.appendChild(dom.element("style", {
			innerText: [
				"a { color: white; }",
				"a:hover { color: #87d9ff; text-shadow: 0px 0px 16px #fff; }",
				"div { box-sizing: border-box;}",
				".holder { color: white; display: block; position: absolute; top: 20%; left: 10%;",
				" transform: rotate3d(0.3, 0.5, 0.9, 8deg); width: 100%; z-index: 50; }",
				".item { display: block; clear: both; line-height: 25px; }",
				".day { color: #bcd1d6; display: inline-block; float: left; padding-right: 10px; text-align: right; width: 20%; }",
				".title { display: inline-block; float: left; width: 80%; }",
			].join(" ")
		}));

		var textHolder = dom.element("div", {className: "holder",
			innerHTML: "<h1>CODEVEMBER</H1>"});

		codevember.forEach(function(exp) {
			var style = {
				display: "block",
				clear: "both"
			};
			var codeItem = exp.link
				? dom.element("a", {className: "item", href: "/?" + exp.link})
				: dom.element("div", {className: "item"});
			var codeItemDay = dom.element("div", {className: "day", innerHTML: "Day " + exp.day});
			var codeItemTitle = dom.element("div", {className: "title", innerHTML: exp.title});
			textHolder.appendChild(codeItem);
			codeItem.appendChild(codeItemDay);
			codeItem.appendChild(codeItemTitle);
		})
		document.body.appendChild(textHolder);
	}

	function createScene() {

		scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2(0x000000, 0.002);

		camera = new THREE.PerspectiveCamera(120, sw / sh, 1, 20000);
		scene.add(camera);

		lightA = new THREE.DirectionalLight(0xffe0ff, 0.19);
		lightA.position.set(0, 1, 0.5);
		scene.add(lightA);

		lightB = new THREE.DirectionalLight(0xf0e5a1, 0.15);
		lightB.position.set(-1, 0.5, 0.5);
		scene.add(lightB);

		lightC = new THREE.DirectionalLight(0x80fdff, 0.18);
		lightC.position.set(0, -1, 0.25);
		scene.add(lightC);

		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize(sw, sh);

		holder = new THREE.Group();
		scene.add(holder);

		ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
		scene.add(ambientLight);

		for (var p = 0; p < pixels * pixels; p++) {
			var c = cube();
			holder.add(c);
			var xi = p % pixels - pixels / 2 + 0.5;
			var yi = Math.floor(p / pixels) - pixels / 2 + 0.5;
			var x = xi * gridSize;
			var y = -yi * gridSize;
			var z = 0;
			c.position.set(x, y, z);
			c.shift = {
				speed: (0.1 + Math.random()) * 0.0001,
				position: 0
			};
			grid.push(c);
		}

		document.body.appendChild(renderer.domElement);
		render(0);
	}

	function render(time) {

		grid.forEach((c) => {
			c.shift.position = Math.sin(time * c.shift.speed) * 20;
			c.position.z = c.shift.position;
		})

		function moveLight(light, x, y, z) {
			var sc = 0.00001;
			light.position.set(
				Math.sin((time + 10000) * x * sc),
				Math.sin((time + 10000) * y * sc),
				Math.sin((time + 10000) * z * sc)
			);
		}

		moveLight(lightA, 15, 17, 12);
		moveLight(lightB, 14, 19, 13);
		moveLight(lightC, 20, 18, 16);

		camPos.x = Math.sin(time * 0.00012) * 50;
		camPos.y = Math.sin(time * 0.00017) * 50;
		camPos.z = 400 + Math.sin(time * 0.00003) * 300;
		camera.position.set(camPos.x, camPos.y, camPos.z);

		camera.lookAt( scene.position );
		renderer.render( scene, camera );
		requestAnimationFrame(render);
	}

	return {
		init: init
	}

});