/*var con = console;
var isNode = (typeof module !== 'undefined');

if (isNode) {
	var dom = require('./dom.js');
	var fs = require('fs');
}

var spiderlimbs ={
	"body": {
		"range": 0,
		"baserot": 0,
		"length": 0,
		"offset": 0
	},
	"thigh": {
		"range": 0.2,
		"baserot": -2,
		"length": 90,
		"offset": 0
	},
	"calf": {
		"range": 0.2,
		"baserot": -0.2,
		"length": 90,
		"offset": 1.6
	},
	"thigh2": {
		"range": 0.2,
		"baserot": 2,
		"length": 90,
		"offset": 0
	},
	"calf2": {
		"range": -0.2,
		"baserot": -0.2,
		"length": 90,
		"offset": 1.6
	},
	"thigh3": {
		"range": 0.2,
		"baserot": 1.65,
		"length": 130,
		"offset": 0.5
	},
	"calf3": {
		"range": -0.5,
		"baserot": 1,
		"length": 100,
		"offset": 1.8
	},
	"thigh6": {
		"range": -1,
		"baserot": 3,
		"length": 40,
		"offset": 0
	},
	"calf6": {
		"range": -0.2,
		"baserot": 1,
		"length": 60,
		"offset": -1.5
	}
};

var spider = [
	{name: "body", parent: null, movement: spiderlimbs.body, phase: 0},
	{name: "thigh1", parent: "body", movement: spiderlimbs.thigh, phase: 0},
	{name: "calf1", parent: "thigh1", movement: spiderlimbs.calf, phase: 0},
	{name: "thigh2", parent: "body", movement: spiderlimbs.thigh, phase: Math.PI},
	{name: "calf2", parent: "thigh2", movement: spiderlimbs.calf, phase: Math.PI},
	{name: "thigh3", parent: "body", movement: spiderlimbs.thigh2, phase: 0},
	{name: "calf3", parent: "thigh3", movement: spiderlimbs.calf2, phase: 0},
	{name: "thigh4", parent: "body", movement: spiderlimbs.thigh2, phase: Math.PI},
	{name: "calf4", parent: "thigh4", movement: spiderlimbs.calf2, phase: Math.PI},

	{name: "thigh5", parent: "body", movement: spiderlimbs.thigh3, phase: Math.PI},
	{name: "calf5", parent: "thigh5", movement: spiderlimbs.calf3, phase: Math.PI},


	{name: "thigh6", parent: "body", movement: spiderlimbs.thigh6, phase: Math.PI},
	{name: "calf6", parent: "thigh6", movement: spiderlimbs.calf6, phase: Math.PI},



]



var sw = 600;
var sh = 400;
var cx = 150;
var cy = 0;
var horizon = sh - 50;
var blockSize = 10;

var inputs = [];

function createEditor(limbs) {

	var editor = dom.element("div", {id: "editor", style: {color: "white","font-size":"10px", position: "absolute", top: 10, left: sw}});
	var output = dom.element("pre", {id: "output", style: {position: "absolute", top: 0, left: 220}});

	function outputSettings() {
		output.innerHTML = "var limbs = " + JSON.stringify(limbs, null, "\t") + ";";
	};
	outputSettings();


	function edit(l,k) {
		var min = 0,  multiplier =  0.001, max = Math.PI * 2 / multiplier;
		if (k === "length") {
			max = 200;
			multiplier = 1;
		}

		var value = limbs[l][k];

		var edit = dom.element("div", {style: {margin: 2}});
		var label = dom.element("div", {innerHTML: l + " " + k + ":", style: {display: "inline-block", textAlign: "right", width: 100} });
		var input = dom.element("input", {value: value, min: min, max: max, type: "range", style: {width: 100}});
		var display = dom.element("input", {value: value, type: "number", style: {width: 50}});

		editor.appendChild(edit);
		edit.appendChild(label);
		edit.appendChild(input);
		edit.appendChild(display);
		input.addEventListener("change", function(e) {
			var newValue = parseFloat(e.target.value) * multiplier
			limbs[l][k] = newValue;
			display.value = newValue;
			outputSettings();
		})
		return input;
	}


	for (var l in limbs) {
		for (var k in limbs[l]) {
			inputs.push(edit(l,k));
		}
	}

	function createButton(label, callback) {
		var button = dom.element("button", {innerHTML: label});
		editor.appendChild(button);
		button.addEventListener("click", callback);
	}

	var randomise = createButton("Random", function(e) {
		for (var i in inputs) {
			inputs[i].value = inputs[i].value * (0.8 + Math.random() * 0.4);
			inputs[i].dispatchEvent(new Event('change'));
		}
	});

	var morph = createButton("Morph", function(e) {
		for (var i in inputs) {
			inputs[i].newValue = inputs[i].value * (0.8 + Math.random() * 0.4);
		}
	});

	document.body.appendChild(editor);
	editor.appendChild(output);
}


var running_man = (function(settings, limbs) {

	var creature = {};

	var bmp = dom.canvas(sw,sh);
	var ctx = bmp.ctx;


	function createLimbKeyframe(options) {
		var parent = options.parent;

		// con.log("createLimbKeyframe", options)

		var translationX = options.movement.length;
		var rotationStart = options.movement.baserot - options.movement.range;
		var rotationEnd = options.movement.baserot + options.movement.range;

		var divKeyframe = dom.element("div", {id: options.name, className: "limb"});
		var divJoint = dom.element("div", {id: options.name + "-joint", className: "joint"});

		if (parent) {
			parent.divJoint.appendChild(divKeyframe);
		} else {
			document.body.appendChild(divKeyframe);
		}
		divKeyframe.appendChild(divJoint);

		var transform = [
			"0% {transform: rotate(" + rotationStart + "rad);}",
			"50% {transform: rotate(" + rotationEnd + "rad);}",
			"100% {transform: rotate(" + rotationStart + "rad);}"
		];
		var transformJoint = [
			"0% {transform: translateX(" + translationX + "px) rotate(" + -rotationStart + "rad);}",
		  "50% {transform: translateX(" + translationX + "px) rotate(" + -rotationEnd + "rad);}",
		  "100% {transform: translateX(" + translationX + "px) rotate(" + -rotationStart + "rad);}"
		];


		var time = 2;
		var delay = (-0.63 + -time * (options.movement.offset + options.phase) / (Math.PI * 2));
		var animation = options.name + "-animation " + time + "s " + delay + "s ease-in-out infinite;"
		var animationOpposite = options.name + "-joint-animation " + time + "s " + delay + "s ease-in-out infinite;"

		var css = [
		"#" + options.name + " {",
			"width: " + options.movement.length + "px;",
			"height: " + blockSize + "px;",
			"animation: " + animation,
			"-webkit-animation: " + animation,
		"};",
		"@keyframes " + options.name + "-animation {",
			transform.join(""),
		"}",
		"@-webkit-keyframes " + options.name + "-animation {",
			transform.join(""),
		"}",

		"#" + options.name + "-joint {",
			"animation: " + animationOpposite,
			"-webkit-animation: " + animationOpposite,
		"};",
		"@keyframes " + options.name + "-joint-animation {",
			transformJoint.join(""),
		"}",
		"@-webkit-keyframes " + options.name + "-joint-animation {",
			transformJoint.join(""),
		"}"

		];

		return {
			divKeyframe: divKeyframe,
			divJoint: divJoint,
			css: css,
		}

	}






	function createLimb(options) {

		var parent = options.parent;
		if (parent) {
			options.parent = creature[parent];
			parent = options.parent;
		}

		var div = {};
		if (!isNode) {
			div = dom.element("div", {style: {
				width: options.movement.length,
				height: blockSize,
				background: "rgba(255,0,0,0.5)",
				transformOrigin: "0 " + (blockSize / 2) + "px",
				position: "absolute"
			}});
			if (parent && parent.div) parent.div.appendChild(div);

		}

		var keyframe = createLimbKeyframe(options),
			css = keyframe.css,
			divKeyframe = keyframe.divKeyframe,
			divJoint = keyframe.divJoint;

		return {
			name: options.name,
			options: options,
			div: div,

			css: css,
			divKeyframe: divKeyframe,
			divJoint: divJoint,

			pos: {
				sx: 0,
				sy: 0,
				ex: 0,
				ey: 0
			},
			calc: function(time) {
				var osc = options.movement.baserot + Math.sin(time + options.movement.offset + options.phase) * options.movement.range;
				this.position(osc);
				return Math.max(this.pos.sy, this.pos.ey);
			},
			position: function(osc) {

				this.osc = osc;

				var pos = {
					sx: 0,
					sy: 0,
					ex: 0 + Math.sin(osc) * options.movement.length,
					ey: 0 + Math.cos(osc) * options.movement.length
				}

				var translationX = 0, rotation = osc;

				if (options.parent) {
					var parent = options.parent;
					pos.sx += parent.pos.ex;
					pos.sy += parent.pos.ey;
					pos.ex += parent.pos.ex;
					pos.ey += parent.pos.ey;

					translationX = parent.options.movement.length;
					rotation = -parent.osc + osc;
				}

				this.translationX = translationX;
				this.rotationRad = rotation;
				this.pos = pos;
			},
			render: function(x, y) {
				ctx.beginPath();
				ctx.lineWidth = 3;
				ctx.strokeStyle = "#090";
				ctx.fillStyle = "#0a0";
				ctx.moveTo(x + this.pos.sx, y + this.pos.sy);
				ctx.lineTo(x + this.pos.ex, y + this.pos.ey);
				ctx.stroke();
				ctx.closePath();

				ctx.beginPath();
				ctx.drawCircle(x + this.pos.sx, y + this.pos.sy, blockSize / 2);
				ctx.drawCircle(x + this.pos.ex, y + this.pos.ey, blockSize / 2);
				ctx.closePath();
				ctx.fill();

				if (!isNode) {
					var parent = options.parent;
					var tx = parent ? this.translationX : y, ty = parent ? 0 : sw / 2;
					div.style.transform = "translate(" + tx + "px," + ty + "px)rotate(" + this.rotationRad + "rad)" ;
				}
			}
		}
	}

	var creature = {};
	for (var c in settings) {
		var bit = settings[c];
		creature[bit.name] = createLimb(bit);
	}
	// con.log(creature);



	if (!isNode) {
		createEditor(limbs);

		var divnested = dom.element("div", {id: "nested", style: {position: "absolute",
  		left: -50,
			top: sh + 50, //0, ???
			width: sh,
			height: sw,
			transform: "rotate(-90deg)scale(-1,1)",
			background: "rgba(255,0,0,0.2)"
		}});
		document.body.appendChild(divnested);
		divnested.appendChild(creature.body.div);

		var divKeyframes = dom.element("div", {id: "keyframes", style: {position: "absolute",
			top: sh * 2 + 50,// 150,
			left: -50, //cx - blockSize / 2,
			width: sh,
			height: sw,
			transform: "rotate(-90deg)scale(-1,1)",
			background: "rgba(0,0,255,0.2)"
		}});
		document.body.appendChild(divKeyframes);
		divKeyframes.appendChild(creature.body.divKeyframe);

		var styleSheet = document.createElement("style");
		var css = [
			"body {",
				"overflow: auto;",
			"}",
			"#body {",
				"left: " + sh / 2 + "px;",
				"top: " + sw / 2 + "px;",
			"}",
			".limb {",
				"background: rgba(0,0,200,0.8);",
				"position: absolute;",
				"transform-origin: center left;",
				"transform-style: preserve-3d;",
			"}",
			".joint {",
				"background: rgba(0,0,255,0.9);",
				"height: 10px;",
				"position: absolute;",
				"transform-origin: center center;",
				"width: 10px;",
				// "transform: translateX(0px)",
			"}"
		];
		for (var l in creature) {
			css = css.concat(creature[l].css);
		}
		styleSheet.innerText = css.join(' ');
		// con.log(css);
		document.head.appendChild(styleSheet);

	}


	function render(t) {

		// output.innerHTML = Math.round(t / 100)/ 10;


		for (var i in inputs) {
			if (inputs[i].newValue && inputs[i].newValue != inputs[i].value) {
				inputs[i].value -= (inputs[i].value - inputs[i].newValue) * 0.1;
				inputs[i].dispatchEvent(new Event('change'));
			}
		}


		var frames = 50;

		var time = isNode ? t / frames * Math.PI : t * Math.PI / 1000;

		ctx.fillStyle = "#030";
		ctx.fillRect(0, 0, sw, sh);
		ctx.fillStyle = "#432";
		ctx.fillRect(cx - sw / 2, horizon, sw, 10);

		// calculate impact with ground, ie maximum y position.
		// we can hope it's either the end of the calf or the end of the foot.
		// but walking on knees or head IS accepted.
		var max = 0;
		for (var l in creature) {
			max = Math.max(max, creature[l].calc(time)); // calculate each limb position
		}
		var x = cx, y = horizon - max - blockSize / 2;
		for (l in creature) {
			creature[l].render(x, y); // render each limb
		}

		if (isNode) {
		// in node - output frame to a png.
			saveFile(bmp.canvas, t);
			if (t < frames - 1) {
				setTimeout(function() {
					render(++t);
				}, 50);
				// and then:  convert -delay 3 -loop 0 *.png animation.gif
			}
		} else {
			// in browser
			// if (t<100)requestAnimationFrame(render);
			requestAnimationFrame(render);
		}

	}
	render(0);










	function saveFile(canvas, frame) {
		canvas.toBuffer(function(err, buf){
			if (err) {
				con.log(err);
			} else {
				var filename = __dirname + '/../export/running_man/runningman' + (10 + frame) + '.png';
				fs.writeFile(filename, buf, function(){ con.log("writeFile", filename); });
			}
		});
	}






	var experiment = {
		stage: bmp.canvas,
		inner: null,
		resize: function() {},
		init: function() {},
		kill: function() {}
	}

	return experiment;

})(spider, spiderlimbs);

if (isNode) module.exports = running_man;
*/