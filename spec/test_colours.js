var rand = require("../src/rand.js");
var coloursGlobal = require("../src/colours.js");

describe("colours", () => {
	// untested methods:
	// getPalleteIndex - not sure if this is any use
	// setColourIndex - not a popular method
	// show* - for showcasing colours, no point

	// all tests were written on colours v1:
	var colours = coloursGlobal.instance(rand, null, "v1");

	describe("getPalette", () => {
		it("should return the current palette", () => {
			var expectedPalette = ["#a0c9d9", "#f2f0d0", "#735438", "#a64941", "#0d0d0d"];
			rand.setSeed(89733);
			expect(colours.getRandomPalette()).toEqual(expectedPalette);
			expect(colours.getPalette()).toEqual(expectedPalette);
		});
	});

	describe("getRandomPalette", () => {
		it("should return a deterministic palette", () => {
			rand.setSeed(1234);
			expect(colours.getRandomPalette()).toEqual(["#9d7e79", "#ccac95", "#9a947c", "#748b83", "#5b756c"]);
			rand.setSeed(56789);
			expect(colours.getRandomPalette()).toEqual(["#00a0b0", "#6a4a3c", "#cc333f", "#eb6841", "#edc951"]);
		});
	});

	describe("getRandomColour", () => {
		it("should return a deterministic colour", () => {
			rand.setSeed(87652);
			expect(colours.getRandomPalette()).toEqual(["#556270", "#4ecdc4", "#c7f464", "#ff6b6b", "#c44d58"]);
			expect(colours.getRandomColour()).toBe("#ff6b6b");
			expect(colours.getRandomColour()).toBe("#c44d58");
		});
	});

	describe("getCurrentColour", () => {
		it("should return the current colour", () => {
			rand.setSeed(98319);
			expect(colours.getRandomPalette()).toEqual(["#00a8c6", "#40c0cb", "#f9f2e7", "#aee239", "#8fbe00"]);
			expect(colours.getCurrentColour()).toBe("#8fbe00");
			expect(colours.getCurrentColour()).toBe("#8fbe00");
		});
	});

	describe("getNextColour", () => {
		it("should return the next colour", () => {
			rand.setSeed(1289371);
			expect(colours.getRandomPalette()).toEqual(["#4e4d4a", "#353432", "#94ba65", "#2790b0", "#2b4e72"]);
			expect(colours.getRandomColour()).toBe("#4e4d4a");
			expect(colours.getNextColour()).toBe("#353432");
			expect(colours.getNextColour()).toBe("#94ba65");
			expect(colours.getNextColour()).toBe("#2790b0");
			expect(colours.getNextColour()).toBe("#2b4e72");
			expect(colours.getNextColour()).toBe("#4e4d4a");
		});
	});

	describe("setPalette & setPaletteRange", () => {
		it("should accept and handle an externally defined palette", () => {
			rand.setSeed(5);
			colours.setPalette(["#110088", "#22ff44", "#3300ff"]);
			expect(colours.getRandomColour()).toBe("#110088");
			expect(colours.getNextColour()).toBe("#22ff44");

			colours.setPaletteRange(2);
			expect(colours.getCurrentColour()).toEqual("#110088");
			expect(colours.getNextColour()).toEqual("#22ff44");
			expect(colours.getNextColour()).toEqual("#110088");
		});
	});

	describe("setRandomPalette", () => {
		it("should set a palette by index", () => {
			rand.setSeed(500);
			expect(colours.getRandomPalette()).toEqual(["#1b676b", "#519548", "#88c425", "#bef202", "#eafde6"]);
			colours.setRandomPalette(4);
			expect(colours.getPalette()).toEqual(["#1b69ff", "#002875", "#0143c2", "#ffb002", "#ff781e"]);
		});
	});

	describe("mutateColour", () => {
		it("should mutate a colour by the specified amount", () => {
			rand.setSeed(500);
			expect(colours.mutateColour("#1b69ff", 2)).toBe("#1b69fe");
			expect(colours.mutateColour("#1b69ff", 20)).toBe("#156bff");
			expect(colours.mutateColour("#1b69ff", 200)).toBe("#6394ff");
			expect(colours.mutateColour("#1b69ff", 2000)).toBe("#00ff00");
		});
	});

	describe("mixColours", () => {
		it("should mix a set of colours to find the average", () => {
			expect(colours.mixColours(["#ff00ff", "#00ff00"])).toBe("#7f7f7f");
			expect(colours.mixColours(["#aa0000", "#ff0000"])).toBe("#d40000");
			expect(colours.mixColours(["#000000", "#111111", "#222222", "#333333", "#444444"])).toBe("#222222");
			rand.setSeed(200);
			expect(colours.mixColours(colours.getRandomPalette())).toBe("#bb8277");
		});
	});

	describe("with multiple versions", () => {
		var colV0, colV1, colV2;
		beforeEach(() => {
			var randA = rand.instance(200);
			colV0 = colours.instance(randA, null, "v0");

			var randB = rand.instance(200);
			colV1 = colours.instance(randB, null, "v1");

			var randC = rand.instance(200);
			colV2 = colours.instance(randC, null, "v2"); // this version doesn't exist right now!
		});

		it("should not have the same random colours", () => {
			colV0.getRandomPalette();
			colV1.getRandomPalette();
			colV2.getRandomPalette();
			expect(colV0.getNextColour()).not.toEqual(colV1.getNextColour());
			expect(colV0.getNextColour()).not.toEqual(colV2.getNextColour());
		});

		it("if setRandomPalette is within range, should have the same palette", () => {
			// all versions have palette index 2
			colV0.setRandomPalette(2);
			colV1.setRandomPalette(2);
			colV2.setRandomPalette(2);
			expect(colV0.getNextColour()).toEqual(colV1.getNextColour());
			colV2.getNextColour(); // otherwiser colV1 would be ahead s
			expect(colV1.getNextColour()).toEqual(colV2.getNextColour());
		});
	});

	describe("with v2", () => {
		// everything else should behave as normal but, let's find a seed that gives a palette outside v1's range...
		// turns out 20000 works.
		var r = rand.instance(20000);
		var colours = coloursGlobal.instance(r, null, "v2");

		colours.getRandomPalette();

		expect(colours.getPalleteIndex()).toBe(417); // 417 is way outside v1's range of 121!
		expect(colours.getPalette()).toEqual(["#fec998", "#76c9a3", "#423a3b", "#f8f0a3", "#b9c99a"]);
		expect(colours.getNextColour()).toEqual("#76c9a3");
	});
});
