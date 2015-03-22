'use strict';
(function () {

	var engine = require('./dom-wrapper.js');

	require('./plugins/add.js')(engine);
	require('./plugins/class.js')(engine);


	if(typeof module !== 'undefined' && module.exports){
		module.exports = exports = engine;
	}else if(typeof window !== 'undefined'){
		window.DomWrapper = engine;
	}
})();
