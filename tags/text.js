'use strict';

function text (document, textValue) {
	this.element = document.createTextNode(textValue);
}

module.exports = function (engine) {
	engine.createTag('text', text);
};
