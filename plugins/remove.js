'use strict';

function remove (child) {
	if(arguments.length <= 0) return this;

	if(Object.prototype.toString.call(child) === "[object Array]"){
		var len = child.length;
		for (var i = 0; i < len; i++) {
			remove.call(this, child[i]);
		}
	}else{
		if(typeof child.get !== 'undefined')
			child = child.get();

		this.element.removeChild(child);
	}

	return this;
}

module.exports = function (engine) {
	engine.injectPlugin('remove', remove);
};
