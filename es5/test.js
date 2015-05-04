"use strict";

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var con = console;

var Idunno = (function () {
  function Idunno(param) {
    _classCallCheck(this, Idunno);

    con.log("Idunno constructor", param);
  }

  _createClass(Idunno, [{
    key: "render",
    value: function render() {
      con.log("original render");
    }
  }]);

  return Idunno;
})();

var Blah = (function (_Idunno) {
  function Blah() {
    _classCallCheck(this, Blah);

    if (_Idunno != null) {
      _Idunno.apply(this, arguments);
    }
  }

  _inherits(Blah, _Idunno);

  _createClass(Blah, [{
    key: "render",
    value: function render() {
      console.log("ok");
    }
  }, {
    key: "kill",
    value: function kill() {
      con.log("kill");
    }
  }]);

  return Blah;
})(Idunno);

var d = new Idunno("hello");

var e = new Blah("hello 2");
e.render();
//# sourceMappingURL=test.js.map