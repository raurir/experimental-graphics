const geom = require("../src/geom.js");

describe("geom.linearEquationFromPoints", () => {
	it("should return a gradient and y intercept from two points", (done) => {
		expect(
			geom.linearEquationFromPoints(
				{x: 0, y: 0},
				{x: 1, y: 1},
			),
		).toEqual({c: 0, m: 1});
		expect(
			geom.linearEquationFromPoints(
				{x: 0, y: 0},
				{x: 10, y: 0},
			),
		).toEqual({c: 0, m: 0});
		expect(
			geom.linearEquationFromPoints(
				{x: 10, y: 10},
				{x: 11, y: 8},
			),
		).toEqual({c: 30, m: -2});
		expect(
			geom.linearEquationFromPoints(
				{x: 5, y: 0},
				{x: 5, y: 8},
			),
		).toEqual({c: null, m: Number.POSITIVE_INFINITY, x: 5});
		done();
	});
});
