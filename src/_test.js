define(function (require) {

  var stage = dom.element("div");

  var b1 = dom.button("test1", {style:{color:"white"}});
  var b2 = dom.button("test2", {style:{color:"white"}});

  stage.appendChild(b1);
  stage.appendChild(b2);

  dom.on(b1, ["click"], go);


  function go() {
    con.log("go!!")
    dom.on(b2, ["click"], go);
    dom.off(b1, ["click"], go);
  }

	con.log('test loaded');
	// return 1;
  return {
    stage: stage,
    init: function() {},
    resize: function() {},
  }
});
