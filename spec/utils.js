
describe("test that suite is working", function() {
	it("confirms that 1 is 1", function(done) {
		expect(1).toBe(1);
		done();
	});
});

function splitArray(array, start, end) {
	var copied1 = array.slice();
	var copied2 = array.slice();
	var chunk1 = copied1.splice(0, start);
	// console.log("chunk1", chunk1);
	var chunk3 = copied2.splice(end, array.length - end);
	// console.log("chunk3", chunk3);
	var chunk2 = copied2.splice(start, end - start);
	var array1 = chunk1.concat(chunk3);
	var array2 = chunk2;
	return [
		array1,
		array2
	];
}

function splitPolygon(array, start, end) {
	var copied1 = array.slice();
	var copied2 = array.slice();
	var chunk1 = copied1.splice(0, start + 1);
	// console.log("chunk1", chunk1);
	var chunk3 = copied2.splice(end - 1, array.length - end);
	// console.log("chunk3", chunk3);
	var chunk2 = copied2.splice(start, end - start);
	var array1 = chunk1.concat(chunk3);
	var array2 = chunk2;
	return [
		array1,
		array2
	];
}


// console.log(recursive_polygon);

describe("test that testing is working", function() {
	it("confirms the test suits is working", function(done) {

		function runTest(input, start, end, outputA, outputB) {
			var result = splitArray(input.split(""), start, end),
				actualA = result[0].join(""),
				actualB = result[1].join("");

			expect(outputA).toBe(actualA);
			expect(outputB).toBe(actualB);
		}
		runTest("abcdefgh", 3, 7, "abc" + "h", "defg");
		runTest("01234567", 2, 5, "01" + "567", "234");
		runTest("monkeysandgiraffes", 7, 10, "monkeys" + "giraffes", "and");
		runTest("0123456789", 4, 8, "0123" + "89", "4567");
		runTest("0123456789", 3, 7, "012" + "789", "3456");


		// function runPolygonTest(input, start, end, outputA, outputB) {
		// 	var result = splitPolygon(input.split(""), start, end),
		// 		actualA = result[0].join(""),
		// 		actualB = result[1].join("");

		// 	expect(outputA).toBe(actualA);
		// 	expect(outputB).toBe(actualB);
		// }
		// runPolygonTest("abcdefgh", 3, 7, "abc" + "h", "defg");
		// runPolygonTest("01234567", 2, 5, "01" + "567", "234");
		// runPolygonTest("monkeysandgiraffes", 7, 10, "monkeys" + "giraffes", "and");
		// runPolygonTest("0123456789", 4, 8, "0123" + "89", "4567");
		// runPolygonTest("0123456789", 3, 7, "012" + "789", "3456");


		done();
	});
});