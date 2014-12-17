(function() {
  var canvas, centre, con, createSlider, ctx, d, draw, init, redraw, rotMod, settings, size;

  con = console;

  d = document;

  canvas = null;

  size = 600;

  centre = size / 2;

  ctx = null;

  rotMod = Math.PI / 4;

  settings = {};

  createSlider = function(prop, min, max, granularity) {
    var change, div, label, range, state;
    if (granularity == null) {
      granularity = 1;
    }
    div = d.createElement("div");
    label = d.createElement("label");
    label.innerHTML = "" + prop + ":";
    state = d.createElement("label");
    state.innerHTML = min;
    range = d.createElement("input");
    range.type = "range";
    range.min = min;
    range.max = max;
    range.name = prop;
    div.appendChild(label);
    div.appendChild(range);
    div.appendChild(state);
    d.body.appendChild(div);
    change = function(e) {
      var v;
      v = e.target.value * granularity;
      settings[prop] = Number(v);
      state.innerHTML = v;
      return redraw();
    };
    range.addEventListener("change", change);
    range.addEventListener("input", change);
    return settings[prop] = min;
  };

  createSlider("angleRange", 0, 1000, 0.001);

  createSlider("items", 1, 10);

  createSlider("maxRecursion", 1, 10);

  createSlider("angleSpiral", 0, 20, 0.1);

  redraw = function() {
    canvas.width = canvas.width;
    return draw(centre, 50, 0, 0);
  };

  draw = function(x, y, branchAngle, level) {
    var angleRange, angleSpiral, dot, h, items, j, maxRecursion, newX, newY, rgb, rotation, scale, w, _i, _results;
    scale = 1 / (level + 1);
    w = 10 * scale;
    h = 100 * scale;
    level++;
    items = settings.items;
    angleRange = settings.angleRange;
    maxRecursion = settings.maxRecursion;
    angleSpiral = settings.angleSpiral;
    _results = [];
    for (j = _i = 0; 0 <= items ? _i < items : _i > items; j = 0 <= items ? ++_i : --_i) {
      rotation = j * angleRange - (items - 1) * angleRange / 2 + branchAngle * angleSpiral;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      dot = 4;
      ctx.fillStyle = "rgba(255,0,0,0.1)";
      ctx.fillRect(-dot / 2, -dot / 2, dot, dot);
      rgb = 0;
      ctx.fillStyle = "rgba(" + rgb + "," + rgb + "," + rgb + ",0.1)";
      ctx.fillRect(-w * 1 / 2, 0, w * 1, h * 1);
      ctx.restore();
      newX = x + h * -Math.sin(rotation);
      newY = y + h * Math.cos(rotation);
      if (level < maxRecursion) {
        _results.push(draw(newX, newY, rotation, level));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  init = function() {
    canvas = d.createElement("canvas");
    canvas.width = canvas.height = size;
    d.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    return redraw();
  };

  init();

}).call(this);
