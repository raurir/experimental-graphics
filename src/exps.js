var progressBar;

const progress = (eventName, eventParam) => {
	con.log("experiments progress", eventName, eventParam);
	switch (eventName) {
		case "render:progress":
			progressBar.style.width = eventParam * 100 + "%";
			progressBar.style.height = "10px";
			break;
		case "render:complete":
			// eventParam is canvas usually...
			progressBar.style.height = "0px";
			break;
	}
};

const exps = (experimentsDetails) => {
	const experiments = experimentsDetails.list;

	return () => {
		var info;
		// eslint-disable-next-line
		var infoShowing = false;
		var interactedShowing = false;
		var currentExperiment;
		var viewSource = false;
		var seed;

		progressBar = dom.element("div", {
			id: "progress",
			style: {width: 0, height: 0},
		});
		document.body.appendChild(progressBar);

		var holder = dom.element("div", {id: "experiment-holder"});
		document.body.appendChild(holder);

		var buttonsNav = dom.element("div", {className: "exps-buttons"});
		document.body.appendChild(buttonsNav);

		var buttonClose = dom.button("X", {className: "exps-button"});
		buttonsNav.appendChild(buttonClose);
		dom.on(buttonClose, ["click", "touchend"], () => {
			window.location = `/${viewSource ? "?src" : ""}`;
		});

		var buttonInfo = dom.button("?", {className: "exps-button"});
		buttonsNav.appendChild(buttonInfo);
		dom.on(buttonInfo, ["click", "touchend"], showInfo);

		var panelInfo = dom.element("div", {className: "exps-info"});
		var panelInfoDetails = dom.element("div", {
			className: "exps-info-details",
		});
		var panelNav = dom.element("div", {className: "exps-buttons interacted"});
		var panelButtonClose = dom.button("X", {className: "exps-button"});

		dom.on(panelButtonClose, ["click", "touchend"], hideInfo);

		document.body.appendChild(panelInfo);
		panelInfo.appendChild(panelNav);
		panelNav.appendChild(panelButtonClose);
		panelInfo.appendChild(panelInfoDetails);

		const createStyleSheet = (s) => {
			var link = dom.element("link");
			// link.id = cssId;
			link.rel = "stylesheet";
			link.type = "text/css";
			link.href = `css/${s}.css`;
			// link.media = "all";
			document.head.appendChild(link);
		};

		const loadExperiment = (index) => {
			const flagCSS = "css:";
			let src = experiments[index];
			if (src.toString().includes(flagCSS)) {
				src = src.filter((file) => {
					const isCSS = file.includes(flagCSS);
					if (isCSS) {
						createStyleSheet(file.replace(flagCSS, ""));
					}
					return !isCSS; // filter out non css files
				});
			}
			require(src, (experiment) => {
				if (experiment) {
					experimentLoaded(experiment);
				} else {
					con.warn("require loaded... but experiment is null", experiment);
				}
			});
		};

		const showButtons = () => {
			buttonClose.style.display = "none";
			buttonInfo.style.display = "none";
			for (var e in experiments) {
				var button = dom.element("button", {className: "exp"});
				dom.on(button, ["click"], (event) => {
					window.location = `?${event.target.key}${viewSource ? "&src" : ""}`;
				});
				var key = experiments[e][0];
				var title = key;
				var expDetails = experimentsDetails.getDetails(key);
				if (expDetails && expDetails.title) {
					title = expDetails.title;
				}
				button.key = key;
				button.innerHTML = title;
				document.body.appendChild(button);
			}
		};

		const showInfo = () => {
			infoShowing = true;
			panelInfo.classList.add("displayed");
			panelInfoDetails.innerHTML = `
<h4>Experimental Graphics</h4>
<h1>${info.title}</h1>
${info.description}
<p><a href='https://github.com/raurir/experimental-graphics/blob/master/js/${info.key}.js' target='_blank'>SRC on Github</a></p>`;
		};

		const hideInfo = () => {
			panelInfo.classList.remove("displayed");
			infoShowing = false;
		};

		const checkURL = () => {
			if (window.location.search) {
				/*
				expected window.location.search:
				?alien
				?alien,39343
				?alien,39343&src
				?alien,39343&src=true
				*/
				var params = window.location.search.split("?")[1].split("&"),
					key = params[0],
					index = 0,
					found = false,
					keyWithSeed = key.split(",");
				viewSource = params.filter((param) => param === "src").length;
				if (viewSource) {
					con.log("`src` in url: Experimental graphics in SRC mode...");
				}
				if (key === "src") {
					// if first key showbuttons...
					return showButtons();
				}
				if (keyWithSeed[1]) {
					key = keyWithSeed[0];
					seed = keyWithSeed[1];
					rand.setSeed(seed);
					con.log("found key, seed", rand);
				} else {
					// seed =
				}

				while (index < experiments.length && found == false) {
					if (experiments[index][0] == key) {
						found = true;
					} else {
						index++;
					}
				}
				loadExperiment(index);

				info = experimentsDetails.getDetails(key);
				if (info) {
					info.key = key;
				} else {
					buttonsNav.removeChild(buttonInfo);
				}
				// showInfo();
				dom.on(document.body, ["click", "touchstart"], function() {
					if (interactedShowing) return;
					interactedShowing = true;
					buttonsNav.classList.add("interacted");
					// setTimeout(function() {
					//   buttonsNav.classList.remove("interacted");
					//   interactedShowing = false;
					// }, 3000);
				});
			} else {
				showButtons();
			}
		};

		const resize = () => {
			// con.log("resize!");
			var sw = window.innerWidth,
				sh = window.innerHeight;

			if (currentExperiment.resize) currentExperiment.resize(sw, sh);

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
		};

		const initWindowListener = () => {
			dom.on(window, ["resize"], resize);
		};

		const experimentLoaded = (exp) => {
			currentExperiment = typeof exp === "function" ? exp() : exp;
			if (currentExperiment.stage) {
				holder.appendChild(currentExperiment.stage);
			} else {
				con.warn("experimentLoaded, but no stage:", currentExperiment.stage);
			}
			// initRenderProgress(); // experiments_progress
			// con.log("inittted!!!!!!");
			initWindowListener();
			currentExperiment.init({progress, seed, size: 800});
			resize();
		};

		checkURL();

		// document.body.appendChild(colours.showPalette());

		// document.body.innerHTML = window.innerWidth;
		return {
			load: loadExperiment,
			experiments,
		};
	};
};

define("exps", ["exps_details"], exps);
