# Dom-Wrapper
A DOM Wrapper that adds a facilities for use DOM in JavaScript.

It intents to propose a semi-template interface but near from native DOM adding a few sugars as `addChild()`, or `text()` and returning the engine in every function for chaining methods.

It's a small and powerful core with a plugins system that can extend almost every behaviour.

You can create new HTML tags, new methods and reusable modules with complex templates and logic.

## Installing

`npm install dom-wrapper`

or copy the bundle/dom-wrapper.min.js to your project and then use `window.DomWrapper`

(if you're not using browserify similar tools, you do not know what you're missing: [Why to use browserify?](http://word.bitly.com/post/101360133837/browserify) ).

## A template example

``` javascript

	'use strict';

	var d = require('dom-wrapper');

	var references = {};

	var articles = {
		'HTML Templates': "Html templates are cool!",
		'Dom-Wrapper': "But JavaScript is coolest!"
	};

	document.body.appendChild(
		d.div().add(
			d.h1('css-class').addClass('css-class2').add(
				d.text('My articles').save(references, 'header')
			),
			doArticles()
		).get()
	);

	references.header.text("My favourite articles");

	function doArticles () {
		var dom = [];

		for(var articleName in articles){
			dom.push(
				d.article().add(
					d.h1('article-title').add(d.text(articleName)),
					d.p('article-body').add(d.text(articles[articleName]))
				)
			);
		}
		return dom;
	}

```

## New text tag example

`text.js`

``` javascript

	'use strict';

	function text (document, textValue) {
		this.element = document.createTextNode(textValue);
	}

	module.exports = function (engine) {
		engine.createTag('text', text);
	};

```

`main.js`
``` javascript

	var domWrapper = require('dom-wrapper');
	require('text.js')(domWrapper);

```

The text is in the core plugins, but you can make any behaviour in your tags only adding methods in `this` in your function and saving the resulting dom in `this.elements`.

## New attr method example

In order achieve chaining methods call, every new method is encouraged to return `this`.

The DOM element is accessible via `this.element`


``` javascript

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
		engine.injectPlugin('setAttr', set);
		engine.injectPlugin('getAttr', get);
	};

```

## New simple module example

`simpleForm.js`
``` javascript

	'use strict';

	var d = require('dom-wrapper');

	function form (document, className) {
		this.references = {};

		var dom = d.form('my super form').addClass(className).add(
			d.button().save(this.references, 'button').add(d.text('Clic it!'))
		).get();

		this.element = dom;

		attachEvent.call(this);

		return this;
	}

	function attachEvent () {
		this.references.button.get().addEventListener('click', function () {
			alert('You clicked it!');
		});
	}


	module.exports = function (engine) {
		engine.createTag('simpleForm', form);
	};

```

And then:

`main.js`
``` javascript

	var domWrapper = require('dom-wrapper');
	require('simpleForm.js')(domWrapper);

```

## Specifying a different document variable

In the browser you can use `document` for creating `DOM`. In node or other engines you do not have a `document` variable globally accesible.

You can use `setDocument()` for suply a alternative implementor of DOM interface.

``` javascript

	'use strict';

	var document = require('my-document-implementor');
	var d = require('dom-wrapper').setDocument(document);

```

## Using tags directly as functions without dot `.` operator.

JavaScript has the `with` statement. Let's be clear: __It's dangeorus and can prevent the engine to make certain optimizations.__

Nevertheless, there is a few cases when the `with` statement is justified. In a template system where HTML tags are mapped with functions in an object, I found that the `with` statement can be helpful.

_Note: The `with` statement is forbidden with `'use strict'`._

``` javascript

	var d = require('dom-wrapper')

	var dom;

	with(d){
		dom = div().add(
			h1().text('My articles'),
			a().text('My link').attr('href', 'www.mywebsite.com')
			article().add(
				p().text('Hello world!'),
				p().text('¿Where is defined the p function?')
			)
		).get();
	}

```

## Roadmap

 - Use getters for save from use parentheses
