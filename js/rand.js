var con = console;
// from https://gist.github.com/Protonk/5367430
var rand = (function() {
  // Set to values from http://en.wikipedia.org/wiki/Numerical_Recipes
      // m is basically chosen to be large (as it is the max period)
      // and for its relationships to a and c
  var m = 4294967296,
      // a - 1 should be divisible by m's prime factors
      a = 1664525,
      // c and m should be co-prime
      c = 1013904223,
      seed, z;

  var alphaToInteger = function(s){
    var num = 0;
    for (var i = 0, il = s.length; i < il; i++) {
      num += s.charCodeAt(i) * c;
      num %= m;
    };
    // console.log("string", s.length)
    // console.log("seed", num);
    return num;
  }



  var strings = [
    "a",
    "b",
    "rauri",
    "raurj",
    "raurk",
    "raUri",
    "ben",
    "sean",
    "supercalifragilisticexpialadocious",
    /* macbeth, act 4, scene 2 */ "SCENE II. Fife. Macduff's castle.  Enter LADY MACDUFF, her Son, and ROSS LADY MACDUFF What had he done, to make him fly the land? ROSS You must have patience, madam. LADY MACDUFF He had none: His flight was madness: when our actions do not, Our fears do make us traitors. ROSS You know not Whether it was his wisdom or his fear. LADY MACDUFF Wisdom! to leave his wife, to leave his babes, His mansion and his titles in a place From whence himself does fly? He loves us not; He wants the natural touch: for the poor wren, The most diminutive of birds, will fight, Her young ones in her nest, against the owl. All is the fear and nothing is the love; As little is the wisdom, where the flight So runs against all reason. ROSS My dearest coz, I pray you, school yourself: but for your husband, He is noble, wise, judicious, and best knows The fits o' the season. I dare not speak much further; But cruel are the times, when we are traitors And do not know ourselves, when we hold rumour From what we fear, yet know not what we fear, But float upon a wild and violent sea Each way and move. I take my leave of you: Shall not be long but I'll be here again: Things at the worst will cease, or else climb upward To what they were before. My pretty cousin, Blessing upon you! LADY MACDUFF Father'd he is, and yet he's fatherless. ROSS I am so much a fool, should I stay longer, It would be my disgrace and your discomfort: I take my leave at once. Exit  LADY MACDUFF Sirrah, your father's dead; And what will you do now? How will you live? Son As birds do, mother. LADY MACDUFF What, with worms and flies? Son With what I get, I mean; and so do they. LADY MACDUFF Poor bird! thou'ldst never fear the net nor lime, The pitfall nor the gin. Son Why should I, mother? Poor birds they are not set for. My father is not dead, for all your saying. LADY MACDUFF Yes, he is dead; how wilt thou do for a father? Son Nay, how will you do for a husband? LADY MACDUFF Why, I can buy me twenty at any market. Son Then you'll buy 'em to sell again. LADY MACDUFF Thou speak'st with all thy wit: and yet, i' faith, With wit enough for thee. Son Was my father a traitor, mother? LADY MACDUFF Ay, that he was. Son What is a traitor? LADY MACDUFF Why, one that swears and lies. Son And be all traitors that do so? LADY MACDUFF Every one that does so is a traitor, and must be hanged. Son And must they all be hanged that swear and lie? LADY MACDUFF Every one. Son Who must hang them? LADY MACDUFF Why, the honest men. Son Then the liars and swearers are fools, for there are liars and swearers enow to beat the honest men and hang up them. LADY MACDUFF Now, God help thee, poor monkey! But how wilt thou do for a father? Son If he were dead, you'ld weep for him: if you would not, it were a good sign that I should quickly have a new father. LADY MACDUFF Poor prattler, how thou talk'st! Enter a Messenger  Messenger Bless you, fair dame! I am not to you known, Though in your state of honour I am perfect. I doubt some danger does approach you nearly: If you will take a homely man's advice, Be not found here; hence, with your little ones. To fright you thus, methinks, I am too savage; To do worse to you were fell cruelty, Which is too nigh your person. Heaven preserve you! I dare abide no longer. Exit  LADY MACDUFF Whither should I fly? I have done no harm. But I remember now I am in this earthly world; where to do harm Is often laudable, to do good sometime Accounted dangerous folly: why then, alas, Do I put up that womanly defence, To say I have done no harm? Enter Murderers  What are these faces? First Murderer Where is your husband? LADY MACDUFF I hope, in no place so unsanctified Where such as thou mayst find him. First Murderer He's a traitor. Son Thou liest, thou shag-hair'd villain! First Murderer What, you egg! Stabbing him  Young fry of treachery! Son He has kill'd me, mother: Run away, I pray you! Dies  Exit LADY MACDUFF, crying 'Murder!' Exeunt Murderers, following her"
  ]
  for(var s in strings) {
    // alphaToInteger(strings[s]);
  }



  return {
    setSeed : function(val) {
      var valDefined = val || val === 0;
      if (valDefined) {
        if (/[^\d]/.test(val)) {
          // con.log("setting alpha seed", val);
          val = alphaToInteger(val);
          // con.log("setting alpha now", val);
        } else {
          val = Number(val);
          // con.log("setting numeric seed", val);
        }
      } else {
        val = Math.round(Math.random() * m);
        // con.log("setting random seed", val);
      }
      z = seed = val;
    },
    getSeed : function() {
      return seed;
    },
    random : function() {
      // define the recurrence relationship
      z = (a * z + c) % m;
      // return a float in [0, 1)
      // if z = m then z / m = 0 therefore (z % m) / m < 1 always
      return z / m;
    },

    getLastRandom: function() {
      return z / m;
    },

    getNumber: function(min, max) {
      return min + this.random() * (max - min);
    },

    getInteger: function(min,max) {
      return Math.floor(this.getNumber(min, max + 1));
    }

  };
}());

if (typeof module !== 'undefined') module.exports = rand;