const geom = require("../src/geom.js");

describe("geom.polygonPerimeter", () => {
	it("should calculate the  perimeter of a polygon", (done) => {
		expect(() => geom.polygonPerimeter()).toThrow(
			"Cannot read property 'length' of undefined",
		);
		expect(geom.polygonPerimeter([])).toBe(0);
		expect(geom.polygonPerimeter([{x: 0, y: 0}])).toBe(0);
		expect(geom.polygonPerimeter([{x: 0, y: -0}])).toEqual(0);
		// invalid polygon, but perimeter makes some sense:
		expect(geom.polygonPerimeter([{x: 0, y: -0}, {x: 10, y: 10}])).toBe(
			28.284271247461902,
		);
		expect(
			geom.polygonPerimeter([
				{x: 0, y: 0},
				{x: 0, y: 10},
				{x: 10, y: 10},
			]),
		).toBe(34.14213562373095);

		expect(
			geom.polygonPerimeter([
				{x: 2, y: 2},
				{x: 4, y: 2},
				{x: 4, y: 4},
				{x: 2, y: 4},
			]),
		).toBe(8);
		expect(
			geom.polygonPerimeter([
				{x: -2, y: -2},
				{x: -2, y: 2},
				{x: 2, y: 2},
				{x: 2, y: -2},
			]),
		).toBe(16);

		expect(
			geom.polygonPerimeter([
				{x: 0, y: 0},
				{x: 0, y: -2},
				{x: 2, y: -2},
				{x: 2, y: 0},
			]),
		).toBe(8);

		expect(
			geom.polygonPerimeter([
				{x: 1, y: 1},
				{x: 1, y: -4},
				{x: 3, y: -5},
				{x: 3, y: -2},
			]),
		).toBe(13.84161925296378);

		expect(
			geom.polygonPerimeter([
				{x: 93.452, y: 46.831},
				{x: 51.228, y: 58.888},
				{x: 39.355, y: 17.56},
				{x: 97.789, y: 28.022},
				{x: 15.746, y: 68.236},
				{x: 89.113, y: 2.87},
				{x: 55.026, y: 66.584},
				{x: 89.609, y: 70.063},
				{x: 5.308, y: 91.862},
				{x: 96.64, y: 37.454},
				{x: 66.142, y: 2.874},
				{x: 23.478, y: 77.173},
				{x: 32.538, y: 11.175},
				{x: 5.193, y: 19.41},
				{x: 43.814, y: 58.927},
				{x: 19.206, y: 5.316},
				{x: 95.734, y: 31.071},
				{x: 43.516, y: 81.159},
				{x: 62.504, y: 29.209},
				{x: 25.424, y: 39.115},
			]),
		).toBe(1292.7681933018382);

		done();
	});
});
