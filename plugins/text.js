'use strict';

function text (textValue) {

	if(arguments.length === 0) return get.call(this);
	if(arguments.length === 1) return set.call(this, textValue);

	return this;
}

function set (textValue) {

	if(this.element.nodeName === '#text'){
		this.element.nodeValue = textValue;
		return this;
	}

	this.element.firstChild.nodeValue = textValue;
	return this;
}

function get (textValue) {
	if(this.element.nodeName === '#text')
		return this.element.nodeValue;

	return this.element.firstChild.nodeValue;
}

module.exports = function (engine) {
	engine.injectPlugin('text', text);
};