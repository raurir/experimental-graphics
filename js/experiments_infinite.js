function initExperiments() {

  var currentExperiment, experimentsLoaded = {}, currentLoading = null;

  var buttons = dom.element("div", {className:"experiment-buttons"});
  var holder = dom.element("div", {className:"experiment-holder"});

  document.body.appendChild(buttons);
  document.body.appendChild(holder);


  var experiments = {
    "bezier_flow": ["bezier_flow"],
    "hexagon_tile": ["hexagon_tile"],
    "maze": ["maze"],

    // "Mining_Branches": ["mining_branches"],
    // "Oscillate_Curtain": ["oscillate_curtain"],
    // "pattern_check": ["pattern_check"],
    // "pattern_circles": ["pattern_circles"],
    // "polyhedra": ["polyhedra","3d"],
    // "spiral_even": ["spiral_even"],
    // "squaretracer": ["squaretracer"],
    // "voronoi_stripes": ["voronoi_stripes", "voronoi"],
  };

  function createScript(s) {
    var script = dom.element("script");
    script.src = s;
    document.body.appendChild(script);
  }



  function resize() {
    // con.log("implement experiment resize!");
    // var sw = window.innerWidth, sh = window.innerHeight;
    // currentExperiment.resize(sw,sh);
  }
  var bitch = false;
  function initWindowListener() {
    if (bitch) return;
    window.addEventListener("resize", resize);
    bitch = true;
  }

  var currentRandom;

  function loadExperiment(params) {
    if (params) {
      params = params.split(",");
      var newLoading = params[0];
      var newRandom = params[1];

      if (newLoading === currentLoading && newRandom === currentRandom) return con.warn("Already loaded experiment...");

      currentLoading = newLoading;
      currentRandom = newRandom;

      if (currentExperiment) {
        currentExperiment.kill();
        currentExperiment = null;
        while (holder.childNodes.length) holder.removeChild(holder.firstChild);
      }

      if (experimentsLoaded[currentLoading]) {
        // con.log("script already loaded...", currentLoading);
        currentExperiment = experimentsLoaded[currentLoading];
        initExperiment();
      } else {
        var exp = experiments[currentLoading];
        // con.log("loadExperiment", exp );
        for (var i = exp.length - 1; i > -1;i--) {
          var file = exp[i];
          var src = "experiments/" + file +  ".js" + "?" + Math.random() * 1e10;
          createScript(src);
        }
      }
      // $(buttons).slide(false);
    } else {
      // $(buttons).slide(true);

    }

  }



  addEventListener("load:complete", function(e) {
    // con.log("Loaded", e);
    currentExperiment = e.detail;
    if (currentExperiment.init == undefined) return con.warn("Missing property init on currentExperiment");
    if (currentExperiment.kill == undefined) return con.warn("Missing property kill on currentExperiment");
    if (currentExperiment.resize == undefined) return con.warn("Missing property resize on currentExperiment");
    if (currentExperiment.stage == undefined) return con.warn("Missing property stage on currentExperiment");
    experimentsLoaded[currentLoading] = currentExperiment;
    initExperiment();
  });

  function initExperiment() {
    var stage;
    if (typeof currentExperiment.stage === "function") {
      stage = currentExperiment.stage();
    } else {
      stage = currentExperiment.stage;
    }
    // con.log(typeof currentExperiment.stage === "function", currentExperiment.stage, stage);
    holder.appendChild(stage);

    rand.setSeed(currentRandom);
    // con.log("rand", currentRandom, rand.random());

    initRenderProgress();
    initWindowListener();

    currentExperiment.init();
    resize();
  }

  for(var e in experiments) {
    var button = dom.element("div", {className: "button", key: e, innerHTML: e});
    button.addEventListener("click", function(event){
      clickHandler("design:" + event.target.key + "," + Math.round(Math.random() * 1e10));
    });
    buttons.appendChild(button);
  }

  return {
    buttons: buttons,
    loadExperiment: loadExperiment,
    experiments: experiments
  };

};