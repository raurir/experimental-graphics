var progressBar;
function progress(eventName, eventParam) {
  con.log("experiments progress", eventName, eventParam);
  switch (eventName) {
    case "render:progress" :
      progressBar.style.width = (eventParam * 100) + "%";
      progressBar.style.height = "10px";
      break;
    case "render:complete" :
      // eventParam is canvas usually...
      progressBar.style.height = "0px";
      break;
  }
}

function exps(experiments, about) {

  return function() {

    var info;

    progressBar = dom.element("div", {id: "progress", style: {width: 0, height: 0}});
    document.body.appendChild(progressBar);

    var buttonsNav = dom.element("div", {className: "exps-buttons"});
    document.body.appendChild(buttonsNav);

    var buttonClose = dom.button("X", {className: "exps-button"});
    buttonsNav.appendChild(buttonClose);
    dom.on(buttonClose, ["click"], function(e) {
      window.location = "/";
    });

    var buttonInfo = dom.button("?", {className: "exps-button"});
    buttonsNav.appendChild(buttonInfo);
    dom.on(buttonInfo, ["click"], function(e) {
      alert(info)
    });

    var holder = dom.element("div");
    document.body.appendChild(holder);

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
      buttonClose.style.display = "none";
      buttonInfo.style.display = "none";
      for(var e in experiments) {
        var button = dom.element("button", {className: "exp"});
        dom.on(button, ["click"], function(event){
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
        rand.setSeed();
        // blah = seed;
      }

      while(index < experiments.length && found == false) {
        if ( experiments[index][0] == key) {
          found = true;
        } else {
          index++;
        }
      }
      loadExperiment(index);

      info = about.getDescription(key);
      if (!info) {
        buttonsNav.removeChild(buttonInfo);
      }
      dom.on(document.body, ["click", "touchstart"], function(e) {
        buttonsNav.classList.add("interacted");
        setTimeout(function() {
          buttonsNav.classList.remove("interacted");
        }, 3000);
        // dom.on(document.body, ["mousemove", ], function(e) {
        //   buttonsNav.classList.add('interacted');
        // });
      });

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
      dom.on(window, ["resize"], resize);
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
      currentExperiment.init({size: 800});
      resize();
    }

    // document.body.appendChild(colours.showPalette());

    return {
     load: loadExperiment,
     experiments: experiments
    };
  }

};

define("exps", ["exps_active", "exps_about"], exps);