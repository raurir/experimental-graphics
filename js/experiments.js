var gfx = (function() {
	var experiments = [
		["additive"],
		["hexagon_tile"],
		["isometric_cubes"],
		["fool", "css/fool"],
		["mining_branches"],
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

	// document.body.appendChild(colours.showPalette());
	return {
		load: loadExperiment,
		experiments: experiments
	};
})();