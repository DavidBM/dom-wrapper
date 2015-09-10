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
	var args = checkArguments(arguments);
	if(args.length <= 0) return this;

	this.element.classList.add.apply(this.element.classList, args);
	return this;
}

function remove () {
	var args = checkArguments(arguments);
	if(args.length <= 0) return this;

	this.element.classList.remove.apply(this.element.classList, args);
	return this;
}

function toggle () {
	var args = checkArguments(arguments);
	if(args.length <= 0) return this;

	this.element.classList.toggle.apply(this.element.classList, args);
	return this;
}

function contains () {
	var args = checkArguments(arguments);
	if(args.length <= 0) return this;

	return this.element.classList.contains.apply(this.element.classList, args);
}

function checkArguments (args) {
	var result = [];
	if(args.length <= 0) return result;

	for (var i = args.length - 1; i >= 0; i--) {
		if(args[i]) result.push(args[i]);
	}

	return result;
}


module.exports = function (engine) {
	engine.injectPlugin('class', clas);
	engine.injectPlugin('addClass', add);
	engine.injectPlugin('removeClass', remove);
	engine.injectPlugin('toggleClass', toggle);
	engine.injectPlugin('containsClass', contains);
};
