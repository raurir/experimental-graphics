var isNode = (typeof module !== 'undefined');
var con = console;

function ExperimentFactory(experiment, callback) {

  con.log("ExperimentFactory");

  function progress() {
    if (isNode) {
      // con.log("callback", arguments);
      callback(arguments[0], arguments[1]);
    } else {
      if (arguments.length === 2) {
        dispatchEvent(new CustomEvent(arguments[0], {detail: arguments[1]}));
      } else {
        dispatchEvent(new Event(arguments[0]));
      }
    }
  }

  var e = experiment(progress);

  if (e.name === undefined) return con.warn("no name");
  if (e.init === undefined) return con.warn("no init function");
  if (e.resize === undefined) return con.warn("no resize function");
  if (e.stage === undefined) return con.warn("no stage set");

  con.log("ExperimentFactory created \"" + e.name + "\"");

  return e;
}

if (isNode) module.exports = ExperimentFactory;