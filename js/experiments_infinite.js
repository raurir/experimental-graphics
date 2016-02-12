function experiments_infinite() {

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
    currentExperiment.init(1000);
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
    var image = dom.element("div", {
      className: "design-image",
      key: e,
      style: {backgroundImage: "url(images/" + e + ".png)"},
    });
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
