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

	var sw = 500, sh = 600;

	var bmp = dom.canvas(sw,sh);
	var ctx = bmp.ctx;

	var cx = 150;
	var cy = sh * 1 / 4;

	var editor = dom.element("div", {style: {position: "absolute", top: 10, left: 300}});
	var output = dom.element("pre", {style: {color: "white","font-size":"10px"}});

	var divnested = dom.element("div", {style: {position: "absolute",
		top: 0,
		left: cx,
		transform: "rotate(-90deg)scale(-1,1)"
	}});


	function createLimb(options) {

		var parent = options.parent;

		var div = dom.element("div", {style: {
			width: options.movement.length,
			height: 10,
			background: "rgba(255,0,0,0.5)",
			"transformOrigin": "0 5px",
			position: "absolute"
		}});
		if (parent && parent.div) parent.div.appendChild(div);

		return {
			name: options.name,
			options: options,
			div: div,
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

				var translationX = 0, rotation = osc;//"rotate(" + (osc) + "rad)";

				if (parent) {
					pos.sx += parent.pos.ex;
					pos.sy += parent.pos.ey;
					pos.ex += parent.pos.ex;
					pos.ey += parent.pos.ey;

					// translation = "translate(" + parent.options.movement.length + "px,0px)";
					translationX = parent.options.movement.length;// + "px,0px)";

					// rotation = "rotate(" + (-parent.osc + osc) + "rad)";
					rotation = -parent.osc + osc;

				}

				// div.style.transform = translation + rotation ;

				this.translationX = translationX;
				this.rotationRad = rotation;

				this.pos = pos;
				// con.log(this, this.pos);
			},
			render: function(x, y, offsetNested) {
				ctx.beginPath();
				ctx.strokeStyle = "#090";
				ctx.fillStyle = "#0a0";
				ctx.moveTo(x + this.pos.sx, y + this.pos.sy);
				ctx.lineTo(x + this.pos.ex, y + this.pos.ey);
				ctx.stroke();
				ctx.closePath();

				ctx.beginPath();
				ctx.drawCircle(x + this.pos.sx, y + this.pos.sy, 5);
				ctx.drawCircle(x + this.pos.ex, y + this.pos.ey, 5);
				ctx.closePath();
				ctx.fill();

				var tx = this.translationX, ty = 0;

				div.style.transform = "translate(" + tx + "px," + ty + "px)rotate(" + this.rotationRad + "rad)" ;
				// con.log(this.div.style.transform);
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

	var hips = createLimb({name: "hips", parent: null, movement: limbs.hips, phase: 0});
	var thigh1 = createLimb({name: "thigh1", parent: hips, movement: limbs.thigh, phase: 0});
	var calfoot1 = createLimb({name: "calfoot1", parent: thigh1, movement: limbs.calf, phase: 0});
	var foot1 = createLimb({name: "foot1", parent: calfoot1, movement: limbs.foot, phase: 0});
	var thigh2 = createLimb({name: "thigh2", parent: hips, movement: limbs.thigh, phase: Math.PI});
	var calf2 = createLimb({name: "calf2", parent: thigh2, movement: limbs.calf, phase: Math.PI});
	var foothigh2 = createLimb({name: "foothigh2", parent: calf2, movement: limbs.foot, phase: Math.PI});
	var bicep1 = createLimb({name: "bicep1", parent: hips, movement: limbs.bicep, phase: 0});
	var forearm1 = createLimb({name: "forearm1", parent: bicep1, movement: limbs.forearm, phase: 0});
	var bicep2 = createLimb({name: "bicep2", parent: hips, movement: limbs.bicep, phase: Math.PI});
	var forearm2 = createLimb({name: "forearm2", parent: bicep2, movement: limbs.forearm, phase: Math.PI});

	document.body.appendChild(divnested);
	divnested.appendChild(hips.div);

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
		thigh1.calc(time);
		max = Math.max(max, calfoot1.calc(time));
		max = Math.max(max, foot1.calc(time));
		thigh2.calc(time);
		max = Math.max(max, calf2.calc(time));
		max = Math.max(max, foothigh2.calc(time));

		bicep1.calc(time);
		forearm1.calc(time);
		bicep2.calc(time);
		forearm2.calc(time);

		var horizon = 400;
		// cy = max;
		ctx.fillStyle = "#040";
		ctx.fillRect(cx - 100, horizon, 200, 10);

		var x = cx, y = horizon - max;

		hips.render(x, y, true);

		thigh1.render(x, y);
		calfoot1.render(x, y);
		foot1.render(x, y);
		thigh2.render(x, y);
		calf2.render(x, y);
		foothigh2.render(x, y);
		y -= 90;
		bicep1.render(x, y);
		forearm1.render(x, y);
		bicep2.render(x, y);
		forearm2.render(x, y);

		// if (t<100)requestAnimationFrame(render);
		requestAnimationFrame(render);
	}
	render(0);



	var experiment = {
		stage: bmp.canvas,
		inner: null,
		resize: function() {},
		init: function() {


			// con.log("calling init")
			// setTimeout(function() {
			// 	con.log("Matter", Matter);
			// 	var physics = running_man_physics();
			// 	physics.init();
			// },100);

			// con.log("calling init")
			// setTimeout(function() {
			// 	var physics = running_man_physics();
			// 	physics.init();
			// },1100);




		},
		kill: function() {}
	}

	if (!isNode) dispatchEvent(new CustomEvent("load:complete", {detail:experiment}));

	return experiment;

})();

if (isNode) module.exports = running_man;