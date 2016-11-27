var con = console;

var isNode = (typeof module !== 'undefined');
if (isNode) {
  var Canvas = require('canvas');
}

var dom = (function() {

  function setProps(el, props) {
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
  }

  function setAttributes(el, attrs) {
    for (var p in attrs) {
      el.setAttribute(p,attrs[p]);
    }
    return el;
  }

  function element(element, props) {
    var el = document.createElement(element);
    setProps(el, props);
    el.setSize = function(w,h) {
      el.style.width = w + "px"; // i always use pixels... don't you?
      el.style.height = h + "px";
    };
    // el.addClass = function(className) {
    //  // el.classList.add(className);
    // }
    // el.removeClass = function(class) {
    //  // el.classList.remove(class);
    // }

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

    var setSize = function(w, h, preserveCanvas) {
      if (preserveCanvas) {
        c.setSize(w, h);
      } else {
        c.width = w;
        c.height = h;
      }
    }

    return {
      setSize: setSize,
      canvas: c,
      ctx: ctx
    }
  }

  function button(txt, props) {
    props = props || {};
    if (props.innerHTML) con.warn("Specify butotn text as 1st param");
    props.innerHTML = txt;
    var b = element("div", props);
    return b;
  }


  function svg(tag, props) {
    var el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    setAttributes(el, props);
    el.setSize = function(w,h) {
      el.setAttribute("width", w);
      el.setAttribute("height", h);
    };
    el.clearRect = function() { /* a clear rectangle? literally nothing in vector! */ };
    el.fillRect = function() {
      con.warn("svg.fillRect not implemented");
    }
    return el;
  }









  function on(target, events, callback) {
    for (var i = 0, il = events.length; i < il; i++) {
      target.addEventListener(events[i], callback);
    }
  }
  function off(target, events, callback) {
    for (var i = 0, il = events.length; i < il; i++) {
      target.removeEventListener(events[i], callback);
    }
  }
  function trigger(target, events) {
    for (var i = 0, il = events.length; i < il; i++) {
      target.dispatchEvent(events[i]);
    }
  }




  return {
    element: element,
    canvas: canvas,
    button: button,
    svg: svg,
    on: on,
    off: off,
    trigger: trigger
  }


})();

if(isNode) module.exports = dom;