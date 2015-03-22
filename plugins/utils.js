'use strict';

function variable (varName, param) {

	if(arguments.length === 1) return get.call(this, varName);
	if(arguments.length === 2) return set.call(this, varName, param);

	return this;
}

function set (varName, param) {
	this[varName] = param;
	return this;
}

function get (varName) {
	return this[varName];
}

function save (obj, name) {
	if(arguments.length > 0 && obj !== null)
		obj[name] = this;

	return this;
}

module.exports = function (engine) {
	engine.injectPlugin('var', variable);
	engine.injectPlugin('save', save);
};
