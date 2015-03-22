'use strict';

function attr (attribute, text) {

	if(arguments.length === 1) return get.call(this, attribute);
	if(arguments.length === 2) return set.call(this, attribute, text);

	return this;
}

function set (attribute, text) {
	this.element.setAttribute(attribute, text);
	return this;}

function get (attribute) {
	return this.element.getAttribute(attribute);
}

module.exports = function (engine) {
	engine.injectPlugin('attr', attr);
};
