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




(function() {

  var holder = dom.element("div");
  document.body.appendChild(holder);


  var experiments = [
    ["additive"],
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
    ["recursive"],
    ["spiral_even"],
    ["squaretracer"],
    ["tea"],
    ["voronoi_stripes", "voronoi"],
  ];

  function createScript(s) {
    var script = dom.element("script");
    script.src = s;
    document.body.appendChild(script);
  }

  function creatStyleSheet(s) {
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
    for (var i = exp.length - 1; i > -1;i--) {
      var file = exp[i]
      if (/css/.test(file)) {
        creatStyleSheet(file);
      } else {
        var src = "js/" + file +  ".js";
        if (file == "THREE") {
          src = "lib/three/three.min.js";
        }
        createScript(src);
      }
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

  function initRenderProgress() {
    con.log('initRenderProgress');
    var loader, graph, bar;

    function createLoader() {
      loader = dom.element("div", {className:"experiments-loader"});
      graph = dom.element("div", {className:"experiments-loader-graph"});
      bar = dom.element("div", {className:"experiments-loader-graph-bar"});
      loader.appendChild(graph);
      graph.appendChild(bar);
      loader.addEventListener("click", function(e){
        con.log("captured...");
        e.stopPropagation();
        e.preventDefault();
        return false;
      });
    }


    addEventListener('render:start', function (e) {
      if (loader) {
        bar.style.width = "0%";
      }
    }, false);
    addEventListener('render:progress', function (e) {
      // con.log("progress", e.detail);
      if (loader == undefined) {
        createLoader();
      }
      document.body.appendChild(loader);
      loader.classList.remove("complete");
      bar.style.width = Math.round(e.detail * 100) + "%";
    }, false);
    addEventListener('render:complete', function (e) {
      if (loader) {
        bar.style.width = "100%";
        loader.classList.add("complete");
        setTimeout(function() {
          loader.classList.remove("complete");
          bar.style.width = "0%";
          try { document.body.removeChild(loader); } catch(e) { /* already removed? */}
        },200);
      }
    }, false);
  }

  var currentExperiment;

  function resize() {
    // con.log("resize!");
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

  addEventListener("load:complete", function(e) {
    con.log("Loaded", e);
    currentExperiment = e.detail;



    holder.appendChild(currentExperiment.stage);
    initRenderProgress();
    initWindowListener();
    currentExperiment.init();
    resize();
  });


  // document.body.appendChild(colours.showPalette());
  // return {
  //  load: loadExperiment,
  //  experiments: experiments
  // };
})();