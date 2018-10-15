function splitPolygon(array, start, end) {
	var copy = array.slice();
	var chunk1 = copy.slice(0, start + 1);
	// console.log("chunk1", chunk1);
	var chunk3 = copy.splice(end, array.length - end);
	// console.log("chunk3", chunk3);
	var chunk2 = array.slice().splice(start, end - start + 1);
	var array1 = chunk1.concat(chunk3);
	var array2 = chunk2;
	return [
		array1,
		array2
	];
}

describe("splitPolygon", function() {
	it("should split an array into smaller arrays", function(done) {

		// the test is testing s(p)licing arrays, but easier to test strings, so splitting and joining inside the test.
		function runPolygonTest(input, start, end, outputA, outputB) {
			var result = splitPolygon(input.split(""), start, end);

			expect(result.length).toBe(2);
			expect(result[0]).toBeTruthy();
			expect(result[1]).toBeTruthy();
			expect(result[0].length > 2).toBe(true);
			expect(result[1].length > 2).toBe(true);

			var actualA = result[0].join("");
			var actualB = result[1].join("");

			expect(outputA).toBe(actualA);
			expect(outputB).toBe(actualB);
		}
		runPolygonTest("abcdefgh", 3, 7, "abcdh", "defgh");
		runPolygonTest("01234567", 2, 5, "012567", "2345");
		runPolygonTest("monkeysandgiraffes", 6, 10, "monkeysgiraffes", "sandg");
		runPolygonTest("0123456789", 4, 8, "0123489", "45678");
		runPolygonTest("0123456789", 3, 7, "0123789", "34567");
		runPolygonTest("####____#####", 4, 7, "####__#####", "____");

		done();
	});
});