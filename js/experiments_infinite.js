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

  document.body.appendChild(buttons);
  document.body.appendChild(holder);

  var experiments = {
    "bezier_flow": ["bezier_flow"],
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
    // con.log("! loadExperiment params:", params);
    if (params) {

      $(buttons).slide(false);
      $('#buy').show();

      params = params.split(",");
      var newLoading = params[0];
      var newRandom = params[1];

      if (newLoading === currentLoading && newRandom === currentRandom) {
        return; // con.warn("Already loaded experiment...");
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
      $('#buy').hide();
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

    currentExperiment.init();
    resize();
  }

  for(var e in experiments) {
    var button = dom.element("div", {className: "button", key: e, innerHTML: e});
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
