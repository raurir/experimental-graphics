"use strict";

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var con = console;

var Idunno = function Idunno(param) {
  _classCallCheck(this, Idunno);

  con.log("Idunno constructor", param);
};

var Blah = (function (_Idunno) {
  function Blah() {
    _classCallCheck(this, Blah);

    if (_Idunno != null) {
      _Idunno.apply(this, arguments);
    }
  }

  _inherits(Blah, _Idunno);

  return Blah;
})(Idunno);

var d = new Idunno("hello");

var e = new Blah("hello 2");
//# sourceMappingURL=test.js.map