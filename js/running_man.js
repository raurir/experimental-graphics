var con = console;
var isNode = (typeof module !== 'undefined');

var running_man = (function() {

	var sw = 600, sh = 600;

	var bmp = dom.canvas(sw,sh);
	var ctx = bmp.ctx;

	var cx = sw * 3 /4
	var cy = sh * 1/ 4;

	var editor = dom.element("div", {style: {position: "absolute", top: 10, left: 10}});
	var output = dom.element("pre", {style:{color: "white","font-size":"10px", }});


	function createLimb(options) {

		var parent = options.parent;
		var fn = options.fn;
		var offset = options.offset;

		return {
			pos: {},
			render: function(time) {
				var osc = options.movement.baserot + fn(time + offset) * options.movement.range;
				var pos = this.position(osc);
				ctx.beginPath();
				ctx.strokeStyle = "#0f0";
				ctx.moveTo(cx + pos.sx, cy + pos.sy);
				ctx.lineTo(cx + pos.ex, cy + pos.ey);
				ctx.stroke();
				ctx.closePath();
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
					// con.log(pos);
					this.pos = pos;
					return pos;
				} else {
					return this.pos;
				}
			}
		}
	}

var limbs = {
	"thigh": {
		"range": 1,
		"baserot": 0.5,
		"length": 90
	},
	"calf": {
		"range": -1,
		"baserot": -0.9,
		"length": 90
	},
	"foot": {
		"range": -0.5,
		"baserot": 1.6,
		"length": 20
	}
};

	function createEditor(l,k) {
		var edit = dom.element("div");
		var label = dom.element("span", {innerHTML: l + ":" + k + ":", style:{color: "white"}});
		var input = dom.element("input", {value: limbs[l][k], type: "number"});
		editor.appendChild(edit);
		edit.appendChild(label);
		edit.appendChild(input);
		input.addEventListener("change", function(e) {
			limbs[l][k] = parseFloat(e.target.value);
			output.innerHTML = ("var limbs = " + JSON.stringify(limbs, null, "\t") + ";");
		})
	}

	for (var l in limbs) {
		for (var k in limbs[l]) {
			createEditor(l,k);
		}
	}
	document.body.appendChild(editor);
	editor.appendChild(output);




	var t1 = createLimb({parent: null, movement: limbs.thigh, fn: Math.sin, offset: 0});
	var c1 = createLimb({parent: t1, movement: limbs.calf, fn: Math.cos, offset: 0});
	var f1 = createLimb({parent: c1, movement: limbs.foot, fn: Math.sin, offset: 0});
	var t2 = createLimb({parent: null, movement: limbs.thigh, fn: Math.sin, offset: Math.PI});
	var c2 = createLimb({parent: t2, movement: limbs.calf, fn: Math.cos, offset: Math.PI});
	var f2 = createLimb({parent: c2, movement: limbs.foot, fn: Math.sin, offset: Math.PI});

	function render(t) {
		// var time = 50;
		var time = t / 300;

		ctx.clearRect(0, 0, sw, sh);
		// ctx.fillStyle = "#0f0";
		// ctx.fillRect(cx - 2, cy - 2, 4, 4);

		t1.render(time);
		c1.render(time);
		f1.render(time);

		t2.render(time);
		c2.render(time);
		f2.render(time);

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