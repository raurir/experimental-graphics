var con = console;

var dom = (function() {
	var isNode = false;

	function createElement(element, props) {
		var el = document.createElement(element);
		for (var p in props) {
			el[p] = props[p];
		}
		return el;
	}

	function createCanvas(w, h) {

		var c;
		if (isNode) {
			c = new Canvas(w,h);
		} else {
			c = createElement("canvas");
			c.width = w;
			c.height = h;
		}
		var ctx = c.getContext("2d");
		return {
			canvas: c,
			ctx: ctx
		}
	}

	function createButton(txt, props) {
		props.innerHTML = txt;
		var b = createElement("div", props);
		return b;
	}

	return {
		element: createElement,
		canvas: createCanvas,
		button: createButton

	}


})();

if(typeof module !== 'undefined') module.exports = dom;