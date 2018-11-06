const con = console;

const isNode = typeof module !== "undefined";

let createCanvas;
if (isNode) {
	createCanvas = require("canvas").createCanvas;
}

const setProps = (el, props) => {
	for (var p in props) {
		if (p == "style") {
			for (var s in props[p]) {
				el[p][s] = props[p][s];
			}
		} else {
			el[p] = props[p];
		}
	}
	return el;
};

const setAttributes = (el, attrs) => {
	for (var p in attrs) {
		el.setAttribute(p, attrs[p]);
	}
	return el;
};

const element = (element, props) => {
	const el = document.createElement(element);
	setProps(el, props);
	el.setSize = (w, h) => {
		el.style.width = `${w}px`; // i always use pixels... don't you?
		el.style.height = `${h}px`;
	};
	return el;
};

const canvas = (w, h) => {
	let c;
	if (isNode) {
		c = createCanvas(w, h);
	} else {
		c = element("canvas");
		c.width = w;
		c.height = h;
	}

	const ctx = c.getContext("2d");

	const circleRads = Math.PI * 2;
	ctx.drawCircle = (x, y, r) => {
		ctx.arc(x, y, r, 0, circleRads, false);
	};

	const setSize = (w, h, preserveCanvas) => {
		if (preserveCanvas) {
			c.setSize(w, h);
		} else {
			c.width = w;
			c.height = h;
		}
	};

	return {
		setSize,
		canvas: c,
		ctx,
	};
};

const button = (txt, props = {}) => {
	if (props.innerHTML) con.warn("Specify button text as 1st param");
	props.innerHTML = txt;
	const b = element("button", props);
	return b;
};

const svg = (tag, props) => {
	const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
	setAttributes(el, props);
	el.setSize = (w, h) => {
		el.setAttribute("width", w);
		el.setAttribute("height", h);
	};
	el.clearRect = () => {
		/* a clear rectangle? literally nothing in vector! */
	};
	el.fillRect = () => {
		con.warn("svg.fillRect not implemented");
	};
	return el;
};

const on = (target, events, callback) => {
	events.forEach((event) => {
		target.addEventListener(event, callback);
	});
};
const off = (target, events, callback) => {
	events.forEach((event) => {
		target.removeEventListener(event, callback);
	});
};
const trigger = (target, events) => {
	events.forEach((event) => {
		target.dispatchEvent(event);
	});
};

const dom = {
	button,
	canvas,
	element,
	off,
	on,
	setProps,
	setAttributes,
	svg,
	trigger,
};

if (isNode) module.exports = dom;
