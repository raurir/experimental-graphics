var isNode = (typeof module !== 'undefined');

if (isNode) {
  var con = console;
  var rand = require('./rand.js');
  var Canvas = require('canvas');
  var Image = Canvas.Image;
  var dom = require('./dom.js');
var http = require("http");
var https = require("https");

}

var any_image_url = function() {

  // list a range of valid seeds.
  var allowed = {
    "526": {
      image: "https://funkyvector.com/blog/wp-content/uploads/2016/05/state_of_origin_52_6_22_d5243594_design.png",
      scale: isNode ? 1 : 0.5
    },
    "834199129": { // GNR logo - this seed is numerical equivalent to 'gnr'
      // image: "http://ajournalofmusicalthings.com/wp-content/uploads/Guns_N_Roses-logo.jpg",
      scale: 0.8
    }
  }

  var size, sw, sh, cx, cy;
  var bmp = dom.canvas(1, 1);
  var ctx = bmp.ctx;

  function init(options) {

    size = options.size;
    sw = size;
    sh = size;
    cx = sw / 2;
    cy = sh / 2;
    bmp.setSize(sw, sh);

    render();
  }

  function render() {
    // ctx.clearRect(0, 0, sw, sh);

    // ctx.fillStyle = "#0f0";
    // ctx.fillRect(cx - 2, cy - 2, 4, 4);

    // ctx.fillStyle = "#492";
    // ctx.fillRect(0, 0, sw, sh);

    // renderSVGFromString(['<svg xmlns="http://www.w3.org/2000/svg" width="17" height="18">',
    //   '<path fill="blue" d="M0,0 L18,0 L18,18, L0,18" fill-rule="evenodd"/>',
    //   '<path fill="white" d="M17 10.51c0-.56-.25-1.521-.8-2.309-.649-.928-1.532-1.399-2.627-1.399H4.387c.118 1.016.46 1.819 1.022 2.393.987 1.01 2.372 1.027 2.41 1.027l.827-.013v.859c0 2.216 1.685 2.515 3.333 2.515h.132v1.692h-.132c-3.562 0-4.68-1.726-4.912-3.437-.738-.13-1.869-.483-2.801-1.437C3.234 9.345 2.711 7.85 2.711 5.956V5.11h10.862c1.366 0 2.425.515 3.214 1.255C15.735 2.685 12.455 0 8.571 0 3.837 0 0 3.987 0 8.905c0 4.918 3.837 8.905 8.57 8.905 4.202 0 7.697-3.142 8.43-7.287v-.013" fill-rule="evenodd"/>',
    //   '</svg>'].join(""), 50, 17, 18);

    var ok = allowed[rand.getSeed()];
    if (ok && ok.image ) {
      renderBMPFromURL(ok.image, ok.scale);
    } else {
      con.warn("Cannot find image:", rand.getSeed());
    }

    // renderBMPFromURL("at.png", 0.5, 1000, 1000);

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

  function renderBMPFromURL(url, scale) {

    function drawToContext(img) {
      var width = img.width, height = img.height;
      // con.log("drawToContext");
      ctx.translate(cx, cy);
      ctx.scale(scale, scale);
      ctx.translate(-width / 2, -height / 2);
      ctx.drawImage(img, 0, 0);
      progress("render:complete", bmp.canvas);
    }

    if (isNode) {
      // promise didn't work!
      loadImageURL(url, function(buffer) {
        makeImage(buffer, function(img) {
          drawToContext(img);
        }, function(err) {
          con.log("makeImage fail", err);
        });
      }, function(err) {
        con.log("loadImageURL fail", err);
      });
    } else {
      var img = new Image();
      img.onload = function () {
        // con.log('on load');
        drawToContext(img);
      }
      img.onerror = function(err) {
        con.log("img.onerror error", err);
      }
      img.src = url;
    }
  }


  function loadImageURL(url, fulfill, reject) {
    var protocol = http;
    if (/https:\/\//.test(url)) { protocol = https; }
    protocol.get(url, function(res) {
      var buffers = [], length = 0;
      res.on("data", function(chunk) {
        length += chunk.length;
        // con.log("loadImageURL data", length);
        buffers.push(chunk);
      });
      res.on("end", function() {
        var loaded = Buffer.concat(buffers);
        fulfill(loaded);
      });
      res.on("error", function(e) {
        con.log("loadImageURL reject", e);
        reject(e);
      });
    });
  }

  function makeImage(data, fulfill, reject) {
    var img = new Image();
    img.src = data;
    if (img) {
      // con.log("makeImage fulfill", img);
      fulfill(img);
    } else {
      con.log("makeImage reject");
      reject();
    }
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