define("exps_details", function() {

  var list = [

    ["molecular_three", "THREE"],

    ["unknown"],
    ["_test"],


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
    ["cube_pixelator", "THREE", "TweenMax"],
    ["fool", "css/fool"],
    ["hexagon_tile"],
    ["isometric_cubes"],
    ["linked_line"],
    ["mandala"],
    ["maze"],
    ["maze_cube", "linked_line", "THREE"],//, "https://threejs.org/examples/js/exporters/OBJExporter.js"],//  "lib/three/OBJExporter.js", "lib/three/OrbitControls.js"],
    ["meandering_polygons"],
    ["mining_branches"],
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
    "synth_ambient": {
      "title": "Synth Ambient",
      "description": "<h2>This will be loud!</h2><p>A quick trip into audio synthesis in the browser.</p><p>That's the thing about synthesis, you can create out of control waveforms quite easily, hence the volume.</p><p>Using <a href='https://github.com/Tonejs/Tone.js' target='_blank'>Tone.js</a> for all the audio generation, this experiment creates a number of randomised effects, a bunch of randomised synthesizers, and with those creates a randomised drum track, randomised chords and a ranomised arpeggio.</p>"
    }
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
        ]
      }
      return features[key] || false;
    }
  }
});