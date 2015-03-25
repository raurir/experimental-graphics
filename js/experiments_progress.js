function initRenderProgress() {
  // con.log('initRenderProgress');
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
