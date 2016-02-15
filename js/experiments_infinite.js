function experiments_infinite() {


  function shuffleArray(array) {
      for (var i = array.length - 1; i > 0; i--) {
          var j = Math.floor(Math.random() * (i + 1));
          var temp = array[i];
          array[i] = array[j];
          array[j] = temp;
      }
      return array;
  }



  require.config({
    baseUrl: "./experiments/",
    urlArgs: "bust="+new Date().getTime()
  });

  var currentExperiment, experimentsLoaded = {}, currentLoading = null, artSpecs = {};
  var initialised = false;
  var currentRandom;

  var buttons = dom.element("div", {className:"experiment-buttons"});
  var holder = dom.element("div", {className:"experiment-holder"});

  $(".infinite").prepend(buttons);
  $(".infinite").prepend(holder);

  var experiments = {
    "bezier_flow": ["bezier_flow"],
    "corona_sine": ["corona_sine"],
    "hexagon_tile": ["hexagon_tile"],
    "rectangular_fill": ["rectangular_fill"],
    "typography": ["typography"],

    // "Mining_Branches": ["mining_branches"],
    // "Oscillate_Curtain": ["oscillate_curtain"],
    // "pattern_check": ["pattern_check"],
    // "pattern_circles": ["pattern_circles"],
    // "polyhedra": ["polyhedra","3d"],
    // "spiral_even": ["spiral_even"],
    // "squaretracer": ["squaretracer"],
    // "voronoi_stripes": ["voronoi_stripes", "voronoi"],
  };

  function resize() {
    // con.log("implement experiment resize!");
    var sw = window.innerWidth, sh = window.innerHeight;
    currentExperiment.resize(sw, sh);
  }

  function initWindowListener() {
    window.addEventListener("resize", resize);
  }

  function loadExperiment(params) {
    con.log("! loadExperiment params:", params);
    if (params) {

      $(buttons).slide(false);
      $('#buy, #cycle').slide(true);//.show();

      params = params.split(",");
      var newLoading = params[0];
      var newRandom = params[1];

      if (newLoading === currentLoading && newRandom === currentRandom) {
        return con.warn("Already loaded experiment...", newLoading, newRandom);
      }

      currentLoading = newLoading;
      currentRandom = newRandom;

      // con.log("currentExperiment set:", currentExperiment);

      if (currentExperiment) {
        currentExperiment.kill();
        currentExperiment = null;
        while (holder.childNodes.length) holder.removeChild(holder.firstChild);
      }

      if (experimentsLoaded[currentLoading]) {
        currentExperiment = experimentsLoaded[currentLoading];
        initExperiment();
      } else {
        var exp = experiments[currentLoading];
        require(exp, function(experiment) {
          if (experiment) {
            experimentLoaded(experiment);
          } else {
            con.warn("Experiment loaded... but experiment is null", experiment);
          }
        });

      }
    } else {
      $(buttons).slide(true);
      $('#buy, #cycle').slide(false); //hide();
    }

  }



  // addEventListener("load:complete", function(e) {
  //   con.log("load complete called!");
  //   experimentLoaded(e.detail)
  // });

  function experimentLoaded(_currentExperiment) {
    // con.log("experimentLoaded", _currentExperiment);
    currentExperiment = _currentExperiment;
    if (currentExperiment.init == undefined) return con.warn("Missing property init on currentExperiment");
    if (currentExperiment.kill == undefined) return con.warn("Missing property kill on currentExperiment");
    if (currentExperiment.resize == undefined) return con.warn("Missing property resize on currentExperiment");
    if (currentExperiment.stage == undefined) return con.warn("Missing property stage on currentExperiment");
    experimentsLoaded[currentLoading] = currentExperiment;
    initExperiment();
  }


  var stage;
  function initExperiment() {
    if (typeof currentExperiment.stage === "function") {
      stage = currentExperiment.stage();
    } else {
      stage = currentExperiment.stage;
    }
    holder.appendChild(stage);

    initSettings();

    rand.setSeed(currentRandom);

    if (initialised === false) {
      // initRenderProgress();
      initWindowListener();
      initialised = true;
    };

    artSpecs = {
      design: currentLoading,
      seed: currentRandom
    }
    con.log("calling init");
    currentExperiment.init(600);
    resize();
  }


  function initSettings() {
    con.warn("experiments_infinite initSettings");
    return;
    var i = 0;
    function makeSetting(s) {
      i++;
      var setting = settings[s];
      // con.log("makeSetting", s, setting);
      var div = dom.element("div", {
        style: {
          position: "absolute",
          top: i * 40 + "px",
          left: "100px"
        }
      });
      var label = dom.element("label", {
        innerHTML: setting.label,
        style: {
        //   position: "absolute",
        //   top: "40px",
        //   left: "100px"
        }
      });
      var input = dom.element("input", {
        value: setting.cur,
        type: "number",
        style: {
          // position: "absolute",
          // top: "40px",
          // left: "100px"
        }
      });
      input.addEventListener("change", function(e) {
        con.log("e", s, this.value);
        currentExperiment.settings[s].cur = Number(this.value);
        currentExperiment.render();//s, this.value);
      })
      div.appendChild(label);
      div.appendChild(input);
      holder.appendChild(div);
    }


    var settings = currentExperiment.settings;
    con.log("exp - settings", settings);
    if (settings) {
      if (currentExperiment.render) {
        for (var s in settings) {
          makeSetting(s);
        }
      } else {
        con.warn("experiment has not exposed render function");
      }
    }

  }







  var header = dom.element("h1", {innerHTML: "Welcome to FunkyVector. Pick an experiment..."});
  buttons.appendChild(header);

  for(var e in experiments) {
    var button = dom.element("div", {
      className: "experiment-button",
      key: e
      // innerHTML: e
    });

    var image;
    if (e === "typography") {
      /*
      var images = [
        "typography_2543346430_7cb66a0b_design.png",
        "typography_2636178320_708cdf2c_design.png",
        "typography_3414241921_1e328cad4_design.png",
        "typography_3898719153_8c0fe796_design.png",
        "typography_447817068_e2576321_design.png",
        "typography_4868228168_17bc9760b_design.png",
        "typography_5478291640_23c552116_design.png",
        "typography_7464597120_14e4f0fcc_design.png",
        "typography_7839074228_2364bf7b8_design.png",
        "typography_8621043707_1178edf84_design.png"
      ];
      var preloaded = [];
      var thumbSize = 180;
      var canvas = dom.canvas(thumbSize, thumbSize);
      function drawImage(index) {

        function renderImage(image) {
          var block = 18;
          var blocks = thumbSize / block;
          var order = [];
          while(order.length < blocks * blocks) { order.push(order.length); }
          shuffleArray(order);
          // con.log(order);
          function drawBlock(blockIndex) {
            // con.log("drawBlock", blockIndex, blocks * blocks);
            var posIndex = order[blockIndex];
            var x = (posIndex % blocks) * block;
            var y = Math.floor(posIndex / blocks) * block;
            canvas.ctx.clearRect(x, y, block, block);
            canvas.ctx.drawImage(image, x, y, block, block, x, y, block, block);

            if (blockIndex + 1 < blocks * blocks) {
              setTimeout(function() {
                drawBlock(blockIndex + 1);
              }, 3)
            }
          }
          drawBlock(0);


          setTimeout(function() {
            drawImage(++index % images.length);
          }, 3 * blocks * blocks + 2000);
        }

        // con.log("drawImage", index);

        if (preloaded[index]) {
          renderImage(preloaded[index]);
        } else {
          var currentImage = dom.element("img");
          currentImage.onload = function() {
            renderImage(currentImage);
          }
          currentImage.src = "images/out/" + images[index];
          preloaded[index] = currentImage;
        }
      }
      drawImage(0);
      image = canvas.canvas;
      */





      var tiledColumns = 6; // this is what imagemagic does.
      var thumbSize = 180;
      var tiles = 22;
      var block = 18;
      var blocks = thumbSize / block;

      var canvas = dom.canvas(thumbSize, thumbSize);
      var currentImage = dom.element("img");

      function drawImage(index) {
        // con.log("drawImage", index);

        var tileX = (index % tiledColumns) * thumbSize;
        var tileY = Math.floor(index / tiledColumns) * thumbSize;

        var order = [];
        while(order.length < blocks * blocks) { order.push(order.length); }
        shuffleArray(order);

        // con.log(order);
        function drawBlock(blockIndex) {
          // con.log("drawBlock", blockIndex, blocks * blocks);
          var posIndex = order[blockIndex];
          var x = (posIndex % blocks) * block;
          var y = Math.floor(posIndex / blocks) * block;
          canvas.ctx.clearRect(x, y, block, block);
          canvas.ctx.drawImage(currentImage, tileX + x, tileY + y, block, block, x, y, block, block);

          var nextBlock = blockIndex + 1;
          if (nextBlock < blocks * blocks) {
            setTimeout(function() {
              drawBlock(nextBlock);
            }, 3);
          }
        }
        drawBlock(0);

        setTimeout(function() {
          drawImage(++index % tiles);
        }, 3 * blocks * blocks + 2000);

      }

      currentImage.onload = function() {
        drawImage(0);
      }
      currentImage.src = "images/" + e + ".png";

      image = canvas.canvas;




    } else {
      image = dom.element("div", {
        className: "design-image",
        key: e,
        style: {backgroundImage: "url(images/" + e + ".png)"},
      });
    }

    button.appendChild(image);
    button.addEventListener("click", function(event){
      var design = event.target.key;
      var seed = Math.round(Math.random() * 1e10);
      infinite.clickHandler("design:" + design + "," + seed);
    });
    buttons.appendChild(button);
  }

  function getArt(w, h) {
    return stage.toDataURL("image/png"); // "image/jpeg"
  }

  function getArtSpecs() {
    return artSpecs;
  }

  return {
    buttons: buttons,
    loadExperiment: loadExperiment,
    experiments: experiments,
    getArt: getArt,
    getArtSpecs: getArtSpecs
  };

};

define("experiments_infinite", experiments_infinite);
