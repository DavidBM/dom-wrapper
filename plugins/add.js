'use strict';

function add () {
	if(arguments.length === 0) return this;

	try{
		var len = arguments.length;
		for (var i = 0; i < len; i++) {
			inserElement(this.element, arguments[i]);
		}
	}catch(e){
		this.debug(e);
	}

	return this;
}

function inserElement (parent, child) {
	if(!child || !parent) return;

	if(Object.prototype.toString.call(child) === "[object Array]"){
		insertArray(parent, child);
	}else{
		parent.appendChild(child.get());
	}
}

function insertArray (parent, array) {
	var i, len;

	var frag = document.createDocumentFragment();

	len = array.length;

	for (i = 0; i < len; i++) {
		if(Object.prototype.toString.call(array[i]) === "[object Array]")
			insertArray(parent, array[i]);
		else if(array[i])
			frag.appendChild(array[i].get());
	}

	parent.appendChild(frag);
}

module.exports = function (engine) {
	engine.injectPlugin('add', add);
};
