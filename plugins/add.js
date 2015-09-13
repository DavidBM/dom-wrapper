'use strict';

function add () {
	if(arguments.length === 0) return this;

	try{
		var len = arguments.length;
		for (var i = 0; i < len; i++) {
			inserElement(this.element, arguments[i], false);
		}
	}catch(e){
		this.debug(e);
	}

	return this;
}

function prepend () {
	if(arguments.length === 0) return this;

	try{
		var len = arguments.length;
		for (var i = 0; i < len; i++) {
			inserElement(this.element, arguments[i], true);
		}
	}catch(e){
		this.debug(e);
	}

	return this;
}

function inserElement (parent, child, prepend) {
	if(!child || !parent) return;

	if(Object.prototype.toString.call(child) === "[object Array]"){
		insertArray(parent, child, prepend);
	}else if(child instanceof HTMLElement || child instanceof DocumentFragment){ //TODO, is using the global object. Find a way to detect DOM element without using global context.
		insertElementDom(parent, child, prepend);
	}else{
		insertElementDom(parent, child.get(), prepend);
	}
}

function insertArray (parent, array, prepend) {
	var i, len;

	var frag = document.createDocumentFragment();

	len = array.length;

	for (i = 0; i < len; i++) {
		if(Object.prototype.toString.call(array[i]) === "[object Array]"){
			insertArray(parent, array[i], prepend);

		}else if(array[i] instanceof HTMLElement){ //TODO, is using the global object. Find a way to detect DOM element without using global context.
			insertElementDom(frag, array[i], prepend);

		}else if(array[i])
			insertElementDom(frag, array[i].get(), prepend);
	}

	parent.appendChild(frag);
}

function insertElementDom (parent, child, prepend) {
	var firstChild = parent.firstChild;

	if(!prepend || !firstChild)
		return parent.appendChild(child);

	return prepend.insertBefore(child, firstChild);
}

module.exports = function (engine) {
	engine.injectPlugin('add', add);
	engine.injectPlugin('prepend', prepend);
};
