(function () {
	'use strinct';

	//TODO: Añadir las funciones complementarias (addChild, etc) y crear sistema de plugins.

	var HTML_ELEMENTS = require('./htmlElementsTags.js');
	var arrayEquals = require('./arrayEquals.js');

	var TAGS = {};

	var CACHED_FUNCTIONS;
	var CACHED_ATTRIBUTE_FUNCTIONS;
	var CACHED_ELEMENTS;

	function createAllElements () {
		var cachedElements = {};
		for (var i = HTML_ELEMENTS.length - 1; i >= 0; i--) {
			var tagName = HTML_ELEMENTS[i];
			cachedElements[tagName] = document.createElement(tagName);
		}

		return cachedElements;
	}

	function createTags () {

		var wrappers = [];

		for (var i = HTML_ELEMENTS.length - 1; i >= 0; i--) {
			var tagName = HTML_ELEMENTS[i];
			var functions = [];
			var attributes = [];

			var element = CACHED_ELEMENTS[tagName];

			for(var key in element){
				if(typeof element[key] === 'function') functions.push(key);
				else attributes.push(key);
			}

			TAGS[tagName] = createElementWrapper(functions, attributes, tagName, wrappers);

			wrappers.push({
				functions: functions,
				attributes: attributes,
				tagName: tagName
			});
		}
	}

	function createElementWrapper (functions, attributes, tagName, wrappers) {
		var existentTagName = checkIfExist(functions, attributes, wrappers);

		if(existentTagName !== false) return TAGS[existentTagName];

		var obj = function ElementWrapper () {
			if (!(this instanceof ElementWrapper)) return new ElementWrapper();

			this.element = document.createElement(tagName);

			for (var j = attributes.length - 1; j >= 0; j--) {
				var attrName = attributes[j];

				setAttributeFunction(this, attrName, tagName);
			}

			return this;
		};

		for (var i = functions.length - 1; i >= 0; i--) {
			var functionName = functions[i];

			obj.prototype[functionName] = getFunction(functionName);
		}

		return obj;
	}

	function getFunction (functionName) {
		if(typeof CACHED_FUNCTIONS[functionName] === 'function') return CACHED_FUNCTIONS[functionName];

		var fn = function () {
			this.element[functionName].apply(this.element, arguments);
		};

		CACHED_FUNCTIONS[functionName] = fn;

		return fn;
	}

	function setAttributeFunction (obj, attrName, tagName) {
		if(typeof CACHED_ATTRIBUTE_FUNCTIONS[attrName] === 'function') return CACHED_ATTRIBUTE_FUNCTIONS[attrName];

		var descriptor = Object.getOwnPropertyDescriptor(CACHED_ELEMENTS[tagName], attrName);

		descriptor.get = function () {
			return this.element[attrName];
		};

		descriptor.set = function (data) {
			this.element[attrName] = data;
		};

		Object.defineProperty(obj, attrName, descriptor);

		CACHED_ATTRIBUTE_FUNCTIONS[attrName] = fn;

		return fn;
	}

	function checkIfExist (functions, attributes, wrappers) {
		for (var i = wrappers.length - 1; i >= 0; i--) {
			wrapper = wrappers[i];

			if(arrayEquals(wrapper.functions, functions) && arrayEquals(wrapper.functions, functions))
				return wrapper.tagName;
		}

		return false;
	}

	CACHED_FUNCTIONS = {};
	CACHED_ELEMENTS = createAllElements();
	CACHED_ATTRIBUTE_FUNCTIONS = {};

	createTags();

	HTML_ELEMENTS = null;
	CACHED_FUNCTIONS = null;
	CACHED_ELEMENTS = null;
	//We don't clean CACHED_ATTRIBUTE_FUNCTIONS because we use it in the contructor for the attributes.

	if(typeof module !== 'undefined' && module.exports){
		module.exports = exports = TAGS;
	}else if(typeof window !== 'undefined'){
		window.DomWrapper = function () {
			return TAGS;
		};
	}
})();

