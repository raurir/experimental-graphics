var con = console;

class Idunno {
  constructor(param) {
    con.log("Idunno constructor", param);
  }

}

class Blah extends Idunno {


}

var d = new Idunno("hello");

var e = new Blah("hello 2");