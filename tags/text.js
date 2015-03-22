'use strict';

function text (doc, textValue) {
	this.element = doc.createTextNode(textValue);
}

module.exports = function (engine) {
	engine.createTag('text', text);
};
