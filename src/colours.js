var con = console;
var isNode = typeof module !== "undefined";
// if (isNode) {
// 	var rand = require('./rand.js');
// }

var colours = function(rand, version) {
	var random;
	if (rand && rand.random) {
		random = rand.random;
	} else {
		random = Math.random;
	}

	// default to latest version, with the complete palette list...
	var palettes = palettesComplete;
	if (version === "v0") {
		// there is no reason to use v0, this is just to aid backwards compatibility tests.
		palettes = palettesComplete.slice(0, 10);
	} else if (version === "v1") {
		// v1 is the version that these experiments were built on: hexagonal_tile, corona_sine, typography
		palettes = palettesComplete.slice(0, 121);
	}

	var paletteIndex = -1,
		currentPalette = null;
	var colourIndex = 0;
	var previewCSSAdded = false;

	function getRandomPalette(warning) {
		if (warning) con.warn("Ensure you call getRandomPalette!");
		paletteIndex = ~~(random() * palettes.length);
		// con.log("getRandomPalette", paletteIndex, palettes.length);
		// TODO surely colourIndex should be set to 0 here?
		currentPalette = palettes[paletteIndex];
		return currentPalette;
	}

	function setRandomPalette(_paletteIndex) {
		paletteIndex = _paletteIndex;
		currentPalette = palettes[paletteIndex];
	}

	function setPaletteRange(range) {
		if (range > currentPalette.length) return con.warn("setPaletteRange - current palette has less than", range, "colours!");
		var palette = rand.shuffle(currentPalette.slice());
		currentPalette = palette.splice(0, range);
		return currentPalette;
	}

	function getRandomColour() {
		// con.log("getRandomColour", currentPalette);
		if (currentPalette == null) getRandomPalette(true);
		colourIndex = ~~(random() * currentPalette.length);
		return currentPalette[colourIndex];
	}

	function getCurrentColour() {
		if (currentPalette == null) getRandomPalette(true);
		return currentPalette[colourIndex];
	}

	function getNextColour(offset) {
		if (currentPalette == null) getRandomPalette(true);
		if (offset != undefined) {
			colourIndex += offset;
		} else {
			colourIndex++;
		}
		colourIndex += currentPalette.length;
		colourIndex %= currentPalette.length;
		return currentPalette[colourIndex];
	}

	function channelToHex(c) {
		var hex = c.toString(16);
		return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(r, g, b) {
		return "#" + channelToHex(r) + channelToHex(g) + channelToHex(b);
	}

	function hexToRgb(hex) {
		var r = parseInt(hex.substr(1, 2), 16),
			g = parseInt(hex.substr(3, 2), 16),
			b = parseInt(hex.substr(5, 2), 16);
		return {r: r, g: g, b: b};
	}

	function mutateChannel(channel, amount, direction) {
		var mutation = Math.round(channel + (random() - 0.5) * amount);
		mutation = mutation > 255 ? 255 : mutation <= 0 ? 0 : mutation;
		return mutation;
	}

	function mutateHex(hex, amount) {
		var rgb = hexToRgb(hex),
			r = rgb.r,
			g = rgb.g,
			b = rgb.b;
		r = mutateChannel(r, amount);
		g = mutateChannel(g, amount);
		b = mutateChannel(b, amount);
		return rgbToHex(r, g, b);
	}

	function mutateColour(colour, amount) {
		if (colour.substr(0, 1) === "#" && colour.length === 7) {
			return mutateHex(colour, amount);
		}
		// TODO mutateRGB..., 3 digit hex
		con.warn("colours.mutateColour unable to mutate that colour:", colour);
		return colour;
	}

	function mixColours(colours) {
		var mixed = {r: 0, g: 0, b: 0};
		for (var c = 0, cl = colours.length; c < cl; c++) {
			var hex = colours[c];
			// con.log(rgb)
			var rgb = hexToRgb(hex);
			mixed.r += rgb.r;
			mixed.g += rgb.g;
			mixed.b += rgb.b;
		}
		mixed.r /= cl;
		mixed.g /= cl;
		mixed.b /= cl;

		mixed.r = parseInt(mixed.r);
		mixed.g = parseInt(mixed.g);
		mixed.b = parseInt(mixed.b);

		return rgbToHex(mixed.r, mixed.g, mixed.b);
	}

	function setColourIndex(index) {
		colourIndex = index;
	}

	function showPalette() {
		if (currentPalette == null) getRandomPalette(true);
		var p = dom.element("div");
		p.className = "palette";
		p.id = "palette-" + paletteIndex;
		for (var j = 0; j < currentPalette.length; j++) {
			var colour = currentPalette[j];
			var c = dom.element("div", {className: "colour", innerHTML: colour, style: {background: colour}});
			p.appendChild(c);
		}
		return p;
	}

	function showColours() {
		addPreviewCSS();
		var h = document.createElement("div");
		for (var i = 0; i < palettes.length; i++) {
			paletteIndex = i;
			currentPalette = palettes[i];
			h.appendChild(showPalette());
		}
		document.body.appendChild(h);
		return h;
	}

	function addPreviewCSS() {
		var css = [
			".palette {",
			"	clear: both;",
			"	height: 50px;",
			" margin-bottom: 20px",
			"}",
			".colour {",
			"	width: 100px;",
			"	height: 50px;",
			"	float: left;",
			"	text-align: center;",
			"	font-size: 10px;",
			"	line-height: 50px;",
			"}",
		].join("");

		var style = dom.element("style");
		style.type = "text/css";
		if (style.styleSheet) {
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}
		document.head.appendChild(style);
		previewCSSAdded = true;
	}

	// showColours();

	return {
		getPalette: function getPalette() {
			return currentPalette;
		},
		getRandomPalette: getRandomPalette,
		getRandomColour: getRandomColour,
		getCurrentColour: getCurrentColour,
		getNextColour: getNextColour,
		getPalleteIndex: function() {
			return paletteIndex;
		},
		instance: colours, // how self referential is this? circular
		setPalette: function(p) {
			currentPalette = p;
		},
		setRandomPalette: setRandomPalette,
		setColourIndex: setColourIndex,
		setPaletteRange: setPaletteRange,
		showPalette: showPalette,
		showColours: showColours,

		mutateColour: mutateColour,
		mixColours: mixColours,
	};
};

var palettesComplete = [
	["#333", "#ccc"],
	["#a0c9d9", "#f2f0d0", "#735438", "#a64941", "#0d0d0d"],
	["#d93d93", "#629c27", "#dee300", "#32393d", "#ffffff"],
	["#36190a", "#b2460b", "#ff6818", "#009aa3", "#00ecd2"],
	["#1b69ff", "#002875", "#0143c2", "#ffb002", "#ff781e"],
	["#ffbe10", "#ffae3c", "#ff7e49", "#e85137", "#333c3c"],
	["#0e1d22", "#587077", "#555555", "#ecebdf"],
	["#f2385a", "#f5a503", "#e9f1df", "#4ad9d9", "#36b1bf"],
	["#e8463e", "#611410", "#ffcfcd", "#038733", "#63f598"],
	["#4f8499", "#c95f5f", "#003145", "#012914", "#fcd457"],
	["#406874", "#84d9d9", "#b8d9d3", "#35402a", "#592c1c"],
	["#8f8164", "#d9d7ac", "#4f6373", "#293845", "#14212b"],
	["#1c2623", "#37a672", "#e2ca63", "#f2884b", "#db3323"],
	["#ffd7ae", "#163a5c", "#1d2328", "#fe6200", "#adb7bd"],
	["#ffb919", "#8c12b2", "#c200ff", "#14cc83", "#09b26f"],
	["#8c1822", "#bf1725", "#594f46", "#1c8476", "#006b5e"],
	["#cf9cb3", "#626161", "#debc92", "#b68256", "#eddfbb"],
	["#a6442e", "#a65644", "#bf7665", "#d9a79c", "#f2f2f2"],
	["#200101", "#421c0c", "#c9a860", "#4fa35e", "#076043"],
	["#435939", "#737268", "#d9d4ba", "#d9d5c5", "#0d0000"],
	["#467302", "#97bf04", "#d97904", "#a62f03", "#590902"],
	["#69d2e7", "#a7dbd8", "#e0e4cc", "#f38630", "#fa6900"],
	["#fe4365", "#fc9d9a", "#f9cdad", "#c8c8a9", "#83af9b"],
	["#ecd078", "#d95b43", "#c02942", "#542437", "#53777a"],
	["#556270", "#4ecdc4", "#c7f464", "#ff6b6b", "#c44d58"],
	["#774f38", "#e08e79", "#f1d4af", "#ece5ce", "#c5e0dc"],
	["#e8ddcb", "#cdb380", "#036564", "#033649", "#031634"],
	["#490a3d", "#bd1550", "#e97f02", "#f8ca00", "#8a9b0f"],
	["#594f4f", "#547980", "#45ada8", "#9de0ad", "#e5fcc2"],
	["#00a0b0", "#6a4a3c", "#cc333f", "#eb6841", "#edc951"],
	["#e94e77", "#d68189", "#c6a49a", "#c6e5d9", "#f4ead5"],
	["#d9ceb2", "#948c75", "#d5ded9", "#7a6a53", "#99b2b7"],
	["#ffffff", "#cbe86b", "#f2e9e1", "#1c140d", "#cbe86b"],
	["#efffcd", "#dce9be", "#555152", "#2e2633", "#99173c"],
	["#3fb8af", "#7fc7af", "#dad8a7", "#ff9e9d", "#ff3d7f"],
	["#343838", "#005f6b", "#008c9e", "#00b4cc", "#00dffc"],
	["#413e4a", "#73626e", "#b38184", "#f0b49e", "#f7e4be"],
	["#99b898", "#fecea8", "#ff847c", "#e84a5f", "#2a363b"],
	["#ff4e50", "#fc913a", "#f9d423", "#ede574", "#e1f5c4"],
	["#554236", "#f77825", "#d3ce3d", "#f1efa5", "#60b99a"],
	["#351330", "#424254", "#64908a", "#e8caa4", "#cc2a41"],
	["#00a8c6", "#40c0cb", "#f9f2e7", "#aee239", "#8fbe00"],
	["#ff4242", "#f4fad2", "#d4ee5e", "#e1edb9", "#f0f2eb"],
	["#655643", "#80bca3", "#f6f7bd", "#e6ac27", "#bf4d28"],
	["#8c2318", "#5e8c6a", "#88a65e", "#bfb35a", "#f2c45a"],
	["#fad089", "#ff9c5b", "#f5634a", "#ed303c", "#3b8183"],
	["#bcbdac", "#cfbe27", "#f27435", "#f02475", "#3b2d38"],
	["#d1e751", "#ffffff", "#000000", "#4dbce9", "#26ade4"],
	["#ff9900", "#424242", "#e9e9e9", "#bcbcbc", "#3299bb"],
	["#5d4157", "#838689", "#a8caba", "#cad7b2", "#ebe3aa"],
	["#5e412f", "#fcebb6", "#78c0a8", "#f07818", "#f0a830"],
	["#eee6ab", "#c5bc8e", "#696758", "#45484b", "#36393b"],
	["#1b676b", "#519548", "#88c425", "#bef202", "#eafde6"],
	["#f8b195", "#f67280", "#c06c84", "#6c5b7b", "#355c7d"],
	["#452632", "#91204d", "#e4844a", "#e8bf56", "#e2f7ce"],
	["#f04155", "#ff823a", "#f2f26f", "#fff7bd", "#95cfb7"],
	["#f0d8a8", "#3d1c00", "#86b8b1", "#f2d694", "#fa2a00"],
	["#2a044a", "#0b2e59", "#0d6759", "#7ab317", "#a0c55f"],
	["#67917a", "#170409", "#b8af03", "#ccbf82", "#e33258"],
	["#b9d7d9", "#668284", "#2a2829", "#493736", "#7b3b3b"],
	["#bbbb88", "#ccc68d", "#eedd99", "#eec290", "#eeaa88"],
	["#a3a948", "#edb92e", "#f85931", "#ce1836", "#009989"],
	["#e8d5b7", "#0e2430", "#fc3a51", "#f5b349", "#e8d5b9"],
	["#b3cc57", "#ecf081", "#ffbe40", "#ef746f", "#ab3e5b"],
	["#ab526b", "#bca297", "#c5ceae", "#f0e2a4", "#f4ebc3"],
	["#607848", "#789048", "#c0d860", "#f0f0d8", "#604848"],
	["#515151", "#ffffff", "#00b4ff", "#eeeeee"],
	["#3e4147", "#fffedf", "#dfba69", "#5a2e2e", "#2a2c31"],
	["#300030", "#480048", "#601848", "#c04848", "#f07241"],
	["#1c2130", "#028f76", "#b3e099", "#ffeaad", "#d14334"],
	["#a8e6ce", "#dcedc2", "#ffd3b5", "#ffaaa6", "#ff8c94"],
	["#edebe6", "#d6e1c7", "#94c7b6", "#403b33", "#d3643b"],
	["#aab3ab", "#c4cbb7", "#ebefc9", "#eee0b7", "#e8caaf"],
	["#fdf1cc", "#c6d6b8", "#987f69", "#e3ad40", "#fcd036"],
	["#cc0c39", "#e6781e", "#c8cf02", "#f8fcc1", "#1693a7"],
	["#3a111c", "#574951", "#83988e", "#bcdea5", "#e6f9bc"],
	["#fc354c", "#29221f", "#13747d", "#0abfbc", "#fcf7c5"],
	["#b9d3b0", "#81bda4", "#b28774", "#f88f79", "#f6aa93"],
	["#5e3929", "#cd8c52", "#b7d1a3", "#dee8be", "#fcf7d3"],
	["#230f2b", "#f21d41", "#ebebbc", "#bce3c5", "#82b3ae"],
	["#5c323e", "#a82743", "#e15e32", "#c0d23e", "#e5f04c"],
	["#4e395d", "#827085", "#8ebe94", "#ccfc8e", "#dc5b3e"],
	["#dad6ca", "#1bb0ce", "#4f8699", "#6a5e72", "#563444"],
	["#5b527f", "#9a8194", "#c6a9a3", "#ebd8b7", "#99bbad"],
	["#c2412d", "#d1aa34", "#a7a844", "#a46583", "#5a1e4a"],
	["#d1313d", "#e5625c", "#f9bf76", "#8eb2c5", "#615375"],
	["#9d7e79", "#ccac95", "#9a947c", "#748b83", "#5b756c"],
	["#1c0113", "#6b0103", "#a30006", "#c21a01", "#f03c02"],
	["#8dccad", "#988864", "#fea6a2", "#f9d6ac", "#ffe9af"],
	["#cfffdd", "#b4dec1", "#5c5863", "#a85163", "#ff1f4c"],
	["#75616b", "#bfcff7", "#dce4f7", "#f8f3bf", "#d34017"],
	["#b6d8c0", "#c8d9bf", "#dadabd", "#ecdbbc", "#fedcba"],
	["#382f32", "#ffeaf2", "#fcd9e5", "#fbc5d8", "#f1396d"],
	["#e3dfba", "#c8d6bf", "#93ccc6", "#6cbdb5", "#1a1f1e"],
	["#a7c5bd", "#e5ddcb", "#eb7b59", "#cf4647", "#524656"],
	["#413d3d", "#040004", "#c8ff00", "#fa023c", "#4b000f"],
	["#9dc9ac", "#fffec7", "#f56218", "#ff9d2e", "#919167"],
	["#a8a7a7", "#cc527a", "#e8175d", "#474747", "#363636"],
	["#edf6ee", "#d1c089", "#b3204d", "#412e28", "#151101"],
	["#c1b398", "#605951", "#fbeec2", "#61a6ab", "#accec0"],
	["#ffedbf", "#f7803c", "#f54828", "#2e0d23", "#f8e4c1"],
	["#7e5686", "#a5aad9", "#e8f9a2", "#f8a13f", "#ba3c3d"],
	["#5e9fa3", "#dcd1b4", "#fab87f", "#f87e7b", "#b05574"],
	["#951f2b", "#f5f4d7", "#e0dfb1", "#a5a36c", "#535233"],
	["#fffbb7", "#a6f6af", "#66b6ab", "#5b7c8d", "#4f2958"],
	["#000000", "#9f111b", "#b11623", "#292c37", "#cccccc"],
	["#eff3cd", "#b2d5ba", "#61ada0", "#248f8d", "#605063"],
	["#9cddc8", "#bfd8ad", "#ddd9ab", "#f7af63", "#633d2e"],
	["#fcfef5", "#e9ffe1", "#cdcfb7", "#d6e6c3", "#fafbe3"],
	["#84b295", "#eccf8d", "#bb8138", "#ac2005", "#2c1507"],
	["#0ca5b0", "#4e3f30", "#fefeeb", "#f8f4e4", "#a5b3aa"],
	["#4d3b3b", "#de6262", "#ffb88c", "#ffd0b3", "#f5e0d3"],
	["#b5ac01", "#ecba09", "#e86e1c", "#d41e45", "#1b1521"],
	["#4e4d4a", "#353432", "#94ba65", "#2790b0", "#2b4e72"],
	["#379f7a", "#78ae62", "#bbb749", "#e0fbac", "#1f1c0d"],
	["#ffe181", "#eee9e5", "#fad3b2", "#ffba7f", "#ff9c97"],
	["#a70267", "#f10c49", "#fb6b41", "#f6d86b", "#339194"],
	["#30261c", "#403831", "#36544f", "#1f5f61", "#0b8185"],
	["#2d2d29", "#215a6d", "#3ca2a2", "#92c7a3", "#dfece6"],
	["#f38a8a", "#55443d", "#a0cab5", "#cde9ca", "#f1edd0"],
	["#793a57", "#4d3339", "#8c873e", "#d1c5a5", "#a38a5f"],
	["#442333", "#ebd17a", "#d85a45", "#c02848", "#42767a"],
	["#340734", "#6f6561", "#879677", "#a3c68c", "#4f3649"],
	["#dad6a6", "#daab92", "#ec496a", "#e7867a", "#c7fcd7"],
	["#e2d297", "#0ec4e8", "#471701", "#0295bd", "#f07f13"],
	["#fffcbf", "#447e96", "#fefffc", "#f8d783", "#cbb24b"],
	["#716382", "#aabb9f", "#708b95", "#e7eca8", "#703d6f"],
	["#01765d", "#91ff16", "#00c16c", "#014443", "#002f34"],
	["#292445", "#250828", "#495169", "#d8cbb1", "#cdbc9d"],
	["#ffffff", "#fffbec", "#967c51", "#f0efd9", "#cfd0d0"],
	["#5b4d3d", "#d8e472", "#428d8f", "#eaecbf", "#c3d329"],
	["#1e1414", "#a3b907", "#31c5c8", "#d22043", "#24b695"],
	["#536b8c", "#4f8a8a", "#61385f", "#61a17c", "#5b4e78"],
	["#26251b", "#a1e7b8", "#ea0a43", "#f1a83e", "#f2633d"],
	["#fdeaa5", "#670960", "#9481b7", "#fec1ab", "#fb5894"],
	["#725c75", "#fcfcec", "#c1a19f", "#321f2f", "#e3cebc"],
	["#a7311c", "#cc9929", "#fedd67", "#938a40", "#352405"],
	["#fe003d", "#01c077", "#89c001", "#ff8a01", "#fabf29"],
	["#d6b99c", "#f3c8a3", "#99cabe", "#ffaa8d", "#162229"],
	["#e7aa7e", "#a79f7f", "#e0b99a", "#3b1823", "#d38574"],
	["#584332", "#a78c6a", "#f1e6c9", "#9ba657", "#f4f5f5"],
	["#d1024f", "#a6016b", "#fd3803", "#feab04", "#fb7f03"],
	["#c1dcab", "#e7a379", "#d8c878", "#e87374", "#6f6667"],
	["#d2c7b3", "#ff6c63", "#edcab0", "#d5f2dc", "#23090f"],
	["#ec5673", "#150f31", "#9eae8b", "#ccbc93", "#fcc598"],
	["#abcf91", "#f0eae5", "#383837", "#8dba86", "#bbdb73"],
	["#e9ee75", "#4b3a47", "#ffcd57", "#e7efaf", "#d6e9d4"],
	["#ff7d10", "#ffb239", "#48007e", "#ff005c", "#090310"],
	["#f1bd76", "#c3ceaf", "#f18172", "#f3f5df", "#4b3d31"],
	["#ddd1b6", "#6e997a", "#41272c", "#6ba29e", "#85aba9"],
	["#d84e32", "#1f8c94", "#4b3e4d", "#c4ac30", "#dbd8a3"],
	["#fdfad7", "#9ec0ae", "#08a7a3", "#00ccbf", "#edecc9"],
	["#bf1f63", "#562f50", "#017a7e", "#ffa687", "#d62958"],
	["#f30133", "#5f0620", "#74b9a7", "#f3cb68", "#f28263"],
	["#da0e5a", "#ff6d28", "#341228", "#991666", "#f34738"],
	["#001849", "#5f4877", "#473079", "#311861", "#916090"],
	["#d5b4b2", "#f97892", "#e5e1cd", "#231b43", "#c7d8c0"],
	["#ee96a3", "#f2b99f", "#d34770", "#dbccbe", "#de5b7f"],
	["#7b1f49", "#9e2152", "#561a3c", "#111725", "#331931"],
	["#b1e7d2", "#76b0a9", "#270a33", "#3e7b80", "#451b3d"],
	["#9a1619", "#690d35", "#c21c11", "#fb4a29", "#280805"],
	["#f6a498", "#fa8076", "#000101", "#f6c6b8", "#b5242a"],
	["#d0cfd7", "#fda887", "#fb2750", "#fe834b", "#f5e6f8"],
	["#130a13", "#3d1c32", "#f5931d", "#b24722", "#612848"],
	["#f4b9ad", "#ef0a5b", "#95a032", "#c9ce3b", "#f5f1dd"],
	["#d3d6af", "#8d7b63", "#b6cea5", "#70453e", "#9dc19d"],
	["#b3deb4", "#cee4b2", "#9bd9b4", "#d9ce84", "#69d1b4"],
	["#7d1b0c", "#e8c483", "#b39e69", "#a86b4c", "#330b0a"],
	["#658a64", "#a6b886", "#45695a", "#223336", "#e0e2ad"],
	["#439497", "#6c5c4e", "#faefd3", "#e0ceb4", "#b0a090"],
	["#f9a0a0", "#f9d7d7", "#fdfbd1", "#93644b", "#fabdbc"],
	["#823871", "#fdddb2", "#f98c88", "#d75981", "#a9bcbe"],
	["#a69a91", "#fff0c1", "#e9814d", "#493f3e", "#f9ce7e"],
	["#c9d27a", "#fdf69c", "#92c393", "#f1502c", "#c32412"],
	["#cef682", "#94dd8f", "#ff7756", "#6b6c6c", "#f8c182"],
	["#512a3f", "#7a0715", "#0c0b0c", "#faf6ec", "#89a0a9"],
	["#f9d522", "#e0f5c5", "#aed6bd", "#ede574", "#79b8b3"],
	["#cb221f", "#b9d8a0", "#fdac26", "#5a0f0d", "#fefdc0"],
	["#f25d5e", "#ffa466", "#43232f", "#395a4e", "#853c42"],
	["#9e9d93", "#ca9f92", "#f69c92", "#e4b8ac", "#d5d3c9"],
	["#eed38d", "#c3c092", "#65205d", "#666078", "#64ad92"],
	["#f0f8d9", "#234c20", "#78ab58", "#cade89", "#377f2d"],
	["#f6a541", "#fbc965", "#f55c4b", "#ffe4ad", "#a0dbb1"],
	["#c7ea8e", "#268f73", "#031021", "#80d989", "#e6f99c"],
	["#adced1", "#d2b9a1", "#010000", "#ff882f", "#ccddde"],
	["#ff685c", "#f5f5c2", "#8d315c", "#8cc8b5", "#ffc491"],
	["#502c39", "#665a4c", "#718064", "#79a786", "#1e1116"],
	["#342616", "#6aacbe", "#f1f1af", "#9cbdbd", "#ff380e"],
	["#f7f8ed", "#01426d", "#095584", "#afdd2a", "#066698"],
	["#ffefad", "#e2b366", "#e4db85", "#e48b68", "#685024"],
	["#abddad", "#dedfae", "#ccdead", "#bbddad", "#efdeac"],
	["#752465", "#fdcfbf", "#e33e75", "#ffb79f", "#5e0c3b"],
	["#017e81", "#fb6901", "#00b9bc", "#004952", "#f63801"],
	["#cfe779", "#8dd29d", "#fcb554", "#ff5355", "#5cabc3"],
	["#fee2b2", "#97b59c", "#a9636e", "#b8113e", "#cecca9"],
	["#909d9f", "#7a8c8a", "#7fa7a7", "#a78d8c", "#ff0e51"],
	["#7dbdb9", "#181619", "#e3ddcf", "#aaccbc", "#e23022"],
	["#a8be68", "#c0df5e", "#98a76e", "#b4cd6a", "#6da679"],
	["#c7946c", "#965d62", "#2b222c", "#f2d874", "#5d4352"],
	["#8d8770", "#f3c0ae", "#b7cbc0", "#f9a898", "#f4dbbe"],
	["#f4ecb6", "#231a2c", "#fe0a55", "#fec098", "#f47476"],
	["#f06b51", "#384340", "#e1d673", "#fbf4b1", "#45aab8"],
	["#ffb770", "#fff4d7", "#da6053", "#000410", "#84bec4"],
	["#83837e", "#94b154", "#e0e1df", "#bffb36", "#bcea07"],
	["#e96e9d", "#c8306c", "#90244e", "#532638", "#4caa8d"],
	["#e6ead4", "#1f0a1d", "#334e53", "#9acb77", "#44936b"],
	["#ac8c33", "#8b5a7b", "#dde0d0", "#c6be99", "#92755f"],
	["#ec898f", "#eee9c6", "#e5d0cb", "#eca3a5", "#ec7c82"],
	["#321c3a", "#a61942", "#9a8f7e", "#67444e", "#c3ccb0"],
	["#63997a", "#aada89", "#f0fec8", "#3c091a", "#71243c"],
	["#37bba6", "#72175f", "#fefed9", "#8c921a", "#0b0d01"],
	["#fefed8", "#f9ac8e", "#15302f", "#ffd6a2", "#fff0b7"],
	["#5a5152", "#efd298", "#bf4869", "#b49c83", "#b7c89d"],
	["#668c4e", "#cdda1a", "#326667", "#fefe00", "#98b332"],
	["#002035", "#010100", "#1d5661", "#faffcd", "#78ae92"],
	["#7bf49a", "#595b59", "#b8fe9a", "#0de4a8", "#14c2a1"],
	["#cfedeb", "#ffefd4", "#fefee5", "#8b7b5d", "#9ed6d3"],
	["#bbe1ac", "#86ae71", "#361443", "#160132", "#563d53"],
	["#e8e79c", "#d7a979", "#606179", "#79a791", "#bfd78f"],
	["#ff3e00", "#076460", "#ffbd10", "#002d2b", "#098380"],
	["#ac8499", "#41202a", "#fd125a", "#83c1b1", "#d64882"],
	["#fcc5ca", "#fefee2", "#d0b698", "#9f6c4e", "#fb8db1"],
	["#f5dcbc", "#ccdfd1", "#a18194", "#fefad5", "#e2b7b2"],
	["#f1f2c0", "#ff7575", "#f59a70", "#e0e1a9", "#c6c67f"],
	["#4f354d", "#909f70", "#6b6c6c", "#5e4160", "#b0ce73"],
	["#9d0b41", "#191518", "#cd3e17", "#f1981d", "#49063c"],
	["#ff2555", "#ff0d70", "#d67001", "#b98100", "#f25600"],
	["#88a56f", "#a00929", "#56213c", "#f5e6d3", "#d65d2b"],
	["#3d3c3b", "#4779a0", "#b1daf8", "#dde3cb", "#7d8071"],
	["#bd5431", "#383b43", "#e0b965", "#74c8a8", "#dee2b7"],
	["#2c2320", "#64b296", "#9eaa35", "#fff9b2", "#a1e5d1"],
	["#be4d55", "#e6d5c1", "#fff4e4", "#c6b19a", "#785d55"],
	["#1a8899", "#d71b58", "#e8d94c", "#efeac5", "#370744"],
	["#e45c5e", "#ffa545", "#aa5b53", "#6f5845", "#f28052"],
	["#ffab68", "#ffdfab", "#923e32", "#ff6f5f", "#9fbac1"],
	["#7bb0a7", "#645275", "#a8dbac", "#e3f6b1", "#522a53"],
	["#fe6a5f", "#d2fcfd", "#fdbe98", "#fefac2", "#affaff"],
	["#4db3de", "#fdf0a0", "#8ee1a6", "#f37b7c", "#dd538d"],
	["#3a0e2c", "#ecac9e", "#e1eab4", "#acdfb2", "#ff4b73"],
	["#1f6664", "#151717", "#93b25a", "#c94c64", "#e7bf4a"],
	["#df1a71", "#f9f6c1", "#2b0d1b", "#c8ce12", "#349e97"],
	["#f0396d", "#8e9825", "#adc860", "#fe5f82", "#f3ffea"],
	["#f9ecf1", "#f4e2e7", "#3c363c", "#f68f9b", "#fcd6d9"],
	["#b41138", "#ffba13", "#ff8727", "#2ca0a4", "#f13914"],
	["#f7ebdb", "#fa8f6f", "#4c3c35", "#c1d9cd", "#eb623c"],
	["#f68046", "#a0b047", "#11634d", "#f1ca4d", "#f14e4d"],
	["#3d6c47", "#ef371b", "#b5b479", "#f8e5a5", "#010000"],
	["#fef2b4", "#ef9480", "#f50d4a", "#101941", "#7f043b"],
	["#566965", "#f3a177", "#cd9375", "#958a72", "#ff7474"],
	["#ff4846", "#e8da5e", "#4b4552", "#477e77", "#93b660"],
	["#72dcd1", "#fef28b", "#d0eaa3", "#efffdb", "#ace4b5"],
	["#f48823", "#010000", "#d4c8ac", "#f2ece0", "#c8ba98"],
	["#f77b3d", "#a3cba6", "#50242f", "#fde085", "#f9b966"],
	["#ccf491", "#f7c51e", "#ff013c", "#fd9209", "#dfe05a"],
	["#f1e7c4", "#616769", "#2b869f", "#98dab6", "#3dc8a7"],
	["#7eb7b0", "#342b27", "#c5e55c", "#e75a1b", "#dc1315"],
	["#48708a", "#89acc2", "#c9ff42", "#cfdfea", "#ecf6f8"],
	["#eff1d8", "#666666", "#77cca4", "#b4e037", "#b5debf"],
	["#ffab08", "#0f8e94", "#73ad75", "#ead459", "#444c52"],
	["#262c4c", "#feb24f", "#b73464", "#ff6b5b", "#82b9a9"],
	["#ebebdd", "#c3ddd5", "#e5ded6", "#d4ded6", "#e5e2ce"],
	["#a9ac7a", "#8bc099", "#c4975b", "#db825e", "#ef6c60"],
	["#ff704a", "#e9ff87", "#540044", "#c50152", "#adffe8"],
	["#4c1e4d", "#ebc387", "#1a071e", "#04676f", "#499c79"],
	["#ffb968", "#3c8b88", "#452e3d", "#e9f17e", "#fe3c59"],
	["#e15958", "#c0f0d1", "#e8d7b0", "#ffffdc", "#384152"],
	["#d8d3a8", "#5b364b", "#495f66", "#cb3746", "#d15c57"],
	["#420a37", "#e5700a", "#a50b53", "#12766c", "#f0b200"],
	["#95b59d", "#5b5947", "#c8d0b0", "#cb5d4d", "#ffffc5"],
	["#35322f", "#cbd0b4", "#ab6b6d", "#85837f", "#f6345a"],
	["#e35734", "#4c538c", "#161a1d", "#f7a11a", "#d60357"],
	["#a03f16", "#88a295", "#cb8939", "#d0c99a", "#312837"],
	["#e7d3b1", "#ecba6f", "#ef7867", "#2197a3", "#f81e6b"],
	["#89b498", "#e39a7c", "#e8d4a9", "#6e6560", "#bcbfa4"],
	["#565a64", "#8e4d65", "#c64066", "#206663", "#ff3466"],
	["#cd7094", "#845d6d", "#fedcd8", "#f6f1e1", "#feb2c1"],
	["#2e1437", "#e8edcf", "#cbd0c4", "#514360", "#958e9a"],
	["#e5e6c3", "#d7d2ae", "#e37366", "#8a8681", "#d8d9c4"],
	["#e7e3d6", "#d2c7b3", "#c84549", "#fff4da", "#6f3e3a"],
	["#d0e389", "#f6e2e3", "#badf51", "#e14790", "#e0b6ee"],
	["#a7a39d", "#8d7a67", "#e1dcda", "#d8c9b7", "#f8f1e9"],
	["#292522", "#d6a592", "#eed9b3", "#4e6160", "#a38f80"],
	["#529ea3", "#72b0a4", "#d5e3b6", "#c4dab4", "#abcdb0"],
	["#323232", "#fcffe4", "#9d0b38", "#e21c59", "#84a300"],
	["#17f8ff", "#015bc6", "#022576", "#00b3fc", "#011448"],
	["#e1d123", "#f08140", "#bd364d", "#f8f899", "#443b37"],
	["#676365", "#b0e0e9", "#849bb6", "#95d7eb", "#f3e4fa"],
	["#a9e8cb", "#24242d", "#ca1943", "#fbfee5", "#97163c"],
	["#fb9a9a", "#f8f4d6", "#625062", "#fedabe", "#e97f86"],
	["#c2b458", "#2d2c27", "#f8dfae", "#fa748f", "#998497"],
	["#f88864", "#ad4147", "#fec280", "#fee399", "#411e2e"],
	["#a22c28", "#394030", "#7b8156", "#1c090b", "#bca775"],
	["#95d1b7", "#f2da42", "#fdfbd6", "#67bd9a", "#ef4058"],
	["#fff19e", "#ffb96a", "#b5f3bc", "#ff6644", "#ffdc89"],
	["#fe42a0", "#ff90aa", "#ffccd1", "#f60069", "#4d494a"],
	["#e37b5e", "#5ab491", "#162a3c", "#e22e3f", "#f0ddaa"],
	["#047c45", "#f7be01", "#9bb51b", "#01483f", "#2b1718"],
	["#7fcfca", "#44b5c4", "#c6ede7", "#a0ded5", "#1593a6"],
	["#cd2649", "#33374d", "#003f4f", "#992b4b", "#66314c"],
	["#030d50", "#e8eeeb", "#fc0c05", "#ffc62c", "#cdebee"],
	["#e7b29a", "#e6cba6", "#8b9f9c", "#6c7677", "#ece4b4"],
	["#9c736f", "#b7ca9d", "#c36464", "#edb05b", "#efe998"],
	["#54797e", "#6a9998", "#89b9a7", "#c6cba5", "#615245"],
	["#e32691", "#302bad", "#f7dc16", "#f81667", "#ac2bac"],
	["#573a7d", "#fda699", "#e3859c", "#ca719f", "#fee4aa"],
	["#fabf9b", "#faf4c7", "#bda2a2", "#8899a1", "#f9d88a"],
	["#ff0052", "#4c490b", "#ece64e", "#e2de99", "#757548"],
	["#c6be9a", "#db5543", "#1b0f0d", "#9fb490", "#70ab86"],
	["#ffceb7", "#37270b", "#c7c797", "#fdefcf", "#97bfa8"],
	["#3a0132", "#eae9aa", "#eac688", "#0e0a28", "#7c2947"],
	["#faf7d1", "#744e77", "#8f9a92", "#c6d9ab", "#300a1d"],
	["#c0ab8b", "#000806", "#00262c", "#124646", "#0b7d7e"],
	["#ff6501", "#7bb590", "#fef3af", "#000100", "#d21900"],
	["#d5cfa9", "#5f2e47", "#c75332", "#c88934", "#7ab6ab"],
	["#080002", "#335f5b", "#91a297", "#eadfd1", "#67472c"],
	["#e4e5c5", "#cd0b30", "#d2e5c5", "#8d2137", "#b9d38c"],
	["#ddffab", "#fedaab", "#daacff", "#ffabac", "#abe5fe"],
	["#cedac2", "#f4555a", "#fa9275", "#875247", "#f6e5c7"],
	["#ffeb5d", "#ff4745", "#ffc55e", "#ff7360", "#37173c"],
	["#ec4400", "#cb9a24", "#5d525b", "#7a6ed5", "#12ce4a"],
	["#560349", "#b80340", "#e16639", "#ac8709", "#e6dd95"],
	["#fee7b2", "#ff2022", "#52bc9d", "#234341", "#a3e3b1"],
	["#2fb7ab", "#92a32a", "#046e8c", "#edbe14", "#2f9393"],
	["#c8e3c6", "#f7f6c5", "#9dae9a", "#ffc771", "#765859"],
	["#584d42", "#97865b", "#e3c77b", "#e46a6c", "#e4a56c"],
	["#b6c37e", "#efda96", "#7f5666", "#9b917c", "#8a696b"],
	["#c9d297", "#c44b2c", "#463331", "#11b9ac", "#d79744"],
	["#c0d1c1", "#2f4448", "#fff7d4", "#f6df98", "#ffb783"],
	["#f8f6f8", "#c9d0d4", "#9a1719", "#9cd3e0", "#3a3836"],
	["#555074", "#68b79d", "#548a96", "#e44a1d", "#ffb627"],
	["#fdf6c6", "#abf1e3", "#fd64a1", "#746457", "#31d5de"],
	["#b29981", "#feff9a", "#dacd8c", "#663267", "#8d6674"],
	["#b12650", "#251b21", "#6f1d62", "#ec9504", "#dd4226"],
	["#f7eed1", "#484743", "#c6cec6", "#9e9d94", "#d98a89"],
	["#a43854", "#ebbe14", "#2d2a26", "#728d78", "#6b6a5f"],
	["#eb525e", "#dfdfa0", "#e7a83e", "#9b726d", "#b1cba2"],
	["#4b4858", "#6ea67b", "#77b886", "#87c28c", "#849988"],
	["#b12249", "#efd543", "#84a39e", "#f49331", "#ffeac0"],
	["#959b8e", "#c0c9c9", "#605567", "#dcd8b7", "#a4b5ab"],
	["#c9c8b5", "#3d423c", "#f4f6bd", "#dde0c4", "#b2b29e"],
	["#f6a2a3", "#fed8d7", "#fffddc", "#dcf8f2", "#815940"],
	["#f7ebd5", "#abbf9b", "#d3d0a4", "#220b00", "#a29d7e"],
	["#296e79", "#7b917c", "#4a1239", "#c9b280", "#3a3f58"],
	["#506265", "#bcc598", "#7a8f89", "#93a789", "#f6de9e"],
	["#dbdb97", "#ef6871", "#4c1d36", "#eeae54", "#967e77"],
	["#e0c0c6", "#f3e7d6", "#c6b9c5", "#f7d8cc", "#f7c8c9"],
	["#f0edca", "#d44c1b", "#e4a730", "#058888", "#4f3e2f"],
	["#c5ae4c", "#3e2b25", "#a1a485", "#ebc287", "#dd413e"],
	["#51c9c6", "#cee791", "#e0f6c3", "#a6cd2b", "#bbdb5e"],
	["#dac091", "#f41441", "#dbe8b5", "#e0856d", "#d5f8db"],
	["#ffc6a6", "#363634", "#2b2c2c", "#f1e4c6", "#e7334c"],
	["#bbb3a2", "#adc0b5", "#897f65", "#a69a83", "#bdd5c8"],
	["#f1f1d7", "#005f60", "#017879", "#174747", "#a8c12f"],
	["#fce7bd", "#a2c4ab", "#d21d48", "#f3de51", "#622f53"],
	["#c8b949", "#bd3001", "#6f0a00", "#231615", "#c96823"],
	["#378885", "#8a044d", "#2d0332", "#0ba18b", "#5ada95"],
	["#ffddd8", "#d8d8d8", "#f5dbd9", "#e3d9d8", "#edd9d9"],
	["#9f906d", "#abb69a", "#876ffe", "#010101", "#9683a3"],
	["#fa6b64", "#7b4d48", "#f6e3ba", "#9ec5b7", "#4a4032"],
	["#a2c2bd", "#f4f3e6", "#fefeff", "#5a554f", "#e1e4d9"],
	["#f0c695", "#111652", "#db6378", "#ecebcf", "#1f7278"],
	["#b62c00", "#a9a17b", "#fcf6d1", "#8d0004", "#444545"],
	["#f6bd04", "#77bdae", "#ff703e", "#fa2e5a", "#edf7bc"],
	["#a2da5c", "#f6efbd", "#442434", "#1f0410", "#abe4aa"],
	["#f36d4f", "#3a88ca", "#1b315e", "#e9f1f9", "#9bc3e4"],
	["#567dba", "#2c4b7e", "#dde1e7", "#606e81", "#1f1f1f"],
	["#e65541", "#f8edc1", "#65a9a6", "#7a886d"],
	["#541e13", "#010405", "#626166", "#928273", "#cc9d61"],
	["#d4c097", "#e3d6c1", "#603612", "#f7f6e1", "#f8f7e3"],
	["#e7e7e7", "#f5f5f7", "#323434", "#990201", "#b90504"],
	["#4a3d3c", "#ff6162", "#f3e8e6", "#d8dec2", "#f4f9e7"],
	["#2e1b33", "#e3e490", "#99bb8a", "#ee8779", "#f26970"],
	["#f9b984", "#8f407b", "#feffe5", "#efe197", "#ff6963"],
	["#000000", "#ab4a00", "#fffeff", "#012a2f", "#f9f0ae"],
	["#f23360", "#321d2e", "#eed26a", "#e88361", "#ceedcd"],
	["#bbcaa8", "#f3ffcf", "#ec9c4e", "#687061", "#f1d57f"],
	["#a81a5c", "#f0c605", "#e7204f", "#641467", "#f66f2b"],
	["#8b211c", "#efcd4f", "#c02923", "#d0862f", "#a7ac3b"],
	["#010002", "#fe6b2a", "#340116", "#a0112c", "#d53a2e"],
	["#d16343", "#b3ba92", "#d8be5e", "#f0e7b4", "#84555f"],
	["#6d6268", "#b9a273", "#422f40", "#e9a253", "#fff0a8"],
	["#ffc91b", "#b901ff", "#b7fe01", "#fe0091", "#228cff"],
	["#fdefcc", "#eb8776", "#d34957", "#e9b15d", "#4a3730"],
	["#b9f9fe", "#a69784", "#7f7363", "#e8fcff", "#655d49"],
	["#ece8df", "#fffeff", "#45739e", "#c6d5e1", "#bdb8ae"],
	["#200f19", "#efc375", "#f99088", "#78c2ab", "#fcf5d1"],
	["#785d64", "#e4cf9d", "#78917c", "#aeb08e", "#79254b"],
	["#6c9689", "#7d1c14", "#e6e0c1", "#c0090c", "#1e2629"],
	["#ce5c50", "#362731", "#554965", "#f4a46a", "#eadfcd"],
	["#d5828e", "#322636", "#d8d8da", "#d7acb2", "#c5ffec"],
	["#c1c994", "#d4a978", "#251912", "#e3c88e", "#a8bd96"],
	["#fcca48", "#ffa926", "#f9862f", "#fd570d", "#fc6a0b"],
	["#e0dc8c", "#f5aa3e", "#6bc3ba", "#574436", "#ee4b58"],
	["#fe00ab", "#01abfe", "#aa01ff", "#a9ff01", "#ffab00"],
	["#aab0b4", "#030d23", "#3f484a", "#20293e"],
	["#fffeff", "#e1eef1", "#010101", "#670049", "#7db4b6"],
	["#185d62", "#ede0c3", "#8dbcb5", "#073940", "#3e828b"],
	["#564334", "#758917", "#cfb491", "#4a2720", "#9e9a42"],
	["#f0a890", "#b9d9b5", "#af5673", "#288c86", "#d28f8f"],
	["#750d48", "#4d002b", "#b9d8c7", "#907082", "#fff5df"],
	["#d0b68c", "#88555b", "#482d49", "#5a5b75", "#524360"],
	["#530c2f", "#ba3521", "#1d987f", "#861d25", "#f0dcbd"],
	["#f1c873", "#5b3126", "#f5876c", "#73af94", "#f2e7bd"],
	["#e6d698", "#ef7c18", "#fec11a", "#039daf", "#e22451"],
	["#25e3bb", "#e0ffc4", "#afef54", "#3e8878", "#514541"],
	["#34454f", "#232638", "#9d9d72", "#5f8172", "#e7a06f"],
	["#c06470", "#87596d", "#ed6364", "#574759", "#1b1a1b"],
	["#d7244e", "#ff5375", "#fcebaa", "#ff8f35", "#f7d66a"],
	["#bbfdc2", "#5c4a3d", "#7fd3bc", "#3b352f", "#e5f2b9"],
	["#474e70", "#010000", "#767674", "#a0ac87", "#ffffff"],
	["#ff1068", "#8f8f90", "#ecebed", "#24020e", "#9d1f4c"],
	["#66245c", "#6aa5a5", "#e6eaa4", "#a9c3a2", "#616282"],
	["#4a4c4c", "#7b6f53", "#e3ca93", "#302c20", "#b3a075"],
	["#928754", "#95a782", "#d4ce9d", "#d8523e", "#76362c"],
	["#8bb2d0", "#bed2df", "#feffff", "#e5ebf1", "#4181aa"],
	["#795c3f", "#fb4a00", "#1f1e1e", "#fbf9fa", "#cdbcad"],
	["#410402", "#fd0457", "#09acba", "#efedcb", "#fe8a06"],
	["#fec998", "#76c9a3", "#423a3b", "#f8f0a3", "#b9c99a"],
	["#67ad91", "#631f5f", "#eed48e", "#c3c093", "#695f78"],
	["#fd857d", "#ee9c91", "#bdd8bf", "#d3b9a2", "#e3e8cc"],
	["#4d6c65", "#5a5742", "#ec834e", "#ece1c6", "#eacb6f"],
	["#2a2625", "#09506e", "#7ead92", "#bbcda3", "#008890"],
	["#aec8ba", "#ffe2c9", "#fba79d", "#988c81", "#fbc8b3"],
];

if (isNode) module.exports = colours(Math); // export default colours, default to Math.random
