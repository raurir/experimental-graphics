function progress() {/*con.log("experiments progress", arguments);*/}


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


    ["unknown"],
    ["_test"],


    ["additive"],
    ["anemone_three", "THREE"],
    ["bezier_flow"],
    ["box", "maze"],
    ["corona_sine"],
    ["creature"],//, "creature_creator"], //, "creature_creator/creature_creator", "creature_creator/human"],
    ["fool", "css/fool"],
    ["hexagon_tile"],
    ["isometric_cubes"],
    ["maze"],
    ["meandering_polygons"],
    ["mining_branches"],
    ["oscillate_curtain"],
    ["pattern_check", "css/pattern_check"],
    ["pattern_circles"],
    ["polyhedra","3d"],
    ["polyhedra_three","THREE"],
    ["pine_three","THREE"],
    ["race_lines_three","THREE", "TweenMax"],
    ["rainbow_particles"],
    ["rectangular_fill"],
    ["recursive"],
    ["spiral_even"],
    ["squaretracer"],
    ["tea"],
    ["tunnel_tour_three","THREE", "TweenMax"],
    ["typography"],
    ["voronoi_stripes", "voronoi"],
    ["zoned_particles"],
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
    var src = experiments[index];
    require(src, function(experiment) {
      if (experiment) {
        con.log("require loaded...", experiment);
        experimentLoaded(experiment);
      } else {
        con.warn("require loaded... but experiment is null", experiment, arguments);
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
    var seed = key.split(",");
    if (seed[1]) {
      key = seed[0];
      seed = seed[1];
      rand.setSeed(seed);
    } else {
<<<<<<< HEAD
      rand.setSeed();
      // blah = seed;
||||||| merged common ancestors
      // rand.setSeed();
      // blah = seed;
=======
      rand.setSeed(); // 2985219014
>>>>>>> 900de6e06b689cee1a3587578bfac4edf7868d92
    }

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
    // con.log("resize!");
    var sw = window.innerWidth, sh = window.innerHeight;

    if (currentExperiment.resize) currentExperiment.resize(sw,sh);

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
      con.warn("experimentLoaded, but no stage:", currentExperiment.stage);
    }
    // initRenderProgress(); // experiments_progress
    // con.log("inittted!!!!!!");
    initWindowListener();
    currentExperiment.init(800);
    resize();
  }

  // document.body.appendChild(colours.showPalette());

  return {
   load: loadExperiment,
   experiments: experiments
  };
})();

