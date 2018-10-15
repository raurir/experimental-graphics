const geom = require("../src/geom.js");

const {poly} = require("./helpers");

describe("geom.insetPoints", () => {
	it("should calculate a polygon inset from another polygon", (done) => {
		expect(
			geom.insetPoints(
				[{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 10}, {x: 10, y: 0}],
				1,
			),
		).toEqual([{x: 1, y: 1}, {x: 1, y: 9}, {x: 9, y: 9}, {x: 9, y: 1}]);

		expect(
			geom.insetPoints(
				[{x: 0, y: 0}, {x: 0, y: 10}, {x: 10, y: 10}, {x: 10, y: 0}],
				1,
			),
		).toEqual([{x: 1, y: 1}, {x: 1, y: 9}, {x: 9, y: 9}, {x: 9, y: 1}]);

		expect(geom.insetPoints(poly(3, 1), 0.25)).toEqual([
			{x: 6.409875621278545e-17, y: 0.4999999999999999},
			{x: 0.4330127018922193, y: -0.2499999999999999},
			{x: -0.4330127018922192, y: -0.2500000000000003},
		]);
		done();
	});
});
