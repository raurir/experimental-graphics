const geom = require("../src/geom.js");

describe("geometry", () => {
	it("calculates area of a polygon", done => {
		expect(() => geom.polygonArea()).toThrow(
			"Cannot read property 'length' of undefined"
		);
		expect(geom.polygonArea([])).toBe(0);
		expect(geom.polygonArea([{ x: 0, y: 0 }])).toBe(0);
		expect(geom.polygonArea([{ x: 0, y: -0 }])).toEqual(0);
		expect(geom.polygonArea([{ x: 0, y: -0 }, { x: 10, y: 10 }])).toBe(0);
		expect(
			geom.polygonArea([
				{ x: 0, y: 0 },
				{ x: 0, y: 10 },
				{ x: 10, y: 10 }
			])
		).toBe(50);

		expect(
			geom.polygonArea([
				{ x: 2, y: 2 },
				{ x: 4, y: 2 },
				{ x: 4, y: 4 },
				{ x: 2, y: 4 }
			])
		).toBe(4);
		expect(
			geom.polygonArea([
				{ x: -2, y: -2 },
				{ x: -2, y: 2 },
				{ x: 2, y: 2 },
				{ x: 2, y: -2 }
			])
		).toBe(16);

		expect(
			geom.polygonArea([
				{ x: 0, y: 0 },
				{ x: 0, y: -2 },
				{ x: 2, y: -2 },
				{ x: 2, y: 0 }
			])
		).toBe(4);

		expect(
			geom.polygonArea([
				{ x: 1, y: 1 },
				{ x: 1, y: -4 },
				{ x: 3, y: -5 },
				{ x: 3, y: -2 }
			])
		).toBe(8);

		expect(
			geom.polygonArea([
				{ x: 93.452, y: 46.831 },
				{ x: 51.228, y: 58.888 },
				{ x: 39.355, y: 17.56 },
				{ x: 97.789, y: 28.022 },
				{ x: 15.746, y: 68.236 },
				{ x: 89.113, y: 2.87 },
				{ x: 55.026, y: 66.584 },
				{ x: 89.609, y: 70.063 },
				{ x: 5.308, y: 91.862 },
				{ x: 96.64, y: 37.454 },
				{ x: 66.142, y: 2.874 },
				{ x: 23.478, y: 77.173 },
				{ x: 32.538, y: 11.175 },
				{ x: 5.193, y: 19.41 },
				{ x: 43.814, y: 58.927 },
				{ x: 19.206, y: 5.316 },
				{ x: 95.734, y: 31.071 },
				{ x: 43.516, y: 81.159 },
				{ x: 62.504, y: 29.209 },
				{ x: 25.424, y: 39.115 }
			])
		).toBe(2886.6445950000016);

		expect(
			geom.polygonArea([
				{ x: 10, y: 20 },
				{ x: 70, y: 20 },
				{ x: 10, y: 60 }
			])
		).toBe(1200);

		const generatePoly = (sides, radius) => {
			const shape = [];
			const a = (Math.PI * 2) / sides;
			for (var i = 0; i < sides; i++) {
				const x = Math.sin(i * a) * radius;
				const y = Math.cos(i * a) * radius;
				shape.push({ x, y });
			}
			// now calculate the area by assembling triangles
			const halfAngle = a / 2;
			const subTriangleHeight = Math.sin(halfAngle) * radius; // also length of half an edge
			const subTriangleLength = Math.cos(halfAngle) * radius;
			const subTriangleArea = (subTriangleHeight * subTriangleLength) / 2;
			const area = subTriangleArea * sides * 2;
			return {
				shape,
				area
			};
		};

		const { shape: pentagonShape, area: pentagonArea } = generatePoly(
			5,
			12
		);
		expect(geom.polygonArea(pentagonShape)).toBe(pentagonArea);

		const { shape: octagonShape, area: octagonArea } = generatePoly(8, 117);
		expect(geom.polygonArea(octagonShape)).toBe(octagonArea);

		const {
			shape: enneadecagonShape,
			area: enneadecagonArea
		} = generatePoly(19, 19.9);
		expect(geom.polygonArea(enneadecagonShape)).toBe(enneadecagonArea);

		done();
	});
});
