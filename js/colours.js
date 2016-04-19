var con = console;
var isNode = (typeof module !== 'undefined');
if (isNode) {
	var rand = require('./rand.js');
}

var colours = (function() {

	var random; if (rand) { random = rand.random; } else { random = Math.random; con.warn("!!!! colours is using native random"); }

	function shuffleArray(array) {
		for (var i = array.length - 1; i > 0; i--) {
			var j = Math.floor(random() * (i + 1));
			var temp = array[i];
			array[i] = array[j];
			array[j] = temp;
		}
		return array;
	}



	var paletteIndex = -1, currentPalette = null;
	var colourIndex = 0;
	var previewCSSAdded = false;

	function getRandomPalette(warning) {
		if (warning) con.warn("Ensure you call getRandomPalette!");
		paletteIndex = ~~(random() * palettes.length);
		// con.log("getRandomPalette", paletteIndex, palettes.length);
		currentPalette = palettes[paletteIndex];
		return currentPalette;
	}
	function setRandomPalette(_paletteIndex) {
		paletteIndex = _paletteIndex;
		currentPalette = palettes[paletteIndex];
	}

	function setPaletteRange(range) {
		if (range > currentPalette.length) return con.warn("setPaletteRange - current palette has less than", range, "colours!");
		var palette = shuffleArray(currentPalette.slice());
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
		if (currentPalette == null ) getRandomPalette(true);
		return currentPalette[colourIndex];
	}

	function getNextColour(offset) {
		if (currentPalette == null ) getRandomPalette(true);
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
		var r = parseInt(hex.substr(1,2), 16),
			g = parseInt(hex.substr(3,2), 16),
			b = parseInt(hex.substr(5,2), 16);
		return {r:r,g:g,b:b};
	}

	function mutateChannel(channel, amount, direction) {
		var mutation = Math.round(channel + (random() - 0.5) * amount);
		mutation = mutation > 255 ? 255 : mutation <= 0 ? 0 : mutation;
		return mutation;
	}

	function mutateHex(hex, amount) {
		var rgb = hexToRgb(hex), r = rgb.r, g = rgb.g, b = rgb.b;
		r = mutateChannel(r, amount);
		g = mutateChannel(g, amount);
		b = mutateChannel(b, amount);
		return rgbToHex(r,g,b);
	}

	function mutateColour(colour, amount) {
		var mutation = mutateHex(colour, amount);
		return mutation;
		// TODO mutateRGB...
	}

	function mixColours(colours) {
		var mixed = {r:0, g:0, b:0};
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

		return rgbToHex(mixed.r,mixed.g,mixed.b);
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
			var c = dom.element("div", {className:"colour", innerHTML:colour, style:{background:colour}});
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
			h.appendChild( showPalette() );
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
			"}"
		].join("");

		var style = dom.element('style');
		style.type = 'text/css';
		if (style.styleSheet){
			style.styleSheet.cssText = css;
		} else {
			style.appendChild(document.createTextNode(css));
		}
		document.head.appendChild(style);
		previewCSSAdded = true;
	}

	var palettes = [

	['#333','#ccc'],

	// from kuler
	['#A0C9D9','#F2F0D0','#735438','#A64941','#0D0D0D'],
	['#D93D93','#629C27','#DEE300','#32393D','#FFFFFF'],
	['#36190A','#B2460B','#FF6818','#009AA3','#00ECD2'],
	['#1B69FF','#002875','#0143C2','#FFB002','#FF781E'],
	['#FFBE10','#FFAE3C','#FF7E49','#E85137','#333C3C'],
	['#0E1D22','#587077','#555555','#ECEBDF'],
	['#F2385A','#F5A503','#E9F1DF','#4AD9D9','#36B1BF'],
	['#E8463E','#611410','#FFCFCD','#038733','#63F598'],
	['#4F8499','#C95F5F','#003145','#012914','#FCD457'],
	['#406874','#84D9D9','#B8D9D3','#35402A','#592C1C'],
	['#8F8164','#D9D7AC','#4F6373','#293845','#14212B'],
	['#1C2623','#37A672','#E2CA63','#F2884B','#DB3323'],
	['#FFD7AE','#163A5C','#1D2328','#FE6200','#ADB7BD'],
	['#FFB919','#8C12B2','#C200FF','#14CC83','#09B26F'],
	['#8C1822','#BF1725','#594F46','#1C8476','#006B5E'],
	['#CF9CB3','#626161','#DEBC92','#B68256','#EDDFBB'],
	['#A6442E','#A65644','#BF7665','#D9A79C','#F2F2F2'],
	['#200101','#421C0C','#C9A860','#4FA35E','#076043'],
	['#435939','#737268','#D9D4BA','#D9D5C5','#0D0000'],
	['#467302','#97BF04','#D97904','#A62F03','#590902'],

	// from colourlovers!

	[ '#69D2E7', '#A7DBD8', '#E0E4CC', '#F38630', '#FA6900' ], // id:92095
	[ '#FE4365', '#FC9D9A', '#F9CDAD', '#C8C8A9', '#83AF9B' ], // id:629637
	[ '#ECD078', '#D95B43', '#C02942', '#542437', '#53777A' ], // id:694737
	[ '#556270', '#4ECDC4', '#C7F464', '#FF6B6B', '#C44D58' ], // id:1930
	[ '#774F38', '#E08E79', '#F1D4AF', '#ECE5CE', '#C5E0DC' ], // id:49963
	[ '#E8DDCB', '#CDB380', '#036564', '#033649', '#031634' ], // id:292482
	[ '#490A3D', '#BD1550', '#E97F02', '#F8CA00', '#8A9B0F' ], // id:848743
	[ '#594F4F', '#547980', '#45ADA8', '#9DE0AD', '#E5FCC2' ], // id:443995
	[ '#00A0B0', '#6A4A3C', '#CC333F', '#EB6841', '#EDC951' ], // id:1473
	[ '#E94E77', '#D68189', '#C6A49A', '#C6E5D9', '#F4EAD5' ], // id:867235
	[ '#D9CEB2', '#948C75', '#D5DED9', '#7A6A53', '#99B2B7' ], // id:77121
	[ '#FFFFFF', '#CBE86B', '#F2E9E1', '#1C140D', '#CBE86B' ], // id:359978
	[ '#EFFFCD', '#DCE9BE', '#555152', '#2E2633', '#99173C' ], // id:444487
	[ '#3FB8AF', '#7FC7AF', '#DAD8A7', '#FF9E9D', '#FF3D7F' ], // id:932683
	[ '#343838', '#005F6B', '#008C9E', '#00B4CC', '#00DFFC' ], // id:482774
	[ '#413E4A', '#73626E', '#B38184', '#F0B49E', '#F7E4BE' ], // id:723615
	[ '#99B898', '#FECEA8', '#FF847C', '#E84A5F', '#2A363B' ], // id:1098589
	[ '#FF4E50', '#FC913A', '#F9D423', '#EDE574', '#E1F5C4' ], // id:937624
	[ '#554236', '#F77825', '#D3CE3D', '#F1EFA5', '#60B99A' ], // id:940086
	[ '#351330', '#424254', '#64908A', '#E8CAA4', '#CC2A41' ], // id:379413
	[ '#00A8C6', '#40C0CB', '#F9F2E7', '#AEE239', '#8FBE00' ], // id:46688
	[ '#FF4242', '#F4FAD2', '#D4EE5E', '#E1EDB9', '#F0F2EB' ], // id:482416
	[ '#655643', '#80BCA3', '#F6F7BD', '#E6AC27', '#BF4D28' ], // id:953498
	[ '#8C2318', '#5E8C6A', '#88A65E', '#BFB35A', '#F2C45A' ], // id:110225
	[ '#FAD089', '#FF9C5B', '#F5634A', '#ED303C', '#3B8183' ], // id:131576
	[ '#BCBDAC', '#CFBE27', '#F27435', '#F02475', '#3B2D38' ], // id:522000
	[ '#D1E751', '#FFFFFF', '#000000', '#4DBCE9', '#26ADE4' ], // id:15
	[ '#FF9900', '#424242', '#E9E9E9', '#BCBCBC', '#3299BB' ], // id:148712
	[ '#5D4157', '#838689', '#A8CABA', '#CAD7B2', '#EBE3AA' ], // id:944213
	[ '#5E412F', '#FCEBB6', '#78C0A8', '#F07818', '#F0A830' ], // id:919313
	[ '#EEE6AB', '#C5BC8E', '#696758', '#45484B', '#36393B' ], // id:90734
	[ '#1B676B', '#519548', '#88C425', '#BEF202', '#EAFDE6' ], // id:871636
	[ '#F8B195', '#F67280', '#C06C84', '#6C5B7B', '#355C7D' ], // id:1811244
	[ '#452632', '#91204D', '#E4844A', '#E8BF56', '#E2F7CE' ], // id:594151
	[ '#F04155', '#FF823A', '#F2F26F', '#FFF7BD', '#95CFB7' ], // id:1097823
	[ '#F0D8A8', '#3D1C00', '#86B8B1', '#F2D694', '#FA2A00' ], // id:656966
	[ '#2A044A', '#0B2E59', '#0D6759', '#7AB317', '#A0C55F' ], // id:81885
	[ '#67917A', '#170409', '#B8AF03', '#CCBF82', '#E33258' ], // id:559428
	[ '#B9D7D9', '#668284', '#2A2829', '#493736', '#7B3B3B' ], // id:903157
	[ '#BBBB88', '#CCC68D', '#EEDD99', '#EEC290', '#EEAA88' ], // id:87946
	[ '#A3A948', '#EDB92E', '#F85931', '#CE1836', '#009989' ], // id:845564
	[ '#E8D5B7', '#0E2430', '#FC3A51', '#F5B349', '#E8D5B9' ], // id:540619
	[ '#B3CC57', '#ECF081', '#FFBE40', '#EF746F', '#AB3E5B' ], // id:962376
	[ '#AB526B', '#BCA297', '#C5CEAE', '#F0E2A4', '#F4EBC3' ], // id:634148
	[ '#607848', '#789048', '#C0D860', '#F0F0D8', '#604848' ], // id:100694
	[ '#515151', '#FFFFFF', '#00B4FF', '#EEEEEE' ], // id:1
	[ '#3E4147', '#FFFEDF', '#DFBA69', '#5A2E2E', '#2A2C31' ], // id:174686
	[ '#300030', '#480048', '#601848', '#C04848', '#F07241' ], // id:301154
	[ '#1C2130', '#028F76', '#B3E099', '#FFEAAD', '#D14334' ], // id:1283145
	[ '#A8E6CE', '#DCEDC2', '#FFD3B5', '#FFAAA6', '#FF8C94' ], // id:1722286
	[ '#EDEBE6', '#D6E1C7', '#94C7B6', '#403B33', '#D3643B' ], // id:625987
	[ '#AAB3AB', '#C4CBB7', '#EBEFC9', '#EEE0B7', '#E8CAAF' ], // id:1058739
	[ '#FDF1CC', '#C6D6B8', '#987F69', '#E3AD40', '#FCD036' ], // id:1597233
	[ '#CC0C39', '#E6781E', '#C8CF02', '#F8FCC1', '#1693A7' ], // id:557539
	[ '#3A111C', '#574951', '#83988E', '#BCDEA5', '#E6F9BC' ], // id:143880
	[ '#FC354C', '#29221F', '#13747D', '#0ABFBC', '#FCF7C5' ], // id:778713
	[ '#B9D3B0', '#81BDA4', '#B28774', '#F88F79', '#F6AA93' ], // id:1676466
	[ '#5E3929', '#CD8C52', '#B7D1A3', '#DEE8BE', '#FCF7D3' ], // id:599215
	[ '#230F2B', '#F21D41', '#EBEBBC', '#BCE3C5', '#82B3AE' ], // id:678929
	[ '#5C323E', '#A82743', '#E15E32', '#C0D23E', '#E5F04C' ], // id:1015109
	[ '#4E395D', '#827085', '#8EBE94', '#CCFC8E', '#DC5B3E' ], // id:2562636
	[ '#DAD6CA', '#1BB0CE', '#4F8699', '#6A5E72', '#563444' ], // id:1041410
	[ '#5B527F', '#9A8194', '#C6A9A3', '#EBD8B7', '#99BBAD' ], // id:1663351
	[ '#C2412D', '#D1AA34', '#A7A844', '#A46583', '#5A1E4A' ], // id:2319650
	[ '#D1313D', '#E5625C', '#F9BF76', '#8EB2C5', '#615375' ], // id:2350697
	[ '#9D7E79', '#CCAC95', '#9A947C', '#748B83', '#5B756C' ], // id:2840532
	[ '#1C0113', '#6B0103', '#A30006', '#C21A01', '#F03C02' ], // id:401946
	[ '#8DCCAD', '#988864', '#FEA6A2', '#F9D6AC', '#FFE9AF' ], // id:1981521
	[ '#CFFFDD', '#B4DEC1', '#5C5863', '#A85163', '#FF1F4C' ], // id:803797
	[ '#75616B', '#BFCFF7', '#DCE4F7', '#F8F3BF', '#D34017' ], // id:2452235
	[ '#B6D8C0', '#C8D9BF', '#DADABD', '#ECDBBC', '#FEDCBA' ], // id:919419
	[ '#382F32', '#FFEAF2', '#FCD9E5', '#FBC5D8', '#F1396D' ], // id:530
	[ '#E3DFBA', '#C8D6BF', '#93CCC6', '#6CBDB5', '#1A1F1E' ], // id:765305
	[ '#A7C5BD', '#E5DDCB', '#EB7B59', '#CF4647', '#524656' ], // id:1606220
	[ '#413D3D', '#040004', '#C8FF00', '#FA023C', '#4B000F' ], // id:109188
	[ '#9DC9AC', '#FFFEC7', '#F56218', '#FF9D2E', '#919167' ], // id:1223060
	[ '#A8A7A7', '#CC527A', '#E8175D', '#474747', '#363636' ], // id:520649
	[ '#EDF6EE', '#D1C089', '#B3204D', '#412E28', '#151101' ], // id:803258
	[ '#C1B398', '#605951', '#FBEEC2', '#61A6AB', '#ACCEC0' ], // id:2105064
	[ '#FFEDBF', '#F7803C', '#F54828', '#2E0D23', '#F8E4C1' ], // id:806955
	[ '#7E5686', '#A5AAD9', '#E8F9A2', '#F8A13F', '#BA3C3D' ], // id:2641140
	[ '#5E9FA3', '#DCD1B4', '#FAB87F', '#F87E7B', '#B05574' ], // id:577622
	[ '#951F2B', '#F5F4D7', '#E0DFB1', '#A5A36C', '#535233' ], // id:41095
	[ '#FFFBB7', '#A6F6AF', '#66B6AB', '#5B7C8D', '#4F2958' ], // id:2316406
	[ '#000000', '#9F111B', '#B11623', '#292C37', '#CCCCCC' ], // id:10
	[ '#EFF3CD', '#B2D5BA', '#61ADA0', '#248F8D', '#605063' ], // id:1040266
	[ '#9CDDC8', '#BFD8AD', '#DDD9AB', '#F7AF63', '#633D2E' ], // id:196117
	[ '#FCFEF5', '#E9FFE1', '#CDCFB7', '#D6E6C3', '#FAFBE3' ], // id:670816
	[ '#84B295', '#ECCF8D', '#BB8138', '#AC2005', '#2C1507' ], // id:1263209
	[ '#0CA5B0', '#4E3F30', '#FEFEEB', '#F8F4E4', '#A5B3AA' ], // id:692385
	[ '#4D3B3B', '#DE6262', '#FFB88C', '#FFD0B3', '#F5E0D3' ], // id:1260807
	[ '#B5AC01', '#ECBA09', '#E86E1C', '#D41E45', '#1B1521' ], // id:772970
	[ '#4E4D4A', '#353432', '#94BA65', '#2790B0', '#2B4E72' ], // id:38562
	[ '#379F7A', '#78AE62', '#BBB749', '#E0FBAC', '#1F1C0D' ], // id:661234
	[ '#FFE181', '#EEE9E5', '#FAD3B2', '#FFBA7F', '#FF9C97' ], // id:1148698
	[ '#A70267', '#F10C49', '#FB6B41', '#F6D86B', '#339194' ], // id:804674
	[ '#30261C', '#403831', '#36544F', '#1F5F61', '#0B8185' ], // id:603439
	[ '#2D2D29', '#215A6D', '#3CA2A2', '#92C7A3', '#DFECE6' ], // id:559067
	[ '#F38A8A', '#55443D', '#A0CAB5', '#CDE9CA', '#F1EDD0' ], // id:234090
	[ '#793A57', '#4D3339', '#8C873E', '#D1C5A5', '#A38A5F' ] // id:716114

	];

	// showColours();

	return {
		getRandomPalette: getRandomPalette,
		getRandomColour: getRandomColour,
		getCurrentColour: getCurrentColour,
		getNextColour: getNextColour,
		getPalleteIndex: function() { return paletteIndex;},
		setPalette: function(p) { currentPalette = p; },
		setRandomPalette: setRandomPalette,
		setColourIndex: setColourIndex,
		setPaletteRange: setPaletteRange,
		showPalette: showPalette,
		showColours: showColours,

		mutateColour: mutateColour,
		mixColours: mixColours
	}

})();

if(typeof module !== 'undefined') module.exports = colours;