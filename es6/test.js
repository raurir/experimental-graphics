var con = console;

class Idunno {
  constructor(param) {
    con.log("Idunno constructor", param);
  }
  render () {
  	con.log("original render");
  }
}

class Blah extends Idunno {
	render() {
		console.log('ok')
	}
	kill() {
		con.log("kill");
	}

}

var d = new Idunno("hello");

var e = new Blah("hello 2");
e.render();