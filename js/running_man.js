var con = console;
var isNode = (typeof module !== 'undefined');

var limbs = {
	"hips": {
		"range": 0,
		"baserot": 0,
		"length": 0,
		"offset": 0
	},
	"thigh": {
		"range": 1,
		"baserot": 0.3,
		"length": 90,
		"offset": 0
	},
	"calf": {
		"range": -0.6,
		"baserot": -0.9,
		"length": 90,
		"offset": 1.6
	},
	"foot": {
		"range": 0.5,
		"baserot": 1.4,
		"length": 25,
		"offset": 0
	},
	"bicep": {
		"range": 1.5,
		"baserot": 0,
		"length": 50,
		"offset": 0
	},
	"forearm": {
		"range": 1,
		"baserot": 2,
		"length": 40,
		"offset": 0
	}
};

var running_man = (function() {

	var sw = 600, sh = 600;

	var bmp = dom.canvas(sw,sh);
	var ctx = bmp.ctx;

	var cx = sw * 3 /4
	var cy = sh * 1/ 4;

	var editor = dom.element("div", {style: {position: "absolute", top: 10, left: 10}});
	var output = dom.element("pre", {style: {color: "white","font-size":"10px", }});


	function createLimb(options) {

		var parent = options.parent;

		return {
			pos: {},
			calc: function(time) {
				var osc = options.movement.baserot + Math.sin(time + options.movement.offset + options.phase) * options.movement.range;
				var pos = this.position(osc);
				return Math.max(pos.sy, pos.ey);
			},
			position: function(osc) {
				if (osc) {
					var pos = {
						sx: 0,
						sy: 0,
						ex: 0 + Math.sin(osc) * options.movement.length,
						ey: 0 + Math.cos(osc) * options.movement.length
					}
					if (parent) {
						var parentPos = parent.position();
						pos.sx += parentPos.ex;
						pos.sy += parentPos.ey;
						pos.ex += parentPos.ex;
						pos.ey += parentPos.ey;
					}
					this.pos = pos;
				}
				return this.pos;
			},
			render: function(x, y) {
				ctx.beginPath();
				ctx.strokeStyle = "#0f0";
				ctx.fillStyle = "#0f0";
				ctx.moveTo(x + this.pos.sx, y + this.pos.sy);
				ctx.lineTo(x + this.pos.ex, y + this.pos.ey);
				ctx.stroke();
				ctx.closePath();

				ctx.beginPath();
				ctx.drawCircle(x + this.pos.sx, y + this.pos.sy, 5);
				ctx.drawCircle(x + this.pos.ex, y + this.pos.ey, 5);
				ctx.closePath();
				ctx.fill();
			}
		}
	}

	function settings() {
		output.innerHTML = ("var limbs = " + JSON.stringify(limbs, null, "\t") + ";");
	};
	settings();


	function createEditor(l,k) {
		var edit = dom.element("div");
		var label = dom.element("span", {innerHTML: l + ":" + k + ":", style:{color: "white"}});
		var input = dom.element("input", {value: limbs[l][k], type: "number"});
		editor.appendChild(edit);
		edit.appendChild(label);
		edit.appendChild(input);
		input.addEventListener("change", function(e) {
			limbs[l][k] = parseFloat(e.target.value);
			settings();
		})
	}

	for (var l in limbs) {
		for (var k in limbs[l]) {
			createEditor(l,k);
		}
	}
	document.body.appendChild(editor);
	editor.appendChild(output);

	var hips = createLimb({parent: null, movement: limbs.hips, phase: 0});



	var t1 = createLimb({parent: null, movement: limbs.thigh, phase: 0});
	var c1 = createLimb({parent: t1, movement: limbs.calf, phase: 0});
	var f1 = createLimb({parent: c1, movement: limbs.foot, phase: 0});
	var t2 = createLimb({parent: null, movement: limbs.thigh, phase: Math.PI});
	var c2 = createLimb({parent: t2, movement: limbs.calf, phase: Math.PI});
	var f2 = createLimb({parent: c2, movement: limbs.foot, phase: Math.PI});

	var bicep1 = createLimb({parent: null, movement: limbs.bicep, phase: 0});
	var forearm1 = createLimb({parent: bicep1, movement: limbs.forearm, phase: 0});
	var bicep2 = createLimb({parent: null, movement: limbs.bicep, phase: Math.PI});
	var forearm2 = createLimb({parent: bicep2, movement: limbs.forearm, phase: Math.PI});

	function render(t) {
		// var time = 50;
		var time = t / 250;

		ctx.clearRect(0, 0, sw, sh);
		// ctx.fillStyle = "#0f0";
		// ctx.fillRect(cx - 2, cy - 2, 4, 4);

		// cy = 200 - Math.abs(Math.sin(time) * 50);

		var max = 0; // calculate impact with ground, ie maximum y position. 
		// we can hope it's either the end of the calf or the end of the foot. walking on knees is not currently accepted.
		hips.calc(time);
		t1.calc(time);
		max = Math.max(max, c1.calc(time));
		max = Math.max(max, f1.calc(time));
		t2.calc(time);
		max = Math.max(max, c2.calc(time));
		max = Math.max(max, f2.calc(time));

		bicep1.calc(time);
		forearm1.calc(time);
		bicep2.calc(time);
		forearm2.calc(time);

		var horizon = 400;
		// cy = max;
		ctx.fillStyle = "#040";
		ctx.fillRect(cx - 100, horizon, 200, 10);

		var x = cx, y = horizon - max;
		t1.render(x, y);
		c1.render(x, y);
		f1.render(x, y);
		t2.render(x, y);
		c2.render(x, y);
		f2.render(x, y);
		y -= 90;
		bicep1.render(x, y);
		forearm1.render(x, y);
		bicep2.render(x, y);
		forearm2.render(x, y);

		requestAnimationFrame(render);
	}
	render(0);

	var experiment = {
		stage: bmp.canvas,
		inner: null,
		resize: function() {},
		init: function() {},
		kill: function() {}
	}

	if (!isNode) dispatchEvent(new CustomEvent("load:complete", {detail:experiment}));

	return experiment;

})();

if (isNode) module.exports = running_man;