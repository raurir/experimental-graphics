var con = console;
var isNode = (typeof module !== 'undefined');

if (isNode) {
  // var rand = require('./rand.js');
  var Canvas = require('canvas');
  var Image = Canvas.Image;
  var dom = require('./dom.js');
  // var colours = require('./colours.js');
}


var any_image_url = function() {

  var size, sw, sh, cx, cy;
  var bmp = dom.canvas(1, 1);
  var ctx = bmp.ctx;

  function init(options) {

    con.log("init", options)

    size = options.size;
    sw = size;
    sh = size;
    cx = sw / 2;
    cy = sh / 2;
    bmp.setSize(sw, sh);

    render();
  }

  function render() {
    con.log("render");
    // ctx.clearRect(0, 0, sw, sh);
    // ctx.fillStyle = "#0f0";
    // ctx.fillRect(cx - 2, cy - 2, 4, 4);
    ctx.fillStyle = "#492";
    ctx.fillRect(0, 0, sw, sh);

    // renderSVGFromString(['<svg xmlns="http://www.w3.org/2000/svg" width="17" height="18">',
    //   '<path fill="blue" d="M0,0 L18,0 L18,18, L0,18" fill-rule="evenodd"/>',
    //   '<path fill="white" d="M17 10.51c0-.56-.25-1.521-.8-2.309-.649-.928-1.532-1.399-2.627-1.399H4.387c.118 1.016.46 1.819 1.022 2.393.987 1.01 2.372 1.027 2.41 1.027l.827-.013v.859c0 2.216 1.685 2.515 3.333 2.515h.132v1.692h-.132c-3.562 0-4.68-1.726-4.912-3.437-.738-.13-1.869-.483-2.801-1.437C3.234 9.345 2.711 7.85 2.711 5.956V5.11h10.862c1.366 0 2.425.515 3.214 1.255C15.735 2.685 12.455 0 8.571 0 3.837 0 0 3.987 0 8.905c0 4.918 3.837 8.905 8.57 8.905 4.202 0 7.697-3.142 8.43-7.287v-.013" fill-rule="evenodd"/>',
    //   '</svg>'].join(""), 50, 17, 18);

    renderBMPFromURL("at.png", 0.5, 1000, 1000);

  }

  // taken from: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Drawing_DOM_objects_into_a_canvas
  function renderSVGFromString(data, scale, width, height) {
    var DOMURL = window.URL || window.webkitURL || window;
    var img = new Image();
    var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
    var url = DOMURL.createObjectURL(svg);
    img.onload = function () {
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.translate(-width / 2, -height / 2);
      ctx.drawImage(img, 0, 0);
      DOMURL.revokeObjectURL(url);
      progress("render:complete", bmp.canvas);
    }
    img.src = url;
  }

  function renderBMPFromURL(url, scale, width, height) {
    var img = new Image();
    img.onload = function () {
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.translate(-width / 2, -height / 2);
      ctx.drawImage(img, 0, 0);
      progress("render:complete", bmp.canvas);
    }
    img.onerror = function(err) {
      con.log("error", err);
    }
    img.src = (isNode ? "./deploy/" : "") + url;
    con.log("file:",  img.src);
  }

  var experiment = {
    stage: bmp.canvas,
    init: init
  }

  return experiment;

};

if (isNode) {
  module.exports = any_image_url();
} else {
  define("any_image_url", any_image_url);
}