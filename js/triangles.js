define("triangles", function() {

	var camera, scene, renderer;
	var sw = window.innerWidth, sh = window.innerHeight;
	var holder, grid = [], lightA, lightB, lightC;

	var TAU = Math.PI * 2;
	var triangles = 48; // 48 x 48 x 3 = 6912 vertices
	var triSize = 130;
	var triangleShape;
	var theta = 1 / 6 * Math.PI; // half of a corner of an equilateral
	var lenA = triSize / Math.cos(theta);
	var lenB = lenA * Math.sin(theta);
	var lenC = (lenA + lenB) / 2;

	function generateShape() {
		var shape = new THREE.Shape();
		var points = 3;
		var triRadius = 0.99 * lenA;
		for (var i = 0; i < points + 1; i++) {
			var a = i / points * TAU;
			var point = {
				x: Math.sin(a) * triRadius,
				y: Math.cos(a) * triRadius
			}
			if (i == 0) {
				shape.moveTo(point.x, point.y);
			} else {
				shape.lineTo(point.x, point.y);
			}
		}
		return shape;
	}
	function triangle() {
		triangleShape = triangleShape || generateShape();
		var colour = Math.random() > 0.98
			? 0x14ffef
			: Math.random() > 0.99
			? 0xff1485
			: 0x413a47;
		var geometry = new THREE.ShapeGeometry(triangleShape);
		var material = new THREE.MeshPhongMaterial({
			color: colour,
			side: THREE.DoubleSide,
			specular: 0xffffff,
			shininess: rand.getNumber(40, 60)
		});
		return {
			mesh: new THREE.Mesh(geometry, material),
			falling: false
		};
	}

	function init() {

		scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2(0x000000, 0.0005);

		camera = new THREE.PerspectiveCamera(100, sw / sh, 1, 20000);
		camera.position.set(0, 1000, 1300);
		camera.lookAt(scene.position);
		scene.add(camera);

		lightA = new THREE.DirectionalLight(0xffc0c0, 0.8);
		scene.add(lightA);

		lightB = new THREE.DirectionalLight(0xffc0ff, 0.8);
		scene.add(lightB);

		lightC = new THREE.DirectionalLight(0xc0c0ff, 0.8);
		scene.add(lightC);

		ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
		scene.add(ambientLight);

		renderer = new THREE.WebGLRenderer({antialias: true});
		renderer.setSize(sw, sh);

		holder = new THREE.Group();
		scene.add(holder);

		for (var p = 0; p < triangles * triangles; p++) {
			var tri = triangle();
			holder.add(tri.mesh);

			var xi = p % triangles - triangles / 2 + 0.5;
			var zi = Math.floor(p / triangles);
			var rowEven = zi % 2;
			var row4th = Math.floor(zi / 2) % 2;

			var pos = {
				x: xi * 2 * triSize + (rowEven ^ row4th ? - triSize : 0),
				y: 0,
				z: -5000 + getZ(zi)
			};
			var rot = {
				x: Math.PI / 2,
				y: 0,
				z: rowEven * Math.PI
			}
			tri.rowIndex = zi;
			tri.mesh.position.set(pos.x, pos.y, pos.z);
			tri.mesh.rotation.set(rot.x, rot.y, rot.z);
			tri.origin = {
				pos: pos,
				rot: rot
			};
			grid.push(tri);
		}

		document.body.appendChild(renderer.domElement);
		dom.on(window, ["resize"], resize);
		render(0);
	}

	function resize(e){
		sw = window.innerWidth;
		sh = window.innerHeight
		camera.aspect = sw / sh;
		camera.updateProjectionMatrix();
		renderer.setSize(sw, sh);
	}

	function getZ(zi) {
		var rowEven = zi % 2;
		return zi * lenC + (rowEven ? 0 : lenC - lenB);
	}

	function fall(tri) {
		tri.falling = true;
		TweenMax.to(tri.mesh.position, 2.4, {
			y: -5000,
			ease: Quint.easeIn
		});
		TweenMax.to(tri.mesh.scale, 0.5, {
			x: 0.1,
			y: 0.1,
			z: 0.1,
			delay: 2,
			ease: Quint.easeIn
		});
		TweenMax.to(tri.mesh.rotation, 2.5, {
			x: rand.getNumber(-2, 2),
			y: rand.getNumber(-2, 2),
			z: rand.getNumber(-2, 2),
			ease: Quint.easeIn,
			onComplete: reset(tri)
		});
	}

	function reset(tri) {
		return function() {
			var pos = tri.origin.pos, rot = tri.origin.rot;

			tri.rowIndex -= triangles;
			pos.z = tri.mesh.position.z - getZ(triangles) + 45; // not sure what magic 45 is :)

			tri.mesh.scale.set(1, 1, 1);
			tri.mesh.position.set(pos.x, pos.y, pos.z);
			tri.mesh.rotation.set(rot.x, rot.y, rot.z);
			tri.falling = false;
		}
	}

	function render(time) {
		requestAnimationFrame(render);
		holder.rotation.z = Math.sin(time * 0.0005) * 0.05;

		var fallLimitZ = -1000 - Math.sin(time * 0.0003) * 750;

		grid.forEach((tri, index) => {
			tri.mesh.position.z += 15;
			if (tri.mesh.position.z > fallLimitZ && tri.falling == false && Math.random() > 0.9) {
				fall(tri);
			}
		});

		function moveLight(light, x, y, z) {
			var sc = 0.00003 * (time + 10000);
			light.position.set(
				Math.sin(x * sc) * 5,
				1,
				Math.sin(z * sc) - 1
			);
		}

		moveLight(lightA, 15, 0, 12);
		moveLight(lightB, 14, 0, 13);
		moveLight(lightC, 20, 0, 16);

		renderer.render(scene, camera);
	}

	return {
		init: init
	}

});