var rand = require("../src/rand.js");
var colours = require("../src/colours.js").instance(rand);

describe("colours", () => {
	// untested methods:
	// getPalleteIndex - not sure if this is any use
	// setColourIndex - not a popular method
	// show* - for showcasing colours, no point

	describe("getPalette", () => {
		it("should return the current palette", () => {
			var expectedPalette = ["#A0C9D9", "#F2F0D0", "#735438", "#A64941", "#0D0D0D"];
			rand.setSeed(89733);
			expect(colours.getRandomPalette()).toEqual(expectedPalette);
			expect(colours.getPalette()).toEqual(expectedPalette);
		});
	});

	describe("getRandomPalette", () => {
		it("should return a deterministic palette", () => {
			rand.setSeed(1234);
			expect(colours.getRandomPalette()).toEqual(["#9D7E79", "#CCAC95", "#9A947C", "#748B83", "#5B756C"]);
			rand.setSeed(56789);
			expect(colours.getRandomPalette()).toEqual(["#00A0B0", "#6A4A3C", "#CC333F", "#EB6841", "#EDC951"]);
		});
	});

	describe("getRandomColour", () => {
		it("should return a deterministic colour", () => {
			rand.setSeed(87652);
			expect(colours.getRandomPalette()).toEqual(["#556270", "#4ECDC4", "#C7F464", "#FF6B6B", "#C44D58"]);
			expect(colours.getRandomColour()).toBe("#FF6B6B");
			expect(colours.getRandomColour()).toBe("#C44D58");
		});
	});

	describe("getCurrentColour", () => {
		it("should return the current colour", () => {
			rand.setSeed(98319);
			expect(colours.getRandomPalette()).toEqual(["#00A8C6", "#40C0CB", "#F9F2E7", "#AEE239", "#8FBE00"]);
			expect(colours.getCurrentColour()).toBe("#8FBE00");
			expect(colours.getCurrentColour()).toBe("#8FBE00");
		});
	});

	describe("getNextColour", () => {
		it("should return the next colour", () => {
			rand.setSeed(1289371);
			expect(colours.getRandomPalette()).toEqual(["#4E4D4A", "#353432", "#94BA65", "#2790B0", "#2B4E72"]);
			expect(colours.getRandomColour()).toBe("#4E4D4A");
			expect(colours.getNextColour()).toBe("#353432");
			expect(colours.getNextColour()).toBe("#94BA65");
			expect(colours.getNextColour()).toBe("#2790B0");
			expect(colours.getNextColour()).toBe("#2B4E72");
			expect(colours.getNextColour()).toBe("#4E4D4A");
		});
	});

	describe("setPalette & setPaletteRange", () => {
		it("should accept and handle an externally defined palette", () => {
			rand.setSeed(5);
			colours.setPalette(["#110088", "#22FF44", "#3300FF"]);
			expect(colours.getRandomColour()).toBe("#110088");
			expect(colours.getNextColour()).toBe("#22FF44");

			colours.setPaletteRange(2);
			expect(colours.getCurrentColour()).toEqual("#110088");
			expect(colours.getNextColour()).toEqual("#22FF44");
			expect(colours.getNextColour()).toEqual("#110088");
		});
	});

	describe("setRandomPalette", () => {
		it("should set a palette by index", () => {
			rand.setSeed(500);
			expect(colours.getRandomPalette()).toEqual(["#1B676B", "#519548", "#88C425", "#BEF202", "#EAFDE6"]);
			colours.setRandomPalette(4);
			expect(colours.getPalette()).toEqual(["#1B69FF", "#002875", "#0143C2", "#FFB002", "#FF781E"]);
		});
	});

	describe("mutateColour", () => {
		it("should mutate a colour by the specified amount", () => {
			rand.setSeed(500);
			expect(colours.mutateColour("#1B69FF", 2)).toBe("#1b69fe");
			expect(colours.mutateColour("#1B69FF", 20)).toBe("#156bff");
			expect(colours.mutateColour("#1B69FF", 200)).toBe("#6394ff");
			expect(colours.mutateColour("#1B69FF", 2000)).toBe("#00ff00");
		});
	});

	describe("mixColours", () => {
		it("should mix a set of colours to find the average", () => {
			expect(colours.mixColours(["#FF00FF", "#00FF00"])).toBe("#7f7f7f");
			expect(colours.mixColours(["#AA0000", "#FF0000"])).toBe("#d40000");
			expect(colours.mixColours(["#000000", "#111111", "#222222", "#333333", "#444444"])).toBe("#222222");
			rand.setSeed(200);
			expect(colours.mixColours(colours.getRandomPalette())).toBe("#bb8277");
		});
	});

	describe("versions", () => {
		var colV0, colV1, colV2;
		beforeEach(() => {
			var randA = rand.instance(200);
			colV0 = colours.instance(randA, null, "v0");

			var randB = rand.instance(200);
			colV1 = colours.instance(randB, null, "v1");

			var randC = rand.instance(200);
			colV2 = colours.instance(randC, null, "v2"); // this version doesn't exist right now!
		});

		describe("with different versions", () => {
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
	});
});
