define("exps_about", function() {
  var descriptions = {
    "synth_ambient": "This is all the info about Synth Ambient"
  };
  return {
    getDescription: function(exp) {
      return descriptions[exp] || false;
    }
  }
});