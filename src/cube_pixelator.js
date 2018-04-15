define("cube_pixelator", [], function() {

	const pixels = 48;
	const cubeSize = 8;
	const gridSize = 10;

	var camera, scene, renderer;
	var mouse = {x: 0, y: 0};
	var camPos = {x: 0, y: 0, z: 0};
	var sw = window.innerWidth, sh = window.innerHeight;
	var holder;
	var controls;

	var grid = [];
	var rotations = [];
	var images = [];
	var currentImage = 0;

	function cube(w, h, d, colour) {
		const geometry = new THREE.PlaneGeometry(w, h, 1);
		const material = new THREE.MeshLambertMaterial({color: colour});
		// const material = new THREE.MeshLambertMaterial({color: colour});
		// const geometry = new THREE.BoxGeometry(w, h, d);
		return new THREE.Mesh(geometry, material);
	}

	function init() {

		for (var p = 0; p < pixels * pixels; p++) {
			rotations.push({rotation: Math.random()});
		}

		// yes i should use promises, thanks!
		const fn1 = () => createBitmap("cash", fn2);
		const fn2 = () => createBitmap("marilyn", fn3);
		const fn3 = () => createBitmap("hicks", fn4);
		const fn4 = () => {
			// rotations = images[currentImage].slice();
			setTimeout(createScene, 200); // createScene is expensive
		}
		fn1();
	}

	function createBitmap(image, resolve) {
		var img = new Image();
		img.onload = () => {
			if (img.width != img.height) {
				throw new Error("squares only mate!");
			}
			const scale = pixels / img.width;
			const bmp = dom.canvas(pixels, pixels);
			const ctx = bmp.ctx;
			ctx.scale(scale, scale);
			ctx.drawImage(img, 0, 0);
			// document.body.appendChild(bmp.canvas);
			var grayscale = [];
			var pixelData = ctx.getImageData(0, 0, pixels, pixels).data;
			for (var p = 0; p < pixelData.length; p+=4) {
				var r = pixelData[p];
				grayscale.push({rotation: r / 255});
			}
			images.push(grayscale);
			// con.log("grayscale", image, grayscale.length)
			progress("render:progress", images.length / 4);
			setTimeout(resolve, 100);
		}
		img.src = `./assets/${image}.jpg`;
		// document.body.appendChild(img);
	}

	function createScene() {

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(90, sw / sh, 1, 20000);
		// camera = new THREE.OrthographicCamera( sw / - 2, sw / 2, sh / 2, sh / - 2, 1, 20000 );
		scene.add(camera);

		var lightAbove = new THREE.DirectionalLight(0xffffff, 1);
		lightAbove.position.set(0, 1, 0.5);
		scene.add(lightAbove);

		var lightLeft = new THREE.DirectionalLight(0xf0e5a1, 0.5);
		lightLeft.position.set(-1, 0.5, 0.5);
		scene.add(lightLeft);

		var lightBelow = new THREE.DirectionalLight(0x303030, 0.2);
		lightBelow.position.set(0, -1, 0.25);
		scene.add(lightBelow);

		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize(sw, sh);

		holder = new THREE.Group();
		scene.add(holder);

		for (var p = 0; p < pixels * pixels; p++) {
			var c = cube(cubeSize, cubeSize, cubeSize, 0xffffff);
			holder.add(c);
			var xi = p % pixels - pixels / 2 + 0.5;
			var yi = Math.floor(p / pixels) - pixels / 2 + 0.5;
			var x = xi * gridSize;
			var y = -yi * gridSize;
			var z = 0;
			c.position.set(x, y, z);
			c.rotateSpeed = Math.random() - 0.5;
			// var unitInterval = (xi / ((pixels - 1) / 2) + 1) / 2;
			// var unitInterval = rotations[p];
			// con.log(unitInterval)
			// c.rotateAmount = Math.pow(unitInterval, 1) * 1.2;
			// c.rotateAmount = Math.sqrt(xi * xi + yi * yi);
			// if (p < pixels) con.log(unitInterval)
			grid.push(c);
		}

		document.body.appendChild(renderer.domElement);
		render(0);
		setInterval(toggleImage, 6000);

		progress("render:complete", renderer.domElement);
	}

	const toggleImage = () => {
		currentImage ++;
		currentImage %= images.length;
		con.log("toggleImage", currentImage)
		var newRotations = images[currentImage].slice();
		for (var i = 0; i < pixels * pixels; i++) {
			TweenMax.to(rotations[i], 3, {
				rotation: newRotations[i].rotation,
				easing: Back.easeInOut,
				delay: i * 0.001
			});
		}
	}

	function render(time) {
		grid.forEach((c, index) => {
			// c.rotation.y += c.rotateSpeed * 0.01;
			//c.rotateSpeed -= 0.01;
			// c.rotation.x = 0 - c.rotateAmount * Math.PI / 4;
			c.rotation.x = Math.PI / 4 - rotations[index].rotation * Math.PI / 3;
		});
		// holder.rotation.x += Math.PI * 0.005;
		// camPos.z = 100; //ortho camera
		camPos.x = 0 + Math.sin(time * 0.00012) * 50;
		// camPos.y = -cubeSize * pixels + Math.sin(time * 0.00017) * 50;
		camPos.y = 0 + Math.sin(time * 0.00017) * 50;
		camPos.z = 400 + Math.sin(time * 0.0001) * 300;

		camera.position.set(camPos.x, camPos.y, camPos.z);
		camera.lookAt( scene.position );
		renderer.render( scene, camera );
		requestAnimationFrame(render);
	}

	return {
		init: init
	}

});