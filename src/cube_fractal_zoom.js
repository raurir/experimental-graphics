define("cube_fractal_zoom", function() {

	var cubeSize = 200;
	var gridSize = cubeSize * 1.2;
	var camera, scene, renderer;
	var sw = window.innerWidth, sh = window.innerHeight;
	var lightA, lightB, lightC;
	var next, prev;
	var destRot = {};

	function getIndex(p, num) {
		var xi = p % num - num / 2 + 0.5;
		var yi = Math.floor(p / num) % num - num / 2 + 0.5;
		var zi = Math.floor(p / num / num) - num / 2 + 0.5;
		return {xi, yi, zi};
	}

	function cubes(num) {
		var grid = [];
		var group = new THREE.Group();
		holder.add(group);
		var inner = new THREE.Group();
		group.add(inner);
		for (var p = 0; p < num * num * num; p++) {
			var c = cube();
			inner.add(c);
			var {xi, yi, zi} = getIndex(p, num);
			var x = xi * cubeSize;
			var y = yi * cubeSize;
			var z = zi * cubeSize;
			c.position.set(x, y, z);
			grid.push(c);
		}
		return {
			group, inner, num, grid
		}
	}

	function cube() {
		const material = new THREE.MeshPhongMaterial({
			color: 0x908070,
			specular: 0xffffff,
			shininess: 50,
			// wireframe: true,
		});
		const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
		return new THREE.Mesh(geometry, material);
	}

	function init() {

		scene = new THREE.Scene();

		camera = new THREE.PerspectiveCamera(100, sw / sh, 1, 20000);
		scene.add(camera);

		camera.position.set(0, 0, 1500);
		camera.lookAt( scene.position );

		lightA = new THREE.DirectionalLight(0xff0000, 1);
		scene.add(lightA);

		lightB = new THREE.DirectionalLight(0xc0a000, 1);
		scene.add(lightB);

		lightC = new THREE.DirectionalLight(0xff9900, 1);
		scene.add(lightC);

		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize(sw, sh);

		holder = new THREE.Group();
		scene.add(holder);

		var lightAmbient = new THREE.AmbientLight(0xffe0e0, 0.2);
		scene.add(lightAmbient);

		prev = cubes(2);
		next = cubes(2);

		document.body.appendChild(renderer.domElement);
		render(0);

		setTimeout(zoomIn, 1500);
	}

	function zoomIn() {

		next.group.scale.set(0.001, 0.001, 0.001);

		var scale = prev.num;

		TweenMax.to(prev.group.scale, 2.5, {
			x: scale,
			y: scale,
			z: scale,
			ease: Quad.easeInOut
		})
		// values for cube of 2,3,5, haven't worked this out yet.
		// 2: 0 > -1
		// 3: 0.5 > -1.5
		// 4: 1 > -2
		// 5: 1.5 > -2.5
		var xi = 0;
		var yi = xi//0;
		var zi = xi// 0;

		var x = (xi + 0.5) * gridSize;
		var y = (yi + 0.5) * gridSize;
		var z = (zi + 0.5) * gridSize;

		TweenMax.to(prev.inner.position, 2, {
			x: x,
			y: y,
			z: z,
			ease: Quad.easeInOut
		})

		prev.grid.forEach((c, index) => {

			var {xi, yi, zi} = getIndex(index, prev.num);
			var x = xi * gridSize;
			var y = yi * gridSize;
			var z = zi * gridSize;

			TweenMax.to(c.position, 1.5, {
				x, y, z,
				ease: Quad.easeInOut,
				delay: 1
			});

		});

		destRot = {
			x: rand.getNumber(-Math.PI, Math.PI),
			y: rand.getNumber(-Math.PI, Math.PI),
			z: rand.getNumber(-Math.PI, Math.PI),
		};

		TweenMax.to(prev.group.rotation, 2.5, {
			x: destRot.x,
			y: destRot.y,
			z: destRot.z,
			ease: Quad.easeInOut,
			onComplete: zoomOver
		})

	}

	function zoomOver() {
		next.group.scale.set(1, 1, 1);
		next.group.rotation.set(destRot.x, destRot.y, destRot.z);

		// explode
		var g = gridSize * 4;
		prev.grid.forEach((c, index) => {

			var {xi, yi, zi} = getIndex(index, prev.num);
			var x = xi * g;
			var y = yi * g;
			var z = zi * g;
			if (index != 0) {
				TweenMax.to(c.position, 2.5, {
					x, y, z,
					ease: Quad.easeIn
				});
				TweenMax.to(c.rotation, 2.5, {
					x: rand.getNumber(-2, 2),
					y: rand.getNumber(-2, 2),
					z: rand.getNumber(-2, 2),
					ease: Quint.easeIn
				});
			}
			TweenMax.to(c.scale, 2.5, {
				x: 0, y: 0, z: 0,
				ease: Quint.easeIn
			});

		});
		TweenMax.to({}, 2.5, {
			onComplete: zoomAgain
		})

	}

	function zoomAgain() {
		var temp = prev;
		prev = next;
		next = temp;

		// reset next
		next.group.scale.set(0.001, 0.001, 0.001);
		next.inner.position.set(0, 0, 0);
		next.grid.forEach((c, index) => {
			var {xi, yi, zi} = getIndex(index, next.num);
			var x = xi * cubeSize;
			var y = yi * cubeSize;
			var z = zi * cubeSize;
			c.position.set(x, y, z);
			c.rotation.set(0, 0, 0);
			c.scale.set(1, 1, 1);
		});

		setTimeout(zoomIn, 1000);
	}


	function render(time) {

		function moveLight(light, x, y, z) {
			var sc = 0.00004;
			var t = (time + 10000)
			light.position.set(
				Math.sin(t * x * sc),
				Math.sin(t * y * sc),
				Math.sin(t * z * sc)
			);
		}

		moveLight(lightA, 15, 17, 12);
		moveLight(lightB, 14, 19, 13);
		moveLight(lightC, 20, 18, 16);

		holder.rotation.z += 0.005;
		holder.rotation.x += 0.001;

		renderer.render( scene, camera );
		requestAnimationFrame(render);
	}

	return {
		init: init
	}

});