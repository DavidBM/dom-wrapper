'use strict';
var debug = require('debug')('dom-wrapper');

//TODO: Añadir las funciones complementarias (addChild, etc) y crear sistema de plugins.
//Poner solo los atributos necesarios en cada elemento y no todos. Lo mismo con las funciones. El enfoque de copiarlo todo es muy lento.

var HTML_ELEMENTS = require('./htmlElementsTags.js');

var doc;
if(typeof document !== 'undefined')
	doc = document;
else
	doc = {createElement: function(){ debug('No document. Use setDocument for inject a document'); }};

var engine = {};
var plugins = {};

function EngineElement () {}
EngineElement.prototype.debug = debug;
EngineElement.prototype.get = function(){ return this.element; };

//Make all wrappers for tags
for (var i = HTML_ELEMENTS.length - 1; i >= 0; i--) {
	var tagName = HTML_ELEMENTS[i];

	engine[tagName] = createElementWrapper(tagName);
}

function createElementWrapper (tagName) {

	function ElementWrapper (className) {
		if (!(this instanceof ElementWrapper)) return new ElementWrapper();

		this.element = doc.createElement(tagName);

		if(typeof className !== 'undefined')
			this.element.className = className;

		return this;
	}

	ElementWrapper.prototype = Object.create(EngineElement.prototype);
	ElementWrapper.prototype.constructor = ElementWrapper;

	return ElementWrapper;
}

//Core wrapper utilities
engine.setDocument = function (newDocument) {
	doc = newDocument;
};

//Core wrapper utilities
engine.injectPlugin = function (name, injectFunction) {
	if(typeof plugins[name] !== "undefined") return;

	plugins[name] = injectFunction;
	EngineElement.prototype[name] = injectFunction;
};

engine.createTag = function (tagName, postFunction) {
	if(typeof plugins[name] !== "undefined") return;

	var wrapper = createElementWrapper(tagName);

	if(typeof postFunction !== 'function'){
		engine[tagName] = wrapper;
		return wrapper;
	}

	engine[tagName] = function () {
		var result = new wrapper();
		var args = argumentsToArray(arguments);
		args.unshift(doc);
		postFunction.apply(result, args);
		return result;
	};
};

function argumentsToArray (args) {
	var array = [];
	var len = args.length;
	for (var i = 0; i < len; i++) {
		array.push(args[i]);
	}

	return array;
}

module.exports = exports = engine;
