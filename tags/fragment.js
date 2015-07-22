'use strict';

function fragment (document) {
	this.element = document.createDocumentFragment();
}

module.exports = function (engine) {
	engine.createTag('fragment', fragment);
};
