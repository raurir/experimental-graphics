var rand = require("../src/rand.js");
describe("rand", function() {
	describe("is deterministic", function() {
		it("getNumber should return consistent results with a small number", function() {
			rand.setSeed(100);
			var resultA = rand.getNumber(0, 20);
			rand.setSeed(100);
			var resultB = rand.getNumber(0, 20);
			expect(resultA).toBe(resultB);
		});

		it("getNumber should return consistent results with a big number", function() {
			var big = 987654;
			rand.setSeed(big);
			var resultA = rand.getNumber(0, big);
			rand.setSeed(big);
			var resultB = rand.getNumber(0, big);
			expect(resultA).toBe(resultB);
		});

		it("random should return consistent results", function() {
			rand.setSeed(10889);
			var resultA = rand.random();
			rand.setSeed(10889);
			var resultB = rand.random();
			expect(resultA).toBe(resultB);
		});
	});

	describe("getInteger", function() {

		var random = 0, randoms = 10;
		while (random++ < randoms) {
			var seed = random * 134;
			var tolerance = 0.2;
			rand.setSeed(seed);

			it("should return evenly between min and max with seed:" + seed + " and tolerance:" + tolerance, function(done) {

				var bucket = [];

				var test = 0, tests = 1e5;
				while (test++ < tests) {
					var r = rand.getInteger(0, 4);
					if (bucket[r]) { bucket[r]++; } else { bucket[r] = 1; }
				}

				var sum = bucket.reduce(function(a, b) {
					return a + b;
				}, 0);
				var average = sum / bucket.length;
				var withinTolerance = bucket.every(function(element) {
					return Math.abs(element - average) < average * tolerance;
				});
				// console.log(bucket, withinTolerance, average);

				expect(withinTolerance).toEqual(true);
				done();
			});
		}
	});

	describe("alphaToInteger", function() {
		it("should convert a string to an integer", function(done) {
			var tests = [
				{string: "a", integer: 3859429119},
				{string: "b", integer: 578366046},
				{string: "rauri", integer: 554828797},
				{string: "raurj", integer: 1568733020},
				{string: "raurk", integer: 2582637243},
				{string: "raUri", integer: 2469632029},
				{string: "ben", integer: 4058759595},
				{string: "sean", integer: 3679724025},
				{string: "supercalifragilisticexpialadocious", integer: 459910637},
				/* macbeth, act 4, scene 2 */
				{string: "SCENE II. Fife. Macduff's castle.  Enter LADY MACDUFF, her Son, and ROSS LADY MACDUFF What had he done, to make him fly the land? ROSS You must have patience, madam. LADY MACDUFF He had none: His flight was madness: when our actions do not, Our fears do make us traitors. ROSS You know not Whether it was his wisdom or his fear. LADY MACDUFF Wisdom! to leave his wife, to leave his babes, His mansion and his titles in a place From whence himself does fly? He loves us not; He wants the natural touch: for the poor wren, The most diminutive of birds, will fight, Her young ones in her nest, against the owl. All is the fear and nothing is the love; As little is the wisdom, where the flight So runs against all reason. ROSS My dearest coz, I pray you, school yourself: but for your husband, He is noble, wise, judicious, and best knows The fits o' the season. I dare not speak much further; But cruel are the times, when we are traitors And do not know ourselves, when we hold rumour From what we fear, yet know not what we fear, But float upon a wild and violent sea Each way and move. I take my leave of you: Shall not be long but I'll be here again: Things at the worst will cease, or else climb upward To what they were before. My pretty cousin, Blessing upon you! LADY MACDUFF Father'd he is, and yet he's fatherless. ROSS I am so much a fool, should I stay longer, It would be my disgrace and your discomfort: I take my leave at once. Exit  LADY MACDUFF Sirrah, your father's dead; And what will you do now? How will you live? Son As birds do, mother. LADY MACDUFF What, with worms and flies? Son With what I get, I mean; and so do they. LADY MACDUFF Poor bird! thou'ldst never fear the net nor lime, The pitfall nor the gin. Son Why should I, mother? Poor birds they are not set for. My father is not dead, for all your saying. LADY MACDUFF Yes, he is dead; how wilt thou do for a father? Son Nay, how will you do for a husband? LADY MACDUFF Why, I can buy me twenty at any market. Son Then you'll buy 'em to sell again. LADY MACDUFF Thou speak'st with all thy wit: and yet, i' faith, With wit enough for thee. Son Was my father a traitor, mother? LADY MACDUFF Ay, that he was. Son What is a traitor? LADY MACDUFF Why, one that swears and lies. Son And be all traitors that do so? LADY MACDUFF Every one that does so is a traitor, and must be hanged. Son And must they all be hanged that swear and lie? LADY MACDUFF Every one. Son Who must hang them? LADY MACDUFF Why, the honest men. Son Then the liars and swearers are fools, for there are liars and swearers enow to beat the honest men and hang up them. LADY MACDUFF Now, God help thee, poor monkey! But how wilt thou do for a father? Son If he were dead, you'ld weep for him: if you would not, it were a good sign that I should quickly have a new father. LADY MACDUFF Poor prattler, how thou talk'st! Enter a Messenger  Messenger Bless you, fair dame! I am not to you known, Though in your state of honour I am perfect. I doubt some danger does approach you nearly: If you will take a homely man's advice, Be not found here; hence, with your little ones. To fright you thus, methinks, I am too savage; To do worse to you were fell cruelty, Which is too nigh your person. Heaven preserve you! I dare abide no longer. Exit  LADY MACDUFF Whither should I fly? I have done no harm. But I remember now I am in this earthly world; where to do harm Is often laudable, to do good sometime Accounted dangerous folly: why then, alas, Do I put up that womanly defence, To say I have done no harm? Enter Murderers  What are these faces? First Murderer Where is your husband? LADY MACDUFF I hope, in no place so unsanctified Where such as thou mayst find him. First Murderer He's a traitor. Son Thou liest, thou shag-hair'd villain! First Murderer What, you egg! Stabbing him  Young fry of treachery! Son He has kill'd me, mother: Run away, I pray you! Dies  Exit LADY MACDUFF, crying 'Murder!' Exeunt Murderers, following her",
					integer: 3406888193}
			];

			for(var s in tests) {
				var test = tests[s];
				var result = rand.alphaToInteger(test.string);
				expect(result).toEqual(test.integer);
			}
			done();

		});

	});
});
