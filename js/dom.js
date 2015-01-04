var con = console;

var dom = (function() {
	var isNode = false;

	function createCanvas(w, h) {

		var c;
		if (isNode) {
			c = new Canvas(w,h);
		} else {
			c = document.createElement("canvas");
			c.width = w;
			c.height = h;
		}
		var ctx = c.getContext("2d");
		return {
			canvas: c,
			ctx: ctx
		}
	}

	return {
		createCanvas:createCanvas
	}


})();

if(typeof module !== 'undefined') module.exports = dom;