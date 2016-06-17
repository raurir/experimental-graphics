var geom = require("../js/geom.js");

describe("test geometry", function() {
	it("tests poing in polygon", function(done) {
		expect(geom.pointInPolygon({}, {})).toBe(null);
		expect(geom.pointInPolygon([], {})).toBe(null);
		expect(geom.pointInPolygon([], {a: 1, b: 2})).toBe(null);
		expect(geom.pointInPolygon([{x: 1, y: 2}], {x: 1, y: 2})).toBe(null);
		expect(geom.pointInPolygon([{x: 1, y: 2}, {x: 1, y: 2}, {x: 1, y: 2}], {x: 1, y: 2})).toBe(false);
		expect(geom.pointInPolygon([{x: 0, y: 0}, {x: 100, y: 0}, {x: 50, y: 50}], {x: 50, y: 25})).toBe(true);
		done();
	});
});