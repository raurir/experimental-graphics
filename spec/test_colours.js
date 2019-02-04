var colours = require("../src/colours.js");
var rand = require("../src/rand.js");

describe("colours", function() {
	// untested methods:
	// getPalleteIndex - not sure if this is any use
	// setColourIndex - not a popular method
	// show* - for showcasing colours, no point

	describe("getPalette", function() {
		it("should return the current palette", function() {
			var expectedPalette = ["#A0C9D9", "#F2F0D0", "#735438", "#A64941", "#0D0D0D"];
			rand.setSeed(89733);
			expect(colours.getRandomPalette()).toEqual(expectedPalette);
			expect(colours.getPalette()).toEqual(expectedPalette);
		});
	});

	describe("getRandomPalette", function() {
		it("should return a deterministic palette", function() {
			rand.setSeed(1234);
			expect(colours.getRandomPalette()).toEqual(["#9D7E79", "#CCAC95", "#9A947C", "#748B83", "#5B756C"]);
			rand.setSeed(56789);
			expect(colours.getRandomPalette()).toEqual(["#00A0B0", "#6A4A3C", "#CC333F", "#EB6841", "#EDC951"]);
		});
	});

	describe("getRandomColour", function() {
		it("should return a deterministic colour", function() {
			rand.setSeed(87652);
			expect(colours.getRandomPalette()).toEqual(["#556270", "#4ECDC4", "#C7F464", "#FF6B6B", "#C44D58"]);
			expect(colours.getRandomColour()).toBe("#FF6B6B");
			expect(colours.getRandomColour()).toBe("#C44D58");
		});
	});

	describe("getCurrentColour", function() {
		it("should return the current colour", function() {
			rand.setSeed(98319);
			expect(colours.getRandomPalette()).toEqual(["#00A8C6", "#40C0CB", "#F9F2E7", "#AEE239", "#8FBE00"]);
			expect(colours.getCurrentColour()).toBe("#8FBE00");
			expect(colours.getCurrentColour()).toBe("#8FBE00");
		});
	});

	describe("getNextColour", function() {
		it("should return the next colour", function() {
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

	describe("setPalette & setPaletteRange", function() {
		it("should accept and handle an externally defined palette", function() {
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

	describe("setRandomPalette", function() {
		it("should set a palette by index", function() {
			rand.setSeed(500);
			expect(colours.getRandomPalette()).toEqual(["#1B676B", "#519548", "#88C425", "#BEF202", "#EAFDE6"]);
			colours.setRandomPalette(4);
			expect(colours.getPalette()).toEqual(["#1B69FF", "#002875", "#0143C2", "#FFB002", "#FF781E"]);
		});
	});

	describe("mutateColour", function() {
		it("should mutate a colour by the specified amount", function() {
			rand.setSeed(500);
			expect(colours.mutateColour("#1B69FF", 2)).toBe("#1b69fe");
			expect(colours.mutateColour("#1B69FF", 20)).toBe("#156bff");
			expect(colours.mutateColour("#1B69FF", 200)).toBe("#6394ff");
			expect(colours.mutateColour("#1B69FF", 2000)).toBe("#00ff00");
		});
	});

	describe("mixColours", function() {
		it("should mix a set of colours to find the average", function() {
			expect(colours.mixColours(["#FF00FF", "#00FF00"])).toBe("#7f7f7f");
			expect(colours.mixColours(["#AA0000", "#FF0000"])).toBe("#d40000");
			expect(colours.mixColours(["#000000", "#111111", "#222222", "#333333", "#444444"])).toBe("#222222");
			rand.setSeed(200);
			expect(colours.mixColours(colours.getRandomPalette())).toBe("#bb8277");
		});
	});
});
