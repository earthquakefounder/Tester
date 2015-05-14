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
	
	export interface IShouldable {
		shouldBe: function(...args: any[])
	}
	export function Tester(testFn: (...args : any[]) => any) {
		
	}
}