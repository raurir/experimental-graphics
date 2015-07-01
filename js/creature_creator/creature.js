var con = console;
var isNode = (typeof module !== 'undefined');

if (isNode) {
	var dom = require('./dom.js');
	var fs = require('fs');
	var creature_creator = require('./creature_creator/creature_creator.js');
}

define(function (require) {

	// var bmp = require('./messages');

// function creature() {

	var experiment = {
		stage: null,
		inner: null,
		resize: function() {},
		init: function() {
			con.log("init");
			con.log(creature_creator);


		},
		kill: function() {}
	}

	// if (!isNode) dispatchEvent(new CustomEvent("load:complete", {detail:experiment}));

	return experiment;

});

// if (isNode) module.exports = creature;