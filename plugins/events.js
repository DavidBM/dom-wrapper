'use strict';

function addEvent (type, callback, bubbling) {
	this.element.addEventListener(type, callback, bubbling);

	return this;
}

module.exports = function (engine) {
	engine.injectPlugin('event', addEvent);
};
