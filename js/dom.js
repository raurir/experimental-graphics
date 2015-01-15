var con = console;

var dom = (function() {
	var isNode = false;

	function element(element, props) {
		var el = document.createElement(element);
		for (var p in props) {
			if (p == "style") {
				for (var s in props[p]) {
					el[p][s] = props[p][s];
				}
			} else {
				el[p] = props[p];
			}
		}
		el.setSize = function(w,h) {
			el.style.width = w + "px"; // i always use pixels... oh, you don't? i don't give a fuck
			el.style.height = h + "px";
		};
		return el;
	}

	function canvas(w, h) {

		var c;
		if (isNode) {
			c = new Canvas(w,h);
		} else {
			c = element("canvas");
			c.width = w;
			c.height = h;
		}
		var ctx = c.getContext("2d");
		return {
			canvas: c,
			ctx: ctx
		}
	}

	function button(txt, props) {
		props.innerHTML = txt;
		var b = element("div", props);
		return b;
	}

	return {
		element: element,
		canvas: canvas,
		button: button
	}


})();

if(typeof module !== 'undefined') module.exports = dom;