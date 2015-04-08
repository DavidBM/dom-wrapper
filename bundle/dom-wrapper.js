(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';
(function () {

	var engine = require('./dom-wrapper.js');

	require('./plugins/add.js')(engine);
	require('./plugins/attr.js')(engine);
	require('./plugins/class.js')(engine);
	require('./plugins/remove.js')(engine);
	require('./plugins/style.js')(engine);
	require('./plugins/text.js')(engine);
	require('./plugins/utils.js')(engine);
	require('./tags/text.js')(engine);


	if(typeof module !== 'undefined' && module.exports){
		module.exports = exports = engine;
	}else if(typeof window !== 'undefined'){
		window.DomWrapper = engine;
	}
})();

},{"./dom-wrapper.js":2,"./plugins/add.js":7,"./plugins/attr.js":8,"./plugins/class.js":9,"./plugins/remove.js":10,"./plugins/style.js":11,"./plugins/text.js":12,"./plugins/utils.js":13,"./tags/text.js":14}],2:[function(require,module,exports){
'use strict';
var debug = require('debug')('dom-wrapper');

var HTML_ELEMENTS = require('./htmlElementsTags.js');

var doc;
if(typeof document !== 'undefined')
	doc = document;
else
	doc = {createElement: function(){ debug('No document. Use setDocument for inject a document'); }};

var engine = {};
var plugins = {};

//Make all wrappers for tags
for (var i = HTML_ELEMENTS.length - 1; i >= 0; i--) {
	var tagName = HTML_ELEMENTS[i];

	engine[tagName] = createElementWrapper(tagName);
}

function EngineElement () {}
EngineElement.prototype.debug = debug;
EngineElement.prototype.get = function(){ return this.element; };

function createElementWrapper (tagName) {

	function ElementWrapper (className) {
		if (!(this instanceof ElementWrapper)) return new ElementWrapper(className);

		this.element = doc.createElement(tagName);

		if(typeof className !== 'undefined')
			this.element.className = className;

		return this;
	}

	ElementWrapper.prototype = Object.create(EngineElement.prototype);
	ElementWrapper.prototype.constructor = ElementWrapper;

	return ElementWrapper;
}

//Core wrapper utilities
engine.setDocument = function (newDocument) {
	doc = newDocument;
};

engine.injectPlugin = function (name, injectFunction) {
	if(typeof plugins[name] !== "undefined") return;

	plugins[name] = injectFunction;
	EngineElement.prototype[name] = injectFunction;
};

engine.createTag = function (tagName, postFunction) {
	if(typeof plugins[name] !== "undefined") return;

	var wrapper = createElementWrapper(tagName);

	if(typeof postFunction !== 'function'){
		engine[tagName] = wrapper;
		return wrapper;
	}

	engine[tagName] = function () {
		var result = new wrapper();
		var args = argumentsToArray(arguments);
		args.unshift(doc);
		postFunction.apply(result, args);
		return result;
	};
};

function argumentsToArray (args) {
	var array = [];
	var len = args.length;
	for (var i = 0; i < len; i++) {
		array.push(args[i]);
	}

	return array;
}

module.exports = exports = engine;

},{"./htmlElementsTags.js":3,"debug":4}],3:[function(require,module,exports){
module.exports = exports = ['a', 'abbr', 'acronym', 'address', 'applet', 'area', 'article', 'aside', 'audio', 'b', 'base', 'basefont', 'bdi', 'bdo', 'bgsound', 'big', 'blink', 'blockquote', 'body', 'br', 'button', 'canvas', 'caption', 'center', 'cite', 'code', 'col', 'colgroup', 'command', 'content', 'data', 'datalist', 'dd', 'del', 'details', 'dfn', 'dialog', 'dir', 'div', 'dl', 'dt', 'element', 'em', 'embed', 'fieldset', 'figcaption', 'figure', 'font', 'footer', 'form', 'frame', 'frameset', 'head', 'header', 'hgroup', 'hr', 'html', 'i', 'iframe', 'image', 'img', 'input', 'ins', 'isindex', 'kbd', 'keygen', 'label', 'legend', 'li', 'link', 'listing', 'main', 'map', 'mark', 'marquee', 'menu', 'menuitem', 'meta', 'meter', 'multicol', 'nav', 'nobr', 'noembed', 'noframes', 'noscript', 'object', 'ol', 'optgroup', 'option', 'output', 'p', 'param', 'picture', 'plaintext', 'pre', 'progress', 'q', 'rp', 'rt', 'rtc', 'ruby', 's', 'samp', 'script', 'section', 'select', 'shadow', 'small', 'source', 'spacer', 'span', 'strike', 'strong', 'style', 'sub', 'summary', 'sup', 'table', 'tbody', 'td', 'template', 'textarea', 'tfoot', 'th', 'thead', 'time', 'title', 'tr', 'track', 'tt', 'u', 'ul', 'var', 'video', 'wbr', 'xmp', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

},{}],4:[function(require,module,exports){

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = require('./debug');
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Use chrome.storage.local if we are in an app
 */

var storage;

if (typeof chrome !== 'undefined' && typeof chrome.storage !== 'undefined')
  storage = chrome.storage.local;
else
  storage = localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // is webkit? http://stackoverflow.com/a/16459606/376773
  return ('WebkitAppearance' in document.documentElement.style) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (window.console && (console.firebug || (console.exception && console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31);
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  return JSON.stringify(v);
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs() {
  var args = arguments;
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return args;

  var c = 'color: ' + this.color;
  args = [args[0], c, 'color: inherit'].concat(Array.prototype.slice.call(args, 1));

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
  return args;
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      storage.removeItem('debug');
    } else {
      storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = storage.debug;
  } catch(e) {}
  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage(){
  try {
    return window.localStorage;
  } catch (e) {}
}

},{"./debug":5}],5:[function(require,module,exports){

/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = debug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = require('ms');

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lowercased letter, i.e. "n".
 */

exports.formatters = {};

/**
 * Previously assigned color.
 */

var prevColor = 0;

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 *
 * @return {Number}
 * @api private
 */

function selectColor() {
  return exports.colors[prevColor++ % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function debug(namespace) {

  // define the `disabled` version
  function disabled() {
  }
  disabled.enabled = false;

  // define the `enabled` version
  function enabled() {

    var self = enabled;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // add the `color` if not set
    if (null == self.useColors) self.useColors = exports.useColors();
    if (null == self.color && self.useColors) self.color = selectColor();

    var args = Array.prototype.slice.call(arguments);

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %o
      args = ['%o'].concat(args);
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    if ('function' === typeof exports.formatArgs) {
      args = exports.formatArgs.apply(self, args);
    }
    var logFn = enabled.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }
  enabled.enabled = true;

  var fn = exports.enabled(namespace) ? enabled : disabled;

  fn.namespace = namespace;

  return fn;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  var split = (namespaces || '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}

},{"ms":6}],6:[function(require,module,exports){
/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} options
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options){
  options = options || {};
  if ('string' == typeof val) return parse(val);
  return options.long
    ? long(val)
    : short(val);
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(str);
  if (!match) return;
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function short(ms) {
  if (ms >= d) return Math.round(ms / d) + 'd';
  if (ms >= h) return Math.round(ms / h) + 'h';
  if (ms >= m) return Math.round(ms / m) + 'm';
  if (ms >= s) return Math.round(ms / s) + 's';
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function long(ms) {
  return plural(ms, d, 'day')
    || plural(ms, h, 'hour')
    || plural(ms, m, 'minute')
    || plural(ms, s, 'second')
    || ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) return;
  if (ms < n * 1.5) return Math.floor(ms / n) + ' ' + name;
  return Math.ceil(ms / n) + ' ' + name + 's';
}

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
'use strict';

function attr (attribute, text) {

	if(arguments.length === 1) return get.call(this, attribute);
	if(arguments.length === 2) return set.call(this, attribute, text);

	return this;
}

function set (attribute, text) {
	this.element.setAttribute(attribute, text);
	return this;}

function get (attribute) {
	return this.element.getAttribute(attribute);
}

module.exports = function (engine) {
	engine.injectPlugin('attr', attr);
};

},{}],9:[function(require,module,exports){
'use strict';

function clas (text) {
	if(arguments <= 0) return get.call(this);
	else return set.call(this, text);
}

function set (text) {
	this.element.className = text;
	return this;
}

function get () {
	return this.element.className;
}

function add () {
	this.element.classList.add.apply(this.element.classList, arguments);
	return this;
}

function remove () {
	this.element.classList.remove.apply(this.element.classList, arguments);
	return this;
}

function toggle () {
	this.element.classList.toggle.apply(this.element.classList, arguments);
	return this;
}

function contains () {
	return this.element.classList.contains.apply(this.element.classList, arguments);
}


module.exports = function (engine) {
	engine.injectPlugin('class', clas);
	engine.injectPlugin('addClass', add);
	engine.injectPlugin('removeClass', remove);
	engine.injectPlugin('toggleClass', toggle);
	engine.injectPlugin('containsClass', contains);
};

},{}],10:[function(require,module,exports){
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

},{}],11:[function(require,module,exports){
'use strict';

function style (name, rule) {
	if(arguments.length === 0) return this.element.style;
	if(arguments.length === 1) return get.call(this, name);
	else return set.call(this, name, rule);
}

function set (name, rule) {
	this.element.style[name] = rule;
	return this;
}

function get (name) {
	return this.element.style[name];
}

module.exports = function (engine) {
	engine.injectPlugin('style', style);
};

},{}],12:[function(require,module,exports){
'use strict';

function text (textValue) {

	if(arguments.length === 0) return get.call(this);
	if(arguments.length === 1) return set.call(this, textValue);

	return this;
}

function set (textValue) {

	if(this.element.nodeName === '#text'){
		this.element.nodeValue = textValue;
		return this;
	}

	this.element.firstChild.nodeValue = textValue;
	return this;
}

function get (textValue) {
	if(this.element.nodeName === '#text')
		return this.element.nodeValue;

	return this.element.firstChild.nodeValue;
}

module.exports = function (engine) {
	engine.injectPlugin('text', text);
};

},{}],13:[function(require,module,exports){
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

module.exports = function (engine) {
	engine.injectPlugin('var', variable);
	engine.injectPlugin('save', save);
};

},{}],14:[function(require,module,exports){
'use strict';

function text (doc, textValue) {
	this.element = doc.createTextNode(textValue);
}

module.exports = function (engine) {
	engine.createTag('text', text);
};

},{}]},{},[1]);
