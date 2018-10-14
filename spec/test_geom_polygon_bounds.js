const geom = require("../src/geom.js");

describe("geom.pointInPolygon", () => {
	it("should calculate if a point is within polygon", done => {
		expect(geom.pointInPolygon({}, {})).toBe(null);
		expect(geom.pointInPolygon([], {})).toBe(null);
		expect(geom.pointInPolygon([], { a: 1, b: 2 })).toBe(null);
		expect(geom.pointInPolygon([{ x: 1, y: 2 }], { x: 1, y: 2 })).toBe(
			null
		);
		expect(
			geom.pointInPolygon(
				[{ x: 1, y: 2 }, { x: 1, y: 2 }, { x: 1, y: 2 }],
				{
					x: 1,
					y: 2
				}
			)
		).toBe(false);
		expect(
			geom.pointInPolygon(
				[{ x: 0, y: 0 }, { x: 100, y: 0 }, { x: 50, y: 50 }],
				{ x: 50, y: 25 }
			)
		).toBe(true);

		// generated tests
		expect(
			geom.pointInPolygon(
				[
					{ x: 299, y: 575 },
					{ x: 771, y: 679 },
					{ x: 569, y: 454 },
					{ x: 799, y: 299 },
					{ x: 25, y: 180 },
					{ x: 338, y: 751 },
					{ x: 267, y: 376 },
					{ x: 714, y: 575 },
					{ x: 726, y: 623 },
					{ x: 211, y: 474 }
				],
				{ x: 508, y: 116 }
			)
		).toBe(false);
		expect(
			geom.pointInPolygon(
				[
					{ x: 299, y: 575 },
					{ x: 771, y: 679 },
					{ x: 569, y: 454 },
					{ x: 799, y: 299 },
					{ x: 25, y: 180 },
					{ x: 338, y: 751 },
					{ x: 267, y: 376 },
					{ x: 714, y: 575 },
					{ x: 726, y: 623 },
					{ x: 211, y: 474 }
				],
				{ x: 713, y: 303 }
			)
		).toBe(true);
		expect(
			geom.pointInPolygon(
				[
					{ x: 299, y: 575 },
					{ x: 771, y: 679 },
					{ x: 569, y: 454 },
					{ x: 799, y: 299 },
					{ x: 25, y: 180 },
					{ x: 338, y: 751 },
					{ x: 267, y: 376 },
					{ x: 714, y: 575 },
					{ x: 726, y: 623 },
					{ x: 211, y: 474 }
				],
				{ x: 691, y: 581 }
			)
		).toBe(true);
		expect(
			geom.pointInPolygon(
				[
					{ x: 299, y: 575 },
					{ x: 771, y: 679 },
					{ x: 569, y: 454 },
					{ x: 799, y: 299 },
					{ x: 25, y: 180 },
					{ x: 338, y: 751 },
					{ x: 267, y: 376 },
					{ x: 714, y: 575 },
					{ x: 726, y: 623 },
					{ x: 211, y: 474 }
				],
				{ x: 618, y: 565 }
			)
		).toBe(false);
		expect(
			geom.pointInPolygon(
				[
					{ x: 459, y: 550 },
					{ x: 143, y: 582 },
					{ x: 756, y: 739 },
					{ x: 97, y: 588 },
					{ x: 332, y: 357 },
					{ x: 603, y: 102 },
					{ x: 657, y: 622 },
					{ x: 514, y: 102 },
					{ x: 789, y: 228 },
					{ x: 540, y: 58 }
				],
				{ x: 618, y: 565 }
			)
		).toBe(false);
		expect(
			geom.pointInPolygon(
				[
					{ x: 459, y: 550 },
					{ x: 143, y: 582 },
					{ x: 756, y: 739 },
					{ x: 97, y: 588 },
					{ x: 332, y: 357 },
					{ x: 603, y: 102 },
					{ x: 657, y: 622 },
					{ x: 514, y: 102 },
					{ x: 789, y: 228 },
					{ x: 540, y: 58 }
				],
				{ x: 241, y: 140 }
			)
		).toBe(false);
		expect(
			geom.pointInPolygon(
				[
					{ x: 459, y: 550 },
					{ x: 143, y: 582 },
					{ x: 756, y: 739 },
					{ x: 97, y: 588 },
					{ x: 332, y: 357 },
					{ x: 603, y: 102 },
					{ x: 657, y: 622 },
					{ x: 514, y: 102 },
					{ x: 789, y: 228 },
					{ x: 540, y: 58 }
				],
				{ x: 412, y: 376 }
			)
		).toBe(true);
		expect(
			geom.pointInPolygon(
				[
					{ x: 459, y: 550 },
					{ x: 143, y: 582 },
					{ x: 756, y: 739 },
					{ x: 97, y: 588 },
					{ x: 332, y: 357 },
					{ x: 603, y: 102 },
					{ x: 657, y: 622 },
					{ x: 514, y: 102 },
					{ x: 789, y: 228 },
					{ x: 540, y: 58 }
				],
				{ x: 674, y: 383 }
			)
		).toBe(false);
		expect(
			geom.pointInPolygon(
				[
					{ x: 473, y: 222 },
					{ x: 605, y: 752 },
					{ x: 76, y: 70 },
					{ x: 487, y: 602 },
					{ x: 502, y: 398 },
					{ x: 612, y: 714 },
					{ x: 71, y: 145 },
					{ x: 50, y: 455 },
					{ x: 707, y: 21 },
					{ x: 192, y: 776 }
				],
				{ x: 674, y: 383 }
			)
		).toBe(false);
		expect(
			geom.pointInPolygon(
				[
					{ x: 473, y: 222 },
					{ x: 605, y: 752 },
					{ x: 76, y: 70 },
					{ x: 487, y: 602 },
					{ x: 502, y: 398 },
					{ x: 612, y: 714 },
					{ x: 71, y: 145 },
					{ x: 50, y: 455 },
					{ x: 707, y: 21 },
					{ x: 192, y: 776 }
				],
				{ x: 441, y: 631 }
			)
		).toBe(false);
		expect(
			geom.pointInPolygon(
				[
					{ x: 473, y: 222 },
					{ x: 605, y: 752 },
					{ x: 76, y: 70 },
					{ x: 487, y: 602 },
					{ x: 502, y: 398 },
					{ x: 612, y: 714 },
					{ x: 71, y: 145 },
					{ x: 50, y: 455 },
					{ x: 707, y: 21 },
					{ x: 192, y: 776 }
				],
				{ x: 309, y: 584 }
			)
		).toBe(true);
		expect(
			geom.pointInPolygon(
				[
					{ x: 473, y: 222 },
					{ x: 605, y: 752 },
					{ x: 76, y: 70 },
					{ x: 487, y: 602 },
					{ x: 502, y: 398 },
					{ x: 612, y: 714 },
					{ x: 71, y: 145 },
					{ x: 50, y: 455 },
					{ x: 707, y: 21 },
					{ x: 192, y: 776 }
				],
				{ x: 158, y: 319 }
			)
		).toBe(true);

		done();
	});
});

/*
// generation and performance
var timer=(function(c){
	var t={},
		f=function(){return new Date().getTime();};
	return {
		start:function(k){t[k]=f();},
		end:function(k){c.log(k,f()-t[k]);}
	};
})(console);


// generating tests
var tests = 1000000, test = 0;
var genPoint = function() {
	var num = function() { return Math.round(Math.random() * 1000) / 100;}
	return {x: num(), y: num()};
}
timer.start("newtime");
test = 0;
while (test++ < tests) {
	var a = genPoint();
	var b = genPoint();
	var c = genPoint();
	var d = genPoint();
	var intersection = geom.intersectionBetweenPoints(a, b, c, d);
}
timer.end("newtime");
timer.start("oldtime");
test = 0;
while (test++ < tests) {
	var a = genPoint();
	var b = genPoint();
	var c = genPoint();
	var d = genPoint();
	var intersection = geom.intersectionBetweenPointsOld(a, b, c, d);
}
timer.end("oldtime");
*/
