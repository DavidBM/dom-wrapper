'use strict';
(function () {

	var engine = require('./dom-wrapper.js');

	require('./plugins/add.js')(engine);
	require('./plugins/attr.js')(engine);
	require('./plugins/class.js')(engine);
	require('./plugins/remove.js')(engine);
	require('./plugins/events.js')(engine);
	require('./plugins/style.js')(engine);
	require('./plugins/text.js')(engine);
	require('./plugins/utils.js')(engine);
	require('./tags/text.js')(engine);
	require('./tags/fragment.js')(engine);


	if(typeof module !== 'undefined' && module.exports){
		module.exports = exports = engine;
	}else if(typeof window !== 'undefined'){
		window.DomWrapper = engine;
	}
})();
