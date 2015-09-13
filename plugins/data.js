'use strict';

function data (key, value) {

	ensureDataStorage(this);

	if(arguments.length === 2) return set.call(this, key, value);
	if(arguments.length === 1) return get.call(this, key);

	return this;
}

function set (key, value) {
	this._dataStorage[key] = value;
	return this;
}

function get (key) {
	return this._dataStorage[key];
}

function ensureDataStorage (obj) {
	if(typeof obj._dataStorage === 'undefined')
		obj._dataStorage = {};
}

module.exports = function (engine) {
	engine.injectPlugin('data', data);
};
