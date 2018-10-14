const geom = require("../src/geom.js");

const poly = (sides, jump) => Array(sides).fill().map((_, i) => {
	const angle = jump * i / sides * Math.PI * 2;
	return {
		x: Math.sin(angle),
		y: Math.cos(angle)
	}
})

describe("geom.polygonSelfIntersecting", () => {
	it("should return false if a polygon is not self intersecting", done => {
		expect(
			geom.polygonSelfIntersecting([
				{ x: 0, y: 0 },
				{ x: 1, y: 0 },
				{ x: 1, y: 1 },
				{ x: 0, y: 1 }
			])
		).toEqual(false);

		const pentagon = poly(5, 1);
		expect(
			geom.polygonSelfIntersecting(pentagon)
		).toEqual(false);

		const heptagon = poly(7, -1);
		expect(
			geom.polygonSelfIntersecting(heptagon)
		).toEqual(false);

		done();
	});
	it("should return true if a polygon is self intersecting", done => {
		expect(
			geom.polygonSelfIntersecting([
				{ x: 0, y: 0 },
				{ x: 1, y: 0 },
				{ x: 0, y: 1 },
				{ x: 1, y: 1 },
			])
		).toEqual(true);

		const pentagram = poly(5, 2);
		expect(
			geom.polygonSelfIntersecting(pentagram)
		).toEqual(true);

		const heptagram = poly(7, -2);
		expect(
			geom.polygonSelfIntersecting(heptagram)
		).toEqual(true);


		done();
	});
});
