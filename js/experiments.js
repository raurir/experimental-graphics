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











// rand.setSeed(411930879); // this doesn"t work for bezier flow
rand.setSeed();


var experiments = (function() {

  var holder = dom.element("div");
  document.body.appendChild(holder);

  require.config({
    baseUrl: "js",
    urlArgs: "bust=" + (new Date()).getTime(),
    paths: {
      "THREE": "../lib/three/three.min",
      "TweenMax": "../lib/greensock/TweenMax.min",
      "creature": "creature_creator/creature",
      "box": "games/box"
    },
  });



  var experiments = [
    ["molecular_three", "THREE"],

    ["box"],

    ["unknown"],
    ["_test"],
    ["additive"],
    ["anemone_three", "THREE"],
    ["bezier_flow"],
    ["creature"],//, "creature_creator"], //, "creature_creator/creature_creator", "creature_creator/human"],
    ["hexagon_tile"],
    ["isometric_cubes"],
    ["fool", "css/fool"],
    ["maze"],
    ["mining_branches"],
    ["meandering_polygons"],
    ["oscillate_curtain"],
    ["pattern_check", "css/pattern_check"],
    ["pattern_circles"],
    ["polyhedra","3d"],
    ["polyhedra_three","THREE"],
    ["race_lines_three","THREE", "TweenMax"],
    ["recursive"],
    ["rectangular_fill"],
    ["spiral_even"],
    ["squaretracer"],
    ["tea"],
    ["tunnel_tour_three","THREE", "TweenMax"],
    ["voronoi_stripes", "voronoi"],
  ];

  function createStyleSheet(s) {
    var link  = dom.element("link");
    // link.id = cssId;
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = s + ".css";
    // link.media = "all";
    document.head.appendChild(link);
  }

  function loadExperiment(index) {
    var exp = experiments[index];

    var src = [];

    /*
    for (var i = exp.length - 1; i > -1;i--) {
      var file = exp[i]
      if (/css/.test(file)) {
        createStyleSheet(file);
      } else {
        switch(file) {
          case "THREE" :
            src.push("lib/three/three.min");
            break;
          case "Matter" :
            src.push("lib/matter/matter-0.8.0");
            break;
           case "P2" :
            src.push("lib/p2/p2");//, "lib/p2/p2.renderer");
            break;
          default:

            src.push("js/" + file);
        }
        // createScript(src);
      }
    }
    */

    src = exp;

    // con.log("loadExperiment", exp);
    // con.log("loadExperiment src to load:",  src.length);

    // require(["js/creature_creator/creature"], function(creature) {
    //   con.log("creature!!!!!!!!", creature);
    // })








    // require([
    //   "testmod",
    //   "zetestmod",
    //   "creature"
    // ], function(testmod, zetestmod, creature) {
    //     console.log("experiments:", testmod, zetestmod, creature);
    // });










    require(src, function(experiment) {
      // con.log("require loaded");
      if (experiment) {
        con.log("require loaded...", experiment);
        // ExperimentFactory(experiment);
        experimentLoaded(experiment);
      } else {
        con.log("require loaded... but experiment is null", experiment, arguments);
      }
    });


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

  if (window.location.search) {
    var key = window.location.search.split("?")[1], index = 0, found = false;
    while(index < experiments.length && found == false) {
      if ( experiments[index][0] == key) {
        found = true;
      } else {
        index++;
      }
    }
    loadExperiment(index);
  } else {
    showButtons();
  }

  var currentExperiment;

  function resize() {
    con.log("resize!");
    var sw = window.innerWidth, sh = window.innerHeight;

    currentExperiment.resize(sw,sh);


    // currentExperiment.stage.setSize(sw,sh);

    // var largestDimension = sw > sh ? sw : sh;
    // var scale = largestDimension / size;
    // var x = 0, y = 0;
    // if (sw < sh) {
    //   x = -((scale * size) - sw) / 2;
    // } else {
    //   y = -((scale * size) - sh) / 2;
    // }

    // currentExperiment.inner.setAttribute("transform", "translate(" + x + "," + y + ") scale(" + scale + ")");


  }

  function initWindowListener() {
    window.addEventListener("resize", resize);
  }

  function experimentLoaded(exp) {
    currentExperiment = exp;
    if (currentExperiment.stage) {
      holder.appendChild(currentExperiment.stage);
    } else {
      con.log("experimentLoaded, but no stage:", currentExperiment.stage);
    }
    // initRenderProgress(); // experiments_progress
    initWindowListener();
    currentExperiment.init();
    resize();
  }

  addEventListener("load:complete", function(e) {
    con.log("Loaded", e);
    experimentLoaded(e.detail);
  });



  console.log("Experiments init");
  // document.body.appendChild(colours.showPalette());
  return {
   load: loadExperiment,
   experiments: experiments
  };
})();

