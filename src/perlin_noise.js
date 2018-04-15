var perlin_noise = function(perlin) {

  var timer=((c)=>{var t={},f=()=>new Date().getTime();return {start:(k)=>{t[k]=f();},end:(k)=>{c.log(k,f()-t[k]);}};})(console);

  const pixel = 10;
  const w = 60;
  const h = 60;

  const M = Math;
  const r = M.random;

  const c = document.createElement("canvas");
  c.width = w * pixel;
  c.height = h * pixel;
  const d = c.getContext('2d');

  const logger = document.createElement("div");
  document.body.appendChild(logger);

  var iterations = 0;
  var channelRed = perlin.noise(w, h);
  var channelGreen = perlin.noise(w, h);
  var channelBlue = perlin.noise(w, h);

  var min = 1000;
  var max = -1000;

  function drawIt(time) {
    var t = time * 0.005;
    var scale = 0.01;
    var red = channelRed.cycle(t, scale);
    var green = channelGreen.cycle(t, scale);
    var blue = channelBlue.cycle(t, scale);

    for (var i = 0, il = w * h; i < il; i++){
      var xp = i % w;
      var yp = Math.floor(i / w);
      // d.save();
      // d.setTransform( 1, 0, 0, 1, 0, 0 );
      var r = ~~(red[i] * 255),
        g = ~~(green[i] * 255),
        b = ~~(blue[i] * 255);
      d.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
      d.fillRect(xp * pixel, yp * pixel, pixel, pixel);

      min = M.min(r, min); max = M.max(r, max);
      min = M.min(g, min); max = M.max(g, max);
      min = M.min(b, min); max = M.max(b, max);
    }

    logger.innerHTML = min + '<br>' +  max;

    requestAnimationFrame(drawIt);
  };

  return {
    init: () => {
      drawIt(0);
    },
    stage: c
  };

};

// define("perlin_noise", perlin_noise);
define("perlin_noise", ["perlin"], perlin_noise);