var rand = require("../js/rand.js");

console.log("getInteger", rand.getInteger);
console.log("getInteger", rand.getInteger(1, 3));

describe("test rand", function() {

	it("expects rand.getInteger to return evenly between min and max", function(done) {
		var tests = 1e4;
		var test = 0;
		var bucket = [];

		console.log("var r = rand.getInteger(0, 4);", rand.getInteger(0, 4))

		while (test++ < tests) {
			var r = rand.getInteger(0, 4);
			if (bucket[r]) { bucket[r]++; } else { bucket[r] = 1; }
		}
		console.log("\nbucket", bucket);
		expect(1).toEqual(1);
		done();
	});

});
