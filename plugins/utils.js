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

function getOffset() {
	var el = this.element;
	var x = 0;
	var y = 0;
	while( el && !isNaN( el.offsetLeft ) && !isNaN( el.offsetTop ) ) {
		x += el.offsetLeft - el.scrollLeft;
		y += el.offsetTop - el.scrollTop;
		el = el.offsetParent;
	}
	return { top: y, left: x };
}

module.exports = function (engine) {
	engine.injectPlugin('offset', getOffset);
	engine.injectPlugin('var', variable);
	engine.injectPlugin('save', save);
};
