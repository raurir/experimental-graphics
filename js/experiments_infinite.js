// var seed = 411930879;
var seed = ~~(Math.random() * 1e9)
// seed = 662718928;
// con.log(seed);
var same = seed;

var originalRand = Math.random

Math.random = function() {
  var x = (Math.sin(seed) + 1) * 10000;
  seed += 1;
  return x % 1;
}
getRandom = Math.random;


function initExperiments() {

  var currentExperiment;

  var buttons = dom.element("div", {className:"buttons"});
  var holder = dom.element("div", {className:"experiment-holder"});

  document.body.appendChild(buttons);
  document.body.appendChild(holder);


  var experiments = {
    "Bezier_Flow": ["bezier_flow"],
    "Hexagon_Tile": ["hexagon_tile"],
    "Maze": ["maze"],
    "Mining_Branches": ["mining_branches"],
    "Oscillate_Curtain": ["oscillate_curtain"],
    "pattern_check": ["pattern_check"],
    "pattern_circles": ["pattern_circles"],
    "polyhedra": ["polyhedra","3d"],
    "spiral_even": ["spiral_even"],
    "squaretracer": ["squaretracer"],
    "voronoi_stripes": ["voronoi_stripes", "voronoi"],
  };

  function createScript(s) {
    var script = dom.element("script");
    script.src = s;
    document.body.appendChild(script);
  }



  function resize() {
    con.log("implement experiment resize!");
    // var sw = window.innerWidth, sh = window.innerHeight;
    // currentExperiment.resize(sw,sh);
  }
  var bitch = false;
  function initWindowListener() {
    if (bitch) return;
    window.addEventListener("resize", resize);
    bitch = true;
  }


  function loadExperiment(key) {

    if (currentExperiment) {
      currentExperiment.kill();
      currentExperiment = null;
      while (holder.childNodes.length) holder.removeChild(holder.firstChild);
    }

    var exp = experiments[key];
    // con.log("loadExperiment", exp);
    for (var i = exp.length - 1; i > -1;i--) {
      var file = exp[i];
      var src = "experiments/" + file +  ".js" + "?" + Math.random() * 1e10;
      createScript(src);
    }
  }



  addEventListener("load:complete", function(e) {
    con.log("Loaded", e);
    currentExperiment = e.detail;
    if (currentExperiment.stage) {
      var stage;
      if (typeof currentExperiment.stage === "function") {
        stage = currentExperiment.stage();
      } else {
        stage = currentExperiment.stage;
      }
      con.log(typeof currentExperiment.stage === "function", currentExperiment.stage, stage);

      holder.appendChild(stage);
    } else {
      return con.warn("no stage set in current experiment:", currentExperiment)
    }
    initRenderProgress();
    initWindowListener();
    currentExperiment.init();
    resize();
  });

  for(var e in experiments) {
    var button = dom.element("button");
    button.addEventListener("click", function(event){
      clickHandler("design:" + event.target.key);
    });
    var key = e;
    button.key = key
    button.innerHTML = key;
    buttons.appendChild(button);
  }

  return {
    buttons: buttons,
    loadExperiment: loadExperiment,
    experiments: experiments
  };

};