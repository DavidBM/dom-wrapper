(function () {
	'use strict';

	//TODO: Añadir las funciones complementarias (addChild, etc) y crear sistema de plugins. Poner solo los atributos necesarios en cada elemento y no todos.

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
		}
	}

	function createElementWrapper (functions, attributes, tagName, wrappers) {
		var existentTagFunction = checkIfExist(functions, attributes, wrappers);

		function ElementWrapper () {
			if (!(this instanceof ElementWrapper)) return new ElementWrapper();

			this.element = document.createElement(tagName);

			for (var j = attributes.length - 1; j >= 0; j--) {
				var attrName = attributes[j];

				setAttributeFunction(this, attrName, tagName);
			}

			return this;
		}

		if(existentTagFunction !== false) {
			ElementWrapper.prototype = Object.create(existentTagFunction.prototype);
			ElementWrapper.prototype.contructor = ElementWrapper;
		}else{
			for (var i = functions.length - 1; i >= 0; i--) {
				var functionName = functions[i];

				ElementWrapper.prototype[functionName] = getFunction(functionName);
			}

			wrappers.push({
				functions: functions,
				attributes: attributes,
				tagFunction: ElementWrapper
			});
		}

		return ElementWrapper;
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
		if(typeof CACHED_ATTRIBUTE_FUNCTIONS[attrName] !== 'undefined') {
			return Object.defineProperty(obj, attrName, CACHED_ATTRIBUTE_FUNCTIONS[attrName]);
		}

		var descriptor = Object.getOwnPropertyDescriptor(CACHED_ELEMENTS[tagName], attrName);

		if(typeof descriptor === 'undefined') descriptor = {
			enumerable: true
		};

		descriptor.get = function () {
			return this.element[attrName];
		};

		descriptor.set = function (data) {
			this.element[attrName] = data;
		};

		Object.defineProperty(obj, attrName, descriptor);

		CACHED_ATTRIBUTE_FUNCTIONS[attrName] = descriptor;
	}

	function checkIfExist (functions, attributes, wrappers) {
		for (var i = wrappers.length - 1; i >= 0; i--) {
			var wrapper = wrappers[i];

			if(arrayEquals(wrapper.functions, functions) && arrayEquals(wrapper.functions, functions))
				return wrapper.tagFunction;
		}

		return false;
	}

	CACHED_FUNCTIONS = {};
	CACHED_ELEMENTS = createAllElements();
	CACHED_ATTRIBUTE_FUNCTIONS = {};

	createTags();

	HTML_ELEMENTS = null;
	CACHED_FUNCTIONS = null;
	//We don't clean CACHED_ATTRIBUTE_FUNCTIONS and CACHED_ELEMENTS because we use it in the contructor for the attributes.

	if(typeof module !== 'undefined' && module.exports){
		module.exports = exports = TAGS;
	}else if(typeof window !== 'undefined'){
		window.DomWrapper = function () {
			return TAGS;
		};
	}
})();

