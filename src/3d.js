// 3d to 2d code from: https://gist.github.com/1334810/0cb4cf5d1fa5d22d85bd4c51078af0f12c707e53


//focal length to determine perspective scaling
var focalLength = 1200


// here we set up a function to make an object with
// x, y and z properties to represent a 3D point.
make3DPoint = function(x,y,z) {
	var point = {}
	point.x = x
	point.y = y
	point.z = z
	return point
}

// similarly set up a function to make an object with
// x and y properties to represent a 2D point.
make2DPoint = function(x, y, z) {
	var point = {}
	point.x = x + sw / 2
	point.y = y + sh / 2
	point.z = z
	// con.log(point);
	return point
}


// an object to represent the 3 angles of rotation
cubeAxisRotations = make3DPoint(0,0,0)

// var costable, sintable = {}, {}

// var cos = function(angle)
// 	if costable[angle] == nil then
// 		costable[angle] = math.cos(angle)
// 	}
// 	return costable[angle]
// }

// var sin = function(angle)
// 	if sintable[angle] == nil then
// 		sintable[angle] = math.sin(angle)
// 	}
// 	return sintable[angle]
// }

// conversion function for changing an array of 3D points to an
// array of 2D points which is to be returned.
function calc2D (points, axisRotations) {
	// the array to hold transformed 2D points - the 3D points
	// from the point array which are here rotated and scaled
	//to generate a point as it would appear on the screen
	var t = []
	// Math calcs for angles - sin and cos for each (trig)
	// this will be the only time sin or cos is used for the
	// entire portion of calculating all rotations
	var sx = Math.sin(axisRotations.x)
	var cx = Math.cos(axisRotations.x)
	var sy = Math.sin(axisRotations.y)
	var cy = Math.cos(axisRotations.y)
	var sz = Math.sin(axisRotations.z)
	var cz = Math.cos(axisRotations.z)

	// a couple of variables to be used in the looping
	// of all the points in the transform process
	var x,y,z, xy,xz, yx,yz, zx,zy, scaleRatio

	// loop through all the points in your object/scene/space
	// whatever - those points passed - so each is transformed


	for (var i = 0, il = points.length; i < il; i++) {
		//apply Math to making transformations
		// based on rotations
		// assign variables for the current x, y and z
		x = points[i].x
		y = points[i].y
		z = points[i].z

		// perform the rotations around each axis
		// rotation around x
		xy = cx*y - sx*z
		xz = sx*y + cx*z
		// rotation around y
		yz = cy*xz - sy*x
		yx = sy*xz + cy*x
		// rotation around z
		zx = cz*yx - sz*xy
		zy = sz*yx + cz*xy

		// now determine perspective scaling factor
		// yz was the last calculated z value so its the
		// final value for z depth
		scaleRatio = focalLength/(focalLength + yz)
		// assign the new x and y
		x = zx*scaleRatio
		y = zy*scaleRatio
		// create transformed 2D point with the calculated values
		// adding it to the array holding all 2D points
		t[i] = make2DPoint(x, y, yz)
	}
	// after looping return the array of points as they
	// exist after the rotation and scaling

	return t
}

function calcNormal (p1, p2, p3) {

    var u = {}
    u.x = p2.x - p1.x
    u.y = p2.y - p1.y
    u.z = p2.z - p1.z

    var v = {}
    v.x = p3.x - p1.x
    v.y = p3.y - p1.y
    v.z = p3.z - p1.z

    var n = {}
    n.x = u.y * v.z - u.z * v.y
    n.y = u.z * v.x - u.x * v.z
    n.z = u.x * v.y - u.y * v.x

    return n

}



renderPlanes = function(group, planesArray, options ) {

	// var zeds = []

	var list = []

	// for (var i = 0, il = 4; i< il; i++) {
	for (var i = 0, il = planesArray.length; i< il; i++) {

		var screenPoints = calc2D(planesArray[i], cubeAxisRotations)

		var minX = 1e6, minY = 1e6, minZ = 1e6, maxX = 0, maxY = 0, maxZ = 0;

		var vertices = []

		var av = {x: 0, y: 0}

		var vil = screenPoints.length;
		for (var vi = 0; vi < vil; vi++) {

			var v = screenPoints[vi];
			vertices.push({x:v.x,y:v.y})
			// vertices[vi] = v.y

			if(v.x < minX) minX = v.x;
			if(v.x > maxX) maxX = v.x;
			if(v.y < minY) minY = v.y;
			if(v.y > maxY) maxY = v.y;
			if(v.z < minZ) minZ = v.z;
			if(v.z > maxZ) maxZ = v.z;

			av.x = av.x + v.x
			av.y = av.y + v.y

		}

		av.x = av.x / vil
		av.y = av.y / vil

		var zIndex = minZ + (maxZ - minZ) / 2

		var normal3D = calcNormal(screenPoints[0], screenPoints[1], screenPoints[2])
		var normalLength = Math.sqrt(normal3D.x * normal3D.x + normal3D.y * normal3D.y + normal3D.z * normal3D.z)
		var normalised3D = {
			x: normal3D.x / normalLength,
			y: normal3D.y / normalLength,
			z: normal3D.z / normalLength
		}


		// var normal2D = calc2D([normal3D], make3DPoint(0,0,0))
		// normal2D = normal2D[0];

		// group.beginPath()
		// group.moveTo(av.x, av.y)
		// group.lineTo(normal2D.x, normal2D.y)
		// // group.stroke();
		// group.stroke();

		// var txtZ = display.newText(group, slope, av.x, av.y, "helvetica", 15)
		// txtZ:setFillColor(0, 1, 1, 1)

		// var p = display.newPolygon( o, 0, 0, vertices )
		// p.anchorX = (vertices[1] - minX) / (maxX - minX)
		// p.anchorY = (vertices[2] - minY) / (maxY - minY)

		// display 2d bounds
		// display.newLine(group, minX, 0, minX, sh)
		// display.newLine(group, maxX, 0, maxX, sh)
		// display.newLine(group, 0, minY, sw, minY)
		// display.newLine(group, 0, maxY, sw, maxY)

		// label vertices
		// for vi, v in pairs(screenPoints) do
		// 	var txtZ = display.newText(o, math.round(v.z*10)/10, v.x - o.x, v.y - o.y, "helvetica", 15)
		// 	txtZ:setFillColor(0, 1, 1, 1)
		// }

		var fillStyle;

		var face = {
			z: zIndex,
			o: vertices
		}

		if (options) {

			var slope = {
				x: Math.acos(normalised3D.x),
				// y = math.acos(normalised3D.y),
				y: Math.asin(normal3D.y / normalLength),
				z: Math.acos(normalised3D.z)
			}

			var params = {
				slope: slope,
				bounds: [minX, minY, maxX, maxY],
				vertices: vil
			}
			face.params = params;

		}

		list[i] = face;

	}

	list.sort(function( a, b ) {
		return a.z < b.z ? 1 : -1;
	})

	// for i = 1, #list do
	// con.log(list);
	// for (var i = 0, il = list.length; i < il; i++) {
	// 	// con.log("i");
	// 	group.fillRect(list[i].o.x,list[i].o.y,10,10)
	// }
	// con.log(vertices);


	// group.fillStyle = "red"
	for (var i = 0, il = list.length; i < il; i++) {

		var vertices = list[i].o;

		if (options.fillColor) group.fillStyle = options.fillColor(list[i].params);
		// if (options.strokeWidth) p.strokeWidth = options.strokeWidth(params)
		// if (options.strokeColor) p:setStrokeColor( options.strokeColor(params) )

		group.beginPath();
		for (var v = 0, vl = vertices.length; v < vl; v++) {
			var x = vertices[v].x, y = vertices[v].y;
			// var dot = 5;group.fillRect(x - dot / 2, y - dot / 2, dot, dot);
			if (v == 0) {
				group.moveTo(x,y);
			} else {
				group.lineTo(x,y);
			}
		}
		group.closePath();
		group.fill();


		// function drawLine(indexStart) {
		// 	var lines = 5, indices = 3;
		// 	for (var j = 0; j < lines; j++) {
		// 		var xs = vertices[indexStart].x,
		// 			ys = vertices[indexStart].y,
		// 			indexLeft = (indexStart + 2) % indices,
		// 			indexRight = (indexStart + 1) % indices,
		// 			xe = (vertices[indexLeft].x - vertices[indexRight].x) * j / lines + vertices[indexRight].x,
		// 			ye = (vertices[indexLeft].y - vertices[indexRight].y) * j / lines + vertices[indexRight].y;
		// 		group.beginPath();
		// 		group.moveTo(xs,ys);
		// 		group.lineTo(xe,ye);
		// 		group.stroke();
		// 	}
		// }
		// drawLine(0);
		// drawLine(01);
		// drawLine(2);






	}


}