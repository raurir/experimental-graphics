const dom = require("../src/dom.js");

describe("dom", () => {
	describe("setProps", () => {
		it("should call setProps correctly", (done) => {
			expect(dom.setProps({}, {test: 1})).toEqual({test: 1});
			expect(dom.setProps({}, {name: "nyname"})).toEqual({name: "nyname"});
			expect(dom.setProps({}, {id: "eleid"})).toEqual({id: "eleid"});
			expect(dom.setProps({style: {}}, {style: {width: 20, height: 30}})).toEqual({style: {width: 20, height: 30}});
			done();
		});
	});
});
