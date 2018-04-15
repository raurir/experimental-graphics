var synth_ambient = function(Tone) {

	function init() {




var watchOut = dom.element("h1", {innerHTML: "Beware your speakers!"});
document.body.appendChild(watchOut);
var loadNext = dom.button("Load another permutation", {
	style: {
		border: "1px solid black",
		borderRadius: "5px",
		display: "inline-block",
		padding: "5px",
	}
});
document.body.appendChild(loadNext);
dom.on(loadNext, ["click"], function() {
	window.location = "?synth_ambient," + Math.round(Math.random() * 1e10);
})


// most of this actual bootstrapping has been copy/pasted from the tone.js docs/examples
// https://tonejs.github.io/examples
// and from some of jake alburgh's demos on codepen: https://codepen.io/jakealbaugh

Tone.Transport.bpm.value = rand.getInteger(80, 115);

var notes = [
	['b2', 'g2', 'c3', 'b3', 'g3', 'c4'],
	['c#3', 'g#3', 'c#4', 'g#4', 'c#5'],
	['g3', 'b3', 'f#4', 'g4', 'b4', 'f#5', 'g5', 'b5'],
	['A3', 'C4', 'E4', 'A4', 'C5', 'E5', 'A5', 'C6', 'E6'],
	['e3', 'a#4', 'e4', 'a#5', 'e5']
]
notes = notes[rand.getInteger(0, notes.length - 1)];



function timeGenerator(min, max) {
	return Math.pow(2, rand.getInteger(min, max)) + "n";
}


var delayPingPong = new Tone.PingPongDelay({
	"delayTime" : "6n",
	"feedback" : 0.9,
	"wet" : 0.2
}).toMaster();

var delayFeedback = new Tone.FeedbackDelay({
	"delayTime" : timeGenerator(2, 4),
	"feedback" : 0.9,
	"wet" : 0.4
}).toMaster();

var lowPass = new Tone.Filter({
	"frequency": rand.getNumber(6000, 20000),
}).toMaster();

var freeverb = new Tone.Freeverb().toMaster();
freeverb.dampening.value = rand.getNumber(10, 5000);

var phaser = new Tone.Phaser({
	"frequency" : rand.getNumber(10, 3000),
	"octaves" : rand.getInteger(1, 7),
	"baseFrequency" : rand.getNumber(1000, 2000)
}).toMaster();

var crusher = new Tone.BitCrusher(rand.getInteger(2, 6)).toMaster();

var chorus = new Tone.Chorus(rand.getNumber(2, 6), rand.getNumber(1, 3), rand.getNumber(0.2, 1)).toMaster();



function connectGenerator(synth) {
	if (rand.random() > 0.7) return synth.connect(freeverb);
	if (rand.random() > 0.7) return synth.connect(delayFeedback);
	if (rand.random() > 0.6) return synth.connect(lowPass);
	if (rand.random() > 0.5) return synth.connect(phaser);
	if (rand.random() > 0.5) return synth.connect(chorus);
	if (rand.random() > 0.5) return synth.connect(crusher);
	return synth; // no effect, borings!
}

var kickTime = timeGenerator(1, 2);
var kick = connectGenerator(new Tone.MembraneSynth({
	"envelope" : {
		"sustain" : 0,
		"attack" : 0.02,
		"decay" : 0.8
	},
	"octaves" : 10
}));
var kickPart = new Tone.Loop(function(time){
	kick.triggerAttackRelease("C2", "1n", time);
}, kickTime).start(0);




var snare = connectGenerator(new Tone.NoiseSynth({
	"volume" : -5,
	"envelope" : {
		"attack" : 0.001,
		"decay" : 0.7,
		"sustain" : 0
	},
	"filterEnvelope" : {
		"attack" : 0.001,
		"decay" : 0.6,
		"sustain" : 0
	}
}));
var snarePart = new Tone.Loop(function(time){
	snare.triggerAttack(time);
}, "2n").start("4n");




var hihatClosed = connectGenerator(new Tone.NoiseSynth({
	"volume" : -9,
	"envelope" : {
		"attack" : 0.001,
		"decay" : 0.1,
		"sustain" : 0
	},
	"filterEnvelope" : {
		"attack" : 0.001,
		"decay" : 0.01,
		"sustain" : 0
	}
}));



var hihatOpen = connectGenerator(new Tone.NoiseSynth({
	"volume" : -10,
	"filter": {
		"Q": 1
	},
	"envelope": {
		"attack": 0.01,
		"decay": 0.3
	},
	"filterEnvelope": {
		"attack": 0.01,
		"decay": 0.03,
		"baseFrequency": 14000,
		"octaves": -2.5,
		"exponent": 4,
	}
}));


var hihatTime = timeGenerator(2, 4);
var hihat = 0;
var hihatPart = new Tone.Loop(function(time){
	hihatClosed.triggerAttack(time);
	if ((hihat + 2) % 4 == 0) {
		hihatOpen.triggerAttack(time);
	}
	hihat ++;
}, hihatTime).start(0);





var synthArpeggio = connectGenerator(new Tone.DuoSynth());
synthArpeggio.voice0.oscillator.type = 'sine';
synthArpeggio.voice1.oscillator.type = 'square';



var synthPoly = connectGenerator(new Tone.PolySynth(6, Tone.Synth, {
	"oscillator" : {
		"partials" : [0, 2, 3, 4],
	},
	"envelope" : {
		"attack" : 0.3,
		"decay" : 0.05,
		"sustain" : 0,
		"release" : 0.02,
	}
}));


var bass = connectGenerator(new Tone.MonoSynth({
	"volume" : -10,
	"envelope" : {
		"attack" : 0.1,
		"decay" : 0.3,
		"release" : 2,
	},
	"filterEnvelope" : {
		"attack" : 0.001,
		"decay" : 0.01,
		"sustain" : 0.5,
		"baseFrequency" : 200,
		"octaves" : 2.6
	}
}));

var bassTime = timeGenerator(2, 4);
var bassNotes = notes.slice(0, rand.getInteger(1, 2));

var bassPart = new Tone.Sequence(function(time, note){
	bass.triggerAttackRelease(note, bassTime, time);
}, bassNotes).start(0);
bassPart.probability = 0.9;


var noise = connectGenerator(new Tone.Noise({
	"volume" : -20,
	"type" : ["white", "brown", "pink"][rand.getInteger(0, 2)]
}));
var noiseVolume = rand.getNumber(0, 0.4);
if (noiseVolume > 0.02) {
	noise.start();
	Tone.Master.volume.rampTo(0, noiseVolume);
}


var notesArpeggio = notes.slice(0, rand.getInteger(2, 6));
var noteArpeggioCurrent = 0;
var noteArpeggioLoop = Math.pow(2, rand.getInteger(4, 8));

Tone.Transport.scheduleRepeat(function(time) {
	var note = notesArpeggio[noteArpeggioCurrent % notesArpeggio.length];
	if (noteArpeggioCurrent < notesArpeggio.length) synthArpeggio.triggerAttackRelease(note, '16n', time);
	noteArpeggioCurrent++;
	noteArpeggioCurrent %= noteArpeggioLoop;
}, '16n');

var polyTime = timeGenerator(1, 4);
var notesPoly = notes.slice(0, rand.getInteger(2, 6));
Tone.Transport.scheduleRepeat(function(time) {
	synthPoly.triggerAttackRelease(notesPoly, "8n");
}, polyTime);

// var washTime = timeGenerator(1, 4);
// var washLength = timeGenerator(3, 4);
// var notesWash = notes.slice(0, rand.getInteger(2, 6));
// Tone.Transport.scheduleRepeat(function(time) {
// 	synthWash.triggerAttackRelease(notesWash, "8n");
// }, washTime);


Tone.Transport.start();






	}

	return {
		init: init,
		resize: function() {}
	}

};

define("synth_ambient", ["Tone"], synth_ambient);