'use strict';

function style (name, rule) {
	if(arguments.length === 0) return this.element.style;
	if(arguments.length === 1) return get.call(this, name);
	else return set.call(this, name, rule);
}

function set (name, rule) {
	this.element.style[name] = rule;
	return this;
}

function get (name) {
	return this.element.style[name];
}

module.exports = function (engine) {
	engine.injectPlugin('style', style);
};
