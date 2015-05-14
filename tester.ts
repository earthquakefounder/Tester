/// <reference path="typed/jquery.d.ts" />

export module Testing {
	var $element : JQuery = $('body');
	Object.defineProperty(Testing, 'Element', {
		get: function() {
			return $element;
		}, 
		set: function(element : any) {
			$element = $(element);
		}
	})
	
	export class Tester {
		constructor(testFn: (...args : any[]) => any) {
			
		}
	}
}