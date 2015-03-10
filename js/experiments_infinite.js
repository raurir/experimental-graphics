// // var seed = 411930879;
// var seed = ~~(Math.random() * 1e9)
// // seed = 662718928;
// // con.log(seed);
// var same = seed;

// var originalRand = Math.random

// Math.random = function() {
//   var x = (Math.sin(seed) + 1) * 10000;
//   seed += 1;
//   return x % 1;
// }
// getRandom = Math.random;




var experiments = (function() {

  var holder = dom.element("div");
  document.body.appendChild(holder);


  var experiments = [
    ["bezier_flow"],
    ["hexagon_tile"],
    ["maze"],
    ["mining_branches"],
    ["oscillate_curtain"],
    ["pattern_check"],
    ["pattern_circles"],
    ["polyhedra","3d"],
    ["spiral_even"],
    ["squaretracer"],
    ["voronoi_stripes", "voronoi"],
  ];

  function createScript(s) {
    var script = dom.element("script");
    script.src = s;
    document.body.appendChild(script);
  }

  function loadExperiment(index) {
    var exp = experiments[index];
    for (var i = exp.length - 1; i > -1;i--) {
      var file = exp[i]
      var src = "experiments/" + file +  ".js";
      createScript(src);
    }
    // con.log("experiment", experiment);
  }
  function showButtons() {
    for(var e in experiments) {
      var button = dom.element("button");
      button.addEventListener("click", function(event){
        window.location = "?" + event.target.key;
      });
      var key = experiments[e][0];
      button.key = key
      button.innerHTML = key;
      document.body.appendChild(button);
    }
  }

  var currentExperiment;

  function resize() {
    con.log("implement experiment resize!");
    // var sw = window.innerWidth, sh = window.innerHeight;
    // currentExperiment.resize(sw,sh);
  }

  function initWindowListener() {
    window.addEventListener("resize", resize);
  }

  addEventListener("load:complete", function(e) {
    con.log("Loaded", e);
    currentExperiment = e.detail;

    holder.appendChild(currentExperiment.stage);
    initRenderProgress();
    initWindowListener();
    currentExperiment.init();
    resize();
  });

  console.log("init");
  return {
   load: loadExperiment,
   experiments: experiments
  };
})();

console.log("dfd", experiments);