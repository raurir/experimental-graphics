define("exps_details", function() {

  var list = [

    // ["unknown"],
    // ["_test"],

    ["additive"],
    ["anemone_three", "THREE"],
    ["any_image_url"],
    ["bezier_flow"],
    ["box", "maze"],
    ["circle_packing"],
    ["circle_packing_zoom_loop"],
    ["circle_sectors"],
    ["codevember", "THREE", "TweenMax"],
    ["corona_sine"],
    ["creature"],//, "creature_creator"], //, "creature_creator/creature_creator", "creature_creator/human"],
    ["cube_fractal_zoom", "THREE", "TweenMax"],
    ["cube_pixelator", "THREE", "TweenMax"],
    ["fool", "css/fool"],
    ["hexagon_tile"],
    ["infinite_scrolling_cogs"],
    ["isometric_cubes"],
    ["isometric_words", "THREE", "TweenMax"],
    ["linked_line"],
    ["mandala"],
    ["maze"],
    ["maze_cube", "linked_line", "THREE"],//, "https://threejs.org/examples/js/exporters/OBJExporter.js"],//  "lib/three/OBJExporter.js", "lib/three/OrbitControls.js"],
    ["meandering_polygons"],
    ["mining_branches"],
    ["molecular_three", "THREE"],
    ["nested_rotating_polygon", "ease"],
    ["oscillate_curtain"],
    ["overflow"],
    ["pattern_check", "css/pattern_check"],
    ["pattern_circles"],
    ["perlin_grid", "THREE", "TweenMax"],
    ["perlin_leaves"],
    ["perlin_noise"],
    ["polyhedra","3d"], // 3d is not moduled!
    ["polyhedra_three", "THREE", "../lib/stemkoski/polyhedra"],
    ["pine_three","THREE"],
    ["race_lines_three", "THREE", "TweenMax"],
    ["rainbow_particles"],
    ["rectangular_fill"],
    ["recursive"],
    ["recursive_polygon"],
    ["spiral_even"],
    ["squaretracer"],
    ["synth_ambient", "Tone"],
    ["tea"],
    ["tetris_cube", "THREE", "TweenMax"],
    ["text_grid"],
    ["tunnel_tour_three", "THREE", "TweenMax"],
    ["typography"],
    ["voronoi_stripes", "voronoi"],
    ["zoned_particles"],

  ];

  var details = {
    "cube_pixelator": {
      "title": "Cube pixelator",
      "description": "<p>Should be called 'Plane pixelator' since they are planes, not cubes.</p><p>Planes are distributed through a 2 dimensional grid with each plane representing a pixel.</p><p>Each plane is exactly the same colour and this colour never changes. Instead, each plane rotates accordingly to catch the lighting within the scene and by doing so adapts its apparent shade, and thereby creates an image.</p>"
    },
    "isometric_words": {
      "title": "Isometric Words",
      "description": "<p>Muddling up cubes by using the simplicity of Isometric projection.</p><p>Randomly offset the objects along the same axis the camera is looking down.</p>"
    },
    "synth_ambient": {
      "title": "Synth Ambient",
      "description": "<h2>This will be loud!</h2><p>A quick trip into audio synthesis in the browser.</p><p>That's the thing about synthesis, you can create out of control waveforms quite easily, hence the volume.</p><p>Using <a href='https://github.com/Tonejs/Tone.js' target='_blank'>Tone.js</a> for all the audio generation, this experiment creates a number of randomised effects, a bunch of randomised synthesizers, and with those creates a randomised drum track, randomised chords and a ranomised arpeggio.</p>"
    },
    "cube_fractal_zoom": {
      "title": "Cube Fractal Zoom",
      "description": "<p>Zooming into a cube that subdivides into muliple cubes.</p><p>Envisioned version is for each subdivision to be variable slice amounts rather than 2x2x2. Someday.</p><p>Also would like some kind of infinite shader, potentially perlin noise.</p>"
    },
    "infinite_scrolling_cogs": {
      "title": "Infinite Scrolling Cogs",
      "description": "<p>Remake of <a href='https://codepen.io/raurir/pen/eknLg' target='_blank'>an old experiment</a> this time it's scrolling, non ineractive and more of a toon rendering style.</p><p>The thing I liked the best about the original, and this algorithm, is the cogs are very close to mathematically correct; not only do they animate in a life like fashion on screen, I am confident a 3D print of the geometry involved would result in a smoothly running friction free machine.</p><p>This algorithm continually creates canvases with no garbage collection. It will crash the browser eventually, I imagine, but you'd be bored after a minute anyway?</p>"
    },
  };
  return {
    list: list,
    getDetails: function(exp) {
      return details[exp] || false;
    },
    getFeature: function(key) {
      var features = {
        "codevember": [
          {"day": 1, "title": details.cube_pixelator.title, "link": "cube_pixelator"},
          {"day": 2, "title": details.synth_ambient.title, "link": "synth_ambient"},
          {"day": 3, "title": "Refactored Experiments"}, // not actually an experiment
          {"day": 4, "title": "Made Codevember"}, // not actually an experiment
          {"day": 5, "title": "fail :("}, // might back fill this one, probably have some more fails though
          {"day": 6, "title": details.isometric_words.title, "link": "isometric_words"},
          {"day": 7, "title": "fail ..."},
          {"day": 8, "title": details.cube_fractal_zoom.title, "link": "cube_fractal_zoom"},
          {"day": 9, "title": details.infinite_scrolling_cogs.title, "link": "infinite_scrolling_cogs"},
        ]
      }
      return features[key] || false;
    }
  }
});