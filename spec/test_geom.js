var geom = require("../src/geom.js");

describe("test geometry", function() {
	/*
	it("tests point in polygon", function(done) {
		expect(geom.pointInPolygon({}, {})).toBe(null);
		expect(geom.pointInPolygon([], {})).toBe(null);
		expect(geom.pointInPolygon([], {a: 1, b: 2})).toBe(null);
		expect(geom.pointInPolygon([{x: 1, y: 2}], {x: 1, y: 2})).toBe(null);
		expect(geom.pointInPolygon([{x: 1, y: 2}, {x: 1, y: 2}, {x: 1, y: 2}], {x: 1, y: 2})).toBe(false);
		expect(geom.pointInPolygon([{x: 0, y: 0}, {x: 100, y: 0}, {x: 50, y: 50}], {x: 50, y: 25})).toBe(true);

		// generated tests
		expect(geom.pointInPolygon([{"x":299,"y":575},{"x":771,"y":679},{"x":569,"y":454},{"x":799,"y":299},{"x":25,"y":180},{"x":338,"y":751},{"x":267,"y":376},{"x":714,"y":575},{"x":726,"y":623},{"x":211,"y":474}], {"x":508,"y":116})).toBe(false)
		expect(geom.pointInPolygon([{"x":299,"y":575},{"x":771,"y":679},{"x":569,"y":454},{"x":799,"y":299},{"x":25,"y":180},{"x":338,"y":751},{"x":267,"y":376},{"x":714,"y":575},{"x":726,"y":623},{"x":211,"y":474}], {"x":713,"y":303})).toBe(true)
		expect(geom.pointInPolygon([{"x":299,"y":575},{"x":771,"y":679},{"x":569,"y":454},{"x":799,"y":299},{"x":25,"y":180},{"x":338,"y":751},{"x":267,"y":376},{"x":714,"y":575},{"x":726,"y":623},{"x":211,"y":474}], {"x":691,"y":581})).toBe(true)
		expect(geom.pointInPolygon([{"x":299,"y":575},{"x":771,"y":679},{"x":569,"y":454},{"x":799,"y":299},{"x":25,"y":180},{"x":338,"y":751},{"x":267,"y":376},{"x":714,"y":575},{"x":726,"y":623},{"x":211,"y":474}], {"x":618,"y":565})).toBe(false)
		expect(geom.pointInPolygon([{"x":459,"y":550},{"x":143,"y":582},{"x":756,"y":739},{"x":97,"y":588},{"x":332,"y":357},{"x":603,"y":102},{"x":657,"y":622},{"x":514,"y":102},{"x":789,"y":228},{"x":540,"y":58}], {"x":618,"y":565})).toBe(false)
		expect(geom.pointInPolygon([{"x":459,"y":550},{"x":143,"y":582},{"x":756,"y":739},{"x":97,"y":588},{"x":332,"y":357},{"x":603,"y":102},{"x":657,"y":622},{"x":514,"y":102},{"x":789,"y":228},{"x":540,"y":58}], {"x":241,"y":140})).toBe(false)
		expect(geom.pointInPolygon([{"x":459,"y":550},{"x":143,"y":582},{"x":756,"y":739},{"x":97,"y":588},{"x":332,"y":357},{"x":603,"y":102},{"x":657,"y":622},{"x":514,"y":102},{"x":789,"y":228},{"x":540,"y":58}], {"x":412,"y":376})).toBe(true)
		expect(geom.pointInPolygon([{"x":459,"y":550},{"x":143,"y":582},{"x":756,"y":739},{"x":97,"y":588},{"x":332,"y":357},{"x":603,"y":102},{"x":657,"y":622},{"x":514,"y":102},{"x":789,"y":228},{"x":540,"y":58}], {"x":674,"y":383})).toBe(false)
		expect(geom.pointInPolygon([{"x":473,"y":222},{"x":605,"y":752},{"x":76,"y":70},{"x":487,"y":602},{"x":502,"y":398},{"x":612,"y":714},{"x":71,"y":145},{"x":50,"y":455},{"x":707,"y":21},{"x":192,"y":776}], {"x":674,"y":383})).toBe(false)
		expect(geom.pointInPolygon([{"x":473,"y":222},{"x":605,"y":752},{"x":76,"y":70},{"x":487,"y":602},{"x":502,"y":398},{"x":612,"y":714},{"x":71,"y":145},{"x":50,"y":455},{"x":707,"y":21},{"x":192,"y":776}], {"x":441,"y":631})).toBe(false)
		expect(geom.pointInPolygon([{"x":473,"y":222},{"x":605,"y":752},{"x":76,"y":70},{"x":487,"y":602},{"x":502,"y":398},{"x":612,"y":714},{"x":71,"y":145},{"x":50,"y":455},{"x":707,"y":21},{"x":192,"y":776}], {"x":309,"y":584})).toBe(true)
		expect(geom.pointInPolygon([{"x":473,"y":222},{"x":605,"y":752},{"x":76,"y":70},{"x":487,"y":602},{"x":502,"y":398},{"x":612,"y":714},{"x":71,"y":145},{"x":50,"y":455},{"x":707,"y":21},{"x":192,"y":776}], {"x":158,"y":319})).toBe(true)


		done();
	});
	*/;

	it("tests intersection betwen two lines", function(done) {
		expect(geom.intersectionBetweenPoints({x: 0, y: 0}, {x: 1, y: 1}, {x: 1, y: 0}, {x: 0, y: 1})).toEqual({x: 0.5, y: 0.5});
		// generated tests
		expect(geom.intersectionBetweenPoints( { x: 1.26, y: 8.96 } ,  { x: 5.67, y: 4.26 } ,  { x: 7.88, y: 3.2 } ,  { x: 2.71, y: 7.11 } )).toEqual( { x: 3.694409501268442, y: 6.365504613160617 } )
		expect(geom.intersectionBetweenPoints( { x: 8.38, y: 4.28 } ,  { x: 6.25, y: 9.6 } ,  { x: 0.67, y: 6.34 } ,  { x: 8.8, y: 4.96 } )).toEqual( { x: 8.057267923854317, y: 5.086072603331002 } )
		expect(geom.intersectionBetweenPoints( { x: 4.4, y: 8.98 } ,  { x: 5.99, y: 1.47 } ,  { x: 8.47, y: 0.2 } ,  { x: 4.71, y: 3.48 } )).toEqual( { x: 5.758002988393913, y: 2.565784627145735 } )
		expect(geom.intersectionBetweenPoints( { x: 9.04, y: 9.47 } ,  { x: 0.07, y: 4 } ,  { x: 2.16, y: 0.75 } ,  { x: 0.4, y: 5.9 } )).toEqual( { x: 0.8804264931649666, y: 4.494206568295693 } )
		expect(geom.intersectionBetweenPoints( { x: 3.77, y: 4.54 } ,  { x: 6.61, y: 3.24 } ,  { x: 2.71, y: 8.94 } ,  { x: 6.15, y: 0.93 } )).toEqual( { x: 4.802639688341249, y: 4.067312818717034 } )
		expect(geom.intersectionBetweenPoints( { x: 3.32, y: 8.79 } ,  { x: 2.53, y: 0.53 } ,  { x: 6.4, y: 1.03 } ,  { x: 2.64, y: 2.97 } )).toEqual( { x: 2.757564175733809, y: 2.9093418880522366 } )
		expect(geom.intersectionBetweenPoints( { x: 9.82, y: 7.54 } ,  { x: 3.55, y: 9.58 } ,  { x: 7.71, y: 9.74 } ,  { x: 7.86, y: 7.12 } )).toEqual( { x: 7.798295061222971, y: 8.197779597305445 } )
		expect(geom.intersectionBetweenPoints( { x: 0.27, y: 1.85 } ,  { x: 8.16, y: 0.05 } ,  { x: 3.09, y: 8.38 } ,  { x: 2.27, y: 1.35 } )).toEqual( { x: 2.274968152195102, y: 1.3925928169897106 } )
		expect(geom.intersectionBetweenPoints( { x: 5.89, y: 7.05 } ,  { x: 6.96, y: 9.2 } ,  { x: 6.24, y: 7.67 } ,  { x: 4.54, y: 5.53 } )).toEqual( { x: 6.129049223556987, y: 7.530332552007031 } )
		expect(geom.intersectionBetweenPoints( { x: 3.48, y: 8.12 } ,  { x: 4.27, y: 2.75 } ,  { x: 1.38, y: 6.63 } ,  { x: 8.99, y: 2.3 } )).toEqual( { x: 3.911064254239551, y: 5.189854373080518 } )
		expect(geom.intersectionBetweenPoints( { x: 1.88, y: 7.39 } ,  { x: 7.15, y: 6.44 } ,  { x: 4.87, y: 7.11 } ,  { x: 0.66, y: 4.87 } )).toEqual( { x: 4.506413570990173, y: 6.9165478382465535 } )
		expect(geom.intersectionBetweenPoints( { x: 6.12, y: 0.9 } ,  { x: 8.83, y: 5.84 } ,  { x: 7.61, y: 4.25 } ,  { x: 9.22, y: 3.4 } )).toEqual( { x: 7.8796544764987475, y: 4.1076358353888605 } )
		expect(geom.intersectionBetweenPoints( { x: 0.24, y: 0.91 } ,  { x: 7.03, y: 4.04 } ,  { x: 5.5, y: 8.16 } ,  { x: 1.63, y: 0.42 } )).toEqual( { x: 2.3647177033492826, y: 1.8894354066985646 } )
		expect(geom.intersectionBetweenPoints( { x: 3.44, y: 9.01 } ,  { x: 3.53, y: 4.28 } ,  { x: 0.96, y: 7.58 } ,  { x: 4.6, y: 5.22 } )).toEqual( { x: 3.4985258280015055, y: 5.934142595031991 } )
		expect(geom.intersectionBetweenPoints( { x: 2.41, y: 3.16 } ,  { x: 9.4, y: 5.39 } ,  { x: 7.54, y: 6.52 } ,  { x: 0.57, y: 0.98 } )).toEqual( { x: 3.9179692858529425, y: 3.6410831913379202 } )
		expect(geom.intersectionBetweenPoints( { x: 8.09, y: 7.65 } ,  { x: 5.21, y: 1.03 } ,  { x: 10, y: 0.48 } ,  { x: 5.74, y: 8.45 } )).toEqual( { x: 7.227404114569894, y: 5.667227513351631 } )
		expect(geom.intersectionBetweenPoints( { x: 8.13, y: 1.96 } ,  { x: 3.65, y: 8.96 } ,  { x: 8.88, y: 8.1 } ,  { x: 6.61, y: 2.86 } )).toEqual( { x: 6.991051283875098, y: 3.73960736894516 } )
		expect(geom.intersectionBetweenPoints( { x: 4.34, y: 0.71 } ,  { x: 2.12, y: 9.26 } ,  { x: 1.53, y: 6.55 } ,  { x: 5.69, y: 7.29 } )).toEqual( { x: 2.7665364894063016, y: 6.769960817827081 } )
		expect(geom.intersectionBetweenPoints( { x: 2.64, y: 6.09 } ,  { x: 7.82, y: 2.33 } ,  { x: 3.87, y: 1.9 } ,  { x: 5.1, y: 8.17 } )).toEqual( { x: 4.436192370510519, y: 4.786200132602403 } )
		expect(geom.intersectionBetweenPoints( { x: 9.17, y: 8.36 } ,  { x: 6.78, y: 1.64 } ,  { x: 8.29, y: 3.24 } ,  { x: 6.23, y: 1.48 } )).toEqual( { x: 6.93832807570978, y: 2.0851735015772874 } )
		expect(geom.intersectionBetweenPoints( { x: 0.05, y: 4.57 } ,  { x: 8.56, y: 5.43 } ,  { x: 4.79, y: 0.21 } ,  { x: 3.5, y: 9.27 } )).toEqual( { x: 4.1107748369773685, y: 4.980372075182202 } )
		expect(geom.intersectionBetweenPoints( { x: 6.66, y: 7.68 } ,  { x: 1.5, y: 2.21 } ,  { x: 6.82, y: 6.64 } ,  { x: 4.15, y: 7.11 } )).toEqual( { x: 5.84143428400303, y: 6.812256886336545 } )
		expect(geom.intersectionBetweenPoints( { x: 2.39, y: 5.29 } ,  { x: 4.62, y: 8.23 } ,  { x: 2.53, y: 9.3 } ,  { x: 5.67, y: 2.69 } )).toEqual( { x: 3.6474082154522582, y: 6.947748947726296 } )
		expect(geom.intersectionBetweenPoints( { x: 4.25, y: 8.6 } ,  { x: 9.59, y: 2.74 } ,  { x: 3.96, y: 0.72 } ,  { x: 9.96, y: 5.29 } )).toEqual( { x: 8.369920119267071, y: 4.078889157508419 } )
		expect(geom.intersectionBetweenPoints( { x: 0.64, y: 9.48 } ,  { x: 8.78, y: 1.78 } ,  { x: 0.25, y: 1.76 } ,  { x: 6.34, y: 5.35 } )).toEqual( { x: 5.518154517602172, y: 4.865529510376323 } )
		expect(geom.intersectionBetweenPoints( { x: 1.64, y: 6.08 } ,  { x: 8.02, y: 8.43 } ,  { x: 0.44, y: 8.08 } ,  { x: 6.1, y: 5.94 } )).toEqual( { x: 3.711579197305058, y: 6.843042494305155 } )
		expect(geom.intersectionBetweenPoints( { x: 6.16, y: 9.18 } ,  { x: 4.22, y: 8.61 } ,  { x: 9.15, y: 7.68 } ,  { x: 2.65, y: 9.09 } )).toEqual( { x: 4.492998882057016, y: 8.6902110117384 } )
		expect(geom.intersectionBetweenPoints( { x: 5.93, y: 5.14 } ,  { x: 4.5, y: 8.24 } ,  { x: 4.86, y: 5.49 } ,  { x: 5.33, y: 10 } )).toEqual( { x: 5.027430403602191, y: 7.096619404778467 } )
		expect(geom.intersectionBetweenPoints( { x: 0.45, y: 4.04 } ,  { x: 6.51, y: 8.23 } ,  { x: 4.31, y: 4.02 } ,  { x: 5.54, y: 8.64 } )).toEqual( { x: 5.187376846805438, y: 7.3155130343423735 } )
		expect(geom.intersectionBetweenPoints( { x: 6.52, y: 6.25 } ,  { x: 3.09, y: 8.45 } ,  { x: 5.85, y: 9.81 } ,  { x: 5.97, y: 3.22 } )).toEqual( { x: 5.907673827311915, y: 6.642745650120637 } )
		expect(geom.intersectionBetweenPoints( { x: 8.3, y: 6.96 } ,  { x: 7.7, y: 1.13 } ,  { x: 8.86, y: 5.32 } ,  { x: 7.37, y: 3.07 } )).toEqual( { x: 7.997117232543242, y: 4.016989109545165 } )
		expect(geom.intersectionBetweenPoints( { x: 5.05, y: 0.16 } ,  { x: 5.12, y: 5.59 } ,  { x: 4.65, y: 1.41 } ,  { x: 6.79, y: 2.94 } )).toEqual( { x: 5.069985060496304, y: 1.710269692784741 } )
		expect(geom.intersectionBetweenPoints( { x: 0.55, y: 8.99 } ,  { x: 8.03, y: 5.44 } ,  { x: 5.37, y: 5.6 } ,  { x: 9.81, y: 5.97 } )).toEqual( { x: 7.345926517571885, y: 5.76466054313099 } )
		expect(geom.intersectionBetweenPoints( { x: 6.18, y: 2.25 } ,  { x: 7.06, y: 5.52 } ,  { x: 0.08, y: 4.48 } ,  { x: 9.75, y: 2.22 } )).toEqual( { x: 6.383653350074532, y: 3.0067573349360455 } )
		expect(geom.intersectionBetweenPoints( { x: 1.86, y: 4.22 } ,  { x: 9.03, y: 6.22 } ,  { x: 9.39, y: 9.62 } ,  { x: 4.07, y: 3.95 } )).toEqual( { x: 5.196590946194931, y: 5.150708771602491 } )
		expect(geom.intersectionBetweenPoints( { x: 4.98, y: 9.61 } ,  { x: 1.17, y: 5.2 } ,  { x: 4.82, y: 9.38 } ,  { x: 1.32, y: 8.14 } )).toEqual( { x: 4.764218811271079, y: 9.360237521707468 } )
		expect(geom.intersectionBetweenPoints( { x: 3.9, y: 8.16 } ,  { x: 0.03, y: 3.89 } ,  { x: 5.29, y: 3.94 } ,  { x: 0.17, y: 8.43 } )).toEqual( { x: 2.3845647027042176, y: 6.48793056344884 } )
		expect(geom.intersectionBetweenPoints( { x: 5.33, y: 2.93 } ,  { x: 6.6, y: 7.64 } ,  { x: 0.24, y: 1.11 } ,  { x: 8.42, y: 7.41 } )).toEqual( { x: 6.044710942516084, y: 5.58062089704784 } )
		expect(geom.intersectionBetweenPoints( { x: 6.35, y: 7.33 } ,  { x: 7.96, y: 0.24 } ,  { x: 5.49, y: 5.17 } ,  { x: 7.68, y: 2.23 } )).toEqual( { x: 7.4327304816698625, y: 2.5619508602240186 } )
		expect(geom.intersectionBetweenPoints( { x: 8.25, y: 5.22 } ,  { x: 1.81, y: 1.98 } ,  { x: 1.22, y: 1.98 } ,  { x: 9.32, y: 2.17 } )).toEqual( { x: 1.83885341561286, y: 1.994516314687215 } )
		expect(geom.intersectionBetweenPoints( { x: 9.28, y: 6.65 } ,  { x: 4.09, y: 8.81 } ,  { x: 7.2, y: 6.95 } ,  { x: 9.83, y: 7.24 } )).toEqual( { x: 8.274486703126957, y: 7.06847952239803 } )
		expect(geom.intersectionBetweenPoints( { x: 9.93, y: 2.56 } ,  { x: 2.68, y: 0.43 } ,  { x: 6.56, y: 1.33 } ,  { x: 0.58, y: 6.43 } )).toEqual( { x: 6.350764235884809, y: 1.5084452168875373 } )
		expect(geom.intersectionBetweenPoints( { x: 0.49, y: 7.47 } ,  { x: 6.11, y: 1.1 } ,  { x: 2.52, y: 3.72 } ,  { x: 9, y: 4.14 } )).toEqual( { x: 3.729323800357486, y: 3.798382098171319 } )
		expect(geom.intersectionBetweenPoints( { x: 1.31, y: 2.02 } ,  { x: 9.59, y: 0.08 } ,  { x: 8.89, y: 5.83 } ,  { x: 2.08, y: 1.4 } )).toEqual( { x: 2.5768158695416883, y: 1.7231856537547252 } )
		expect(geom.intersectionBetweenPoints( { x: 1.14, y: 9.76 } ,  { x: 4.37, y: 3.01 } ,  { x: 7.13, y: 7.49 } ,  { x: 2.07, y: 7.07 } )).toEqual( { x: 2.413568636727154, y: 7.098517554827155 } )
		expect(geom.intersectionBetweenPoints( { x: 8.82, y: 4.9 } ,  { x: 0.75, y: 9.45 } ,  { x: 7.44, y: 7.32 } ,  { x: 6.81, y: 0.07 } )).toEqual( { x: 7.303985531332486, y: 5.75475413041353 } )
		expect(geom.intersectionBetweenPoints( { x: 3.99, y: 4.26 } ,  { x: 9.45, y: 0.91 } ,  { x: 4.96, y: 7.11 } ,  { x: 7.31, y: 0.15 } )).toEqual( { x: 6.4271754217683235, y: 2.7646634316989225 } )
		expect(geom.intersectionBetweenPoints( { x: 8.86, y: 3.63 } ,  { x: 4.5, y: 9.05 } ,  { x: 2.95, y: 8.55 } ,  { x: 8.06, y: 7.1 } )).toEqual( { x: 5.479634325495224, y: 7.832197696288048 } )
		expect(geom.intersectionBetweenPoints( { x: 5.14, y: 3.59 } ,  { x: 6.7, y: 7.63 } ,  { x: 6, y: 5.33 } ,  { x: 4, y: 4.75 } )).toEqual( { x: 5.7881592150741445, y: 5.268566172371502 } )
		expect(geom.intersectionBetweenPoints( { x: 0.85, y: 5.74 } ,  { x: 9.23, y: 4.25 } ,  { x: 6.3, y: 9.39 } ,  { x: 5.75, y: 2.84 } )).toEqual( { x: 5.9178478149654, y: 4.838914887315221 } )
		expect(geom.intersectionBetweenPoints( { x: 4.23, y: 3.17 } ,  { x: 7.82, y: 0.85 } ,  { x: 3.61, y: 0.3 } ,  { x: 9.17, y: 3.39 } )).toEqual( { x: 6.331033498247354, y: 1.8122290484863894 } )
		expect(geom.intersectionBetweenPoints( { x: 9.51, y: 1.86 } ,  { x: 4.31, y: 2.51 } ,  { x: 3.32, y: 0.7 } ,  { x: 8.24, y: 8.43 } )).toEqual( { x: 4.460089874176154, y: 2.4912387657279806 } )
		expect(geom.intersectionBetweenPoints( { x: 0.01, y: 5.38 } ,  { x: 1.97, y: 3.75 } ,  { x: 0.24, y: 3.65 } ,  { x: 0.89, y: 8.27 } )).toEqual( { x: 0.4338104936379726, y: 5.027545354780665 } )
		expect(geom.intersectionBetweenPoints( { x: 0.22, y: 0.34 } ,  { x: 3.2, y: 9.34 } ,  { x: 4.23, y: 8.63 } ,  { x: 1.81, y: 9.47 } )).toEqual( { x: 3.0953210450023065, y: 9.023855505040522 } )
		expect(geom.intersectionBetweenPoints( { x: 2.51, y: 3.66 } ,  { x: 9.44, y: 4.71 } ,  { x: 6.62, y: 1.04 } ,  { x: 9.08, y: 7.16 } )).toEqual( { x: 8.007981651376145, y: 4.49302752293578 } )
		expect(geom.intersectionBetweenPoints( { x: 6.84, y: 1.12 } ,  { x: 2.22, y: 2.05 } ,  { x: 1.06, y: 6.31 } ,  { x: 7.11, y: 0.58 } )).toEqual( { x: 6.458828557859745, y: 1.1967293162749864 } )
		expect(geom.intersectionBetweenPoints( { x: 9.77, y: 1.88 } ,  { x: 2.24, y: 7.66 } ,  { x: 3.69, y: 5.52 } ,  { x: 5.28, y: 6.64 } )).toEqual( { x: 4.387680863377932, y: 6.0114481553353984 } )
		expect(geom.intersectionBetweenPoints( { x: 2.47, y: 8.86 } ,  { x: 8.05, y: 0.83 } ,  { x: 3.34, y: 6.86 } ,  { x: 5.89, y: 8.79 } )).toEqual( { x: 3.6806349313029867, y: 7.117813889182261 } )
		expect(geom.intersectionBetweenPoints( { x: 9.17, y: 8.58 } ,  { x: 2.8, y: 0.29 } ,  { x: 5.41, y: 0.52 } ,  { x: 6.59, y: 9.01 } )).toEqual( { x: 5.947318455679685, y: 4.385960753152998 } )
		expect(geom.intersectionBetweenPoints( { x: 1.08, y: 3.61 } ,  { x: 9.4, y: 4.33 } ,  { x: 7.7, y: 7.69 } ,  { x: 1.66, y: 1.98 } )).toEqual( { x: 3.6163831838066294, y: 3.8294946985986504 } )
		expect(geom.intersectionBetweenPoints( { x: 0.57, y: 8.89 } ,  { x: 6.43, y: 2.53 } ,  { x: 6.36, y: 5.12 } ,  { x: 0.81, y: 1.91 } )).toEqual( { x: 4.848896219824574, y: 4.246010246060701 } )
		expect(geom.intersectionBetweenPoints( { x: 4.63, y: 0.67 } ,  { x: 9.14, y: 6.83 } ,  { x: 6.5, y: 2.09 } ,  { x: 4.46, y: 5.96 } )).toEqual( { x: 6.152412883368144, y: 2.7493932065516105 } )
		expect(geom.intersectionBetweenPoints( { x: 2.03, y: 8.32 } ,  { x: 7.4, y: 1.55 } ,  { x: 1.93, y: 6.24 } ,  { x: 6.21, y: 3.41 } )).toEqual( { x: 5.6098960699640745, y: 3.806797692056465 } )
		expect(geom.intersectionBetweenPoints( { x: 8.63, y: 5.37 } ,  { x: 7.21, y: 7.52 } ,  { x: 8.4, y: 9.76 } ,  { x: 8.57, y: 3.93 } )).toEqual( { x: 8.52329946544338, y: 5.531553626265308 } )
		expect(geom.intersectionBetweenPoints( { x: 3.87, y: 6.31 } ,  { x: 2.05, y: 1.77 } ,  { x: 4.59, y: 2.79 } ,  { x: 0.73, y: 2.02 } )).toEqual( { x: 2.2736648266451653, y: 2.3279331389939846 } )
		expect(geom.intersectionBetweenPoints( { x: 5.36, y: 5.07 } ,  { x: 9.02, y: 7.92 } ,  { x: 4.51, y: 8.59 } ,  { x: 8.29, y: 5.47 } )).toEqual( { x: 7.117021656257603, y: 6.438172601184199 } )
		expect(geom.intersectionBetweenPoints( { x: 6.9, y: 5.34 } ,  { x: 4.2, y: 9.7 } ,  { x: 4.27, y: 9.25 } ,  { x: 6.5, y: 8.47 } )).toEqual( { x: 4.536365665371285, y: 9.156831740363407 } )
		expect(geom.intersectionBetweenPoints( { x: 1.75, y: 2.74 } ,  { x: 8.45, y: 7.31 } ,  { x: 6.56, y: 5.58 } ,  { x: 1.75, y: 3.19 } )).toEqual( { x: 4.179699934659137, y: 4.397272940506308 } )
		expect(geom.intersectionBetweenPoints( { x: 3.6, y: 0.14 } ,  { x: 3.8, y: 4.92 } ,  { x: 2.28, y: 2.05 } ,  { x: 8.02, y: 4.04 } )).toEqual( { x: 3.7005222047989585, y: 2.5424806946951097 } )
		expect(geom.intersectionBetweenPoints( { x: 1.4, y: 8.01 } ,  { x: 4.53, y: 0.01 } ,  { x: 6.39, y: 3.24 } ,  { x: 0.29, y: 4.64 } )).toEqual( { x: 2.9580942410734385, y: 4.027650502048719 } )
		expect(geom.intersectionBetweenPoints( { x: 9.49, y: 5.51 } ,  { x: 1.61, y: 1.66 } ,  { x: 0.64, y: 6.67 } ,  { x: 1.9, y: 9.4 } )).toEqual( null )
		expect(geom.intersectionBetweenPoints( { x: 4.85, y: 4.07 } ,  { x: 9.59, y: 0.46 } ,  { x: 1.81, y: 4.86 } ,  { x: 2.52, y: 5.73 } )).toEqual( null )
		expect(geom.intersectionBetweenPoints( { x: 6.18, y: 1.25 } ,  { x: 4.39, y: 3.57 } ,  { x: 8.44, y: 0.06 } ,  { x: 9.36, y: 0.23 } )).toEqual( null )
		expect(geom.intersectionBetweenPoints( { x: 2.23, y: 3.84 } ,  { x: 2.24, y: 2.15 } ,  { x: 1.87, y: 4.27 } ,  { x: 9.72, y: 6.17 } )).toEqual( null )
		expect(geom.intersectionBetweenPoints( { x: 7.46, y: 0.28 } ,  { x: 4.39, y: 7 } ,  { x: 6.26, y: 5.3 } ,  { x: 2.81, y: 9.11 } )).toEqual( null )
		expect(geom.intersectionBetweenPoints( { x: 3.96, y: 1.05 } ,  { x: 7.22, y: 4.82 } ,  { x: 4.18, y: 9.69 } ,  { x: 0.32, y: 0.76 } )).toEqual( null )
		expect(geom.intersectionBetweenPoints( { x: 9.41, y: 9.5 } ,  { x: 6.29, y: 0.4 } ,  { x: 3.29, y: 6.4 } ,  { x: 5.74, y: 7.5 } )).toEqual( null )
		expect(geom.intersectionBetweenPoints( { x: 4.79, y: 6.31 } ,  { x: 7.83, y: 6.93 } ,  { x: 4.58, y: 0.05 } ,  { x: 3.08, y: 7.12 } )).toEqual( null )
		expect(geom.intersectionBetweenPoints( { x: 2.63, y: 9.92 } ,  { x: 2.38, y: 4.11 } ,  { x: 7.44, y: 7.87 } ,  { x: 0.31, y: 2.1 } )).toEqual( null )
		expect(geom.intersectionBetweenPoints( { x: 5.79, y: 7.57 } ,  { x: 8.65, y: 6.56 } ,  { x: 8.75, y: 0.13 } ,  { x: 2.71, y: 5.74 } )).toEqual( null )



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