var sw = 600, sh = 600;

var bmp = dom.createCanvas(sw,sh);
document.body.appendChild(bmp.canvas);

var frame = 0;

// var planesArray = [
// 	[
// 	make3DPoint(0, 0, 0),
// 	make3DPoint(0, 0, 150),
// 	make3DPoint(0, 150, 150),
// 	make3DPoint(0, 150, 0)
// 	]
// ]






var t = ( 1 + Math.sqrt( 5 ) ) / 2
var CodedIcosahedron = {
	name: "CodedIcosahedron",
 	vertex: [
		[-1,  t,  0],[1,  t,  0],[-1, -t,  0],[1, -t,  0],
		[0, -1,  t],[0,  1,  t],[0, -1, -t],[0,  1, -t],
		[t,  0, -1],[t,  0,  1],[-t,  0, -1],[-t,  0,  1]
	],
	face: [
		[0, 11,  5],
		[0,  5,  1],
		[0,  1,  7],
		[0,  7, 10],
		[0, 10, 11],
		[1,  5,  9],[5, 11,  4],[11, 10,  2],[10,  7,  6],[7,  1,  8],
		[3,  9,  4],[3,  4,  2],[3,  2,  6],[3,  6,  8],[3,  8,  9],
		[4,  9,  5],[2,  4, 11],[6,  2, 10],[8,  6,  7],[9,  8,  1]
	]
}





var planesArray = []

function createPlanes(shape, r, offset) {

	if (offset == undefined) offset = make3DPoint(0,0,0)

	var sectors = shape.face.length;
	for (var i = 0; i < sectors; i++) {
		var face = shape.face[i]
		var plane = []
		for(var f = 0, fl = face.length; f < fl; f++) {
			var vi = face[f]
			var v = shape.vertex[vi]
			point = make3DPoint(
				offset.x + v[0] * r,
				offset.y + v[1] * r,
				offset.z + v[2] * r
			)
			plane[f] = point
		}
		planesArray.push(plane)
	}
}


// -- createPlanes(TruncatedIcosidodecahedron, 120)
createPlanes(CodedIcosahedron, 100)

con.log(planesArray);




















function animation() {

	bmp.ctx.clearRect(0,0,sw,sh)

	renderPlanes(bmp.ctx, planesArray, {
		fillColor: function(p) {
			var brightness = (p.slope.y / Math.PI + 1) * 255;
			var r = Math.round(0.23 * brightness);
			var g = Math.round(0.62 * brightness);
			var b = Math.round(0.9 * brightness);
			// if (r > 1) r = 1;
			// if (g > 1) g = 1;
			// if (b > 1) b = 1;
			return "rgba(" + [r,g,b,1].join(",") + ")";
		}
	})

	frame++

	cubeAxisRotations.x -= 0.01;
	cubeAxisRotations.y += 0.01;

	// requestAnimationFrame(animation);

}
animation();
//
window.addEventListener("keydown", function() {
	// con.log("down")
	animation();
})
