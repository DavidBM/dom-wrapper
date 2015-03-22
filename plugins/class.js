'use strict';

function clas (text) {
	if(arguments <= 0) return get.call(this);
	else return set.call(this, text);
}

function set (text) {
	this.element.className = text;
	return this;
}

function get () {
	return this.element.className;
}

function add () {
	this.element.add.apply(this.element, arguments);
	return this;
}

function remove () {
	this.element.remove.apply(this.element, arguments);
	return this;
}

function toggle () {
	this.element.toggle.apply(this.element, arguments);
	return this;
}

function contains () {
	return this.element.contains.apply(this.element, arguments);
}


module.exports = function (engine) {
	engine.injectPlugin('class', clas);
	engine.injectPlugin('addClass', add);
	engine.injectPlugin('removeClass', remove);
	engine.injectPlugin('toggleClass', toggle);
	engine.injectPlugin('containsClass', contains);
};