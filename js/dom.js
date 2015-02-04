var con = console;

var dom = (function() {
	var isNode = false;

	function setProps(el,props) {
		for (var p in props) {
			if (p == "style") {
				for (var s in props[p]) {
					el[p][s] = props[p][s];
				}
			} else {
				el.setAttribute(p,props[p]);
				// el[p] = props[p];
			}
		}
		return el;
	}

	function element(element, props) {
		var el = document.createElement(element);
		setProps(el, props);
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

		var circleRads = Math.PI * 2;
		ctx.drawCircle = function(x, y, r) {
			ctx.arc(x, y, r, 0, circleRads, false);
		}

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


	function svg(tag, props) {
		var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
		setProps(el, props);




		return el;


	}





	return {
		element: element,
		canvas: canvas,
		button: button,
		svg: svg
	}


})();

if(typeof module !== 'undefined') module.exports = dom;