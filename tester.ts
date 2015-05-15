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
	
	export interface IResultChecker {
		shouldBe: (value: any) => IResultChecker;
		shouldBeTrue: () => IResultChecker;
		shouldBeFalse: () => IResultChecker;
		shouldBeTruthy: () => IResultChecker;
		shouldBeFalsy: () => IResultChecker;
		shouldThrowException: (text? : string) => IResultChecker;
	}
	
	export function Tester(name: string, testFn: (...args : any[]) => any) {
		var controller = new TestController($element, testFn);
		
		return (...args : any[]) => {
			controller.addTest(this, args);
		};
	}
	
	var testHtml = [
		'<div class="test">',
			'<div class="test-name"></div>',
			'<div class="row test-headers">',
				'<div class="test-input">Input</div>',
				'<div class="test-output">Output</div>',
				'<div class="test-result">Result</div>',
			'</div>',
		'</div>'
	].join(''),
	resultHtml = [
		'<div class="row test-result">',
			'<div class="test-input"></div>',
			'<div class="test-output"></div>',
			'<div class="test-result"></div>',
		'</div>'
	].join('');
	
	class TestController {
		private $test: JQuery;
		private fn: (...args: any[]) => any;
		
		constructor(appendTo: JQuery, testFn: (...args: any[]) => any) {
			this.$test = $(testHtml).appendTo(appendTo);
			this.fn = testFn;
		}
		
		addTest(context: any, ...inputs: any[]) {
			
		}
	}
	
	class Result implements IResultChecker {
		private _r: any = true;
		private _ready: boolean = false;
		private _checkStack: Array<{callback: () => boolean, error?: string}>;
		
		get result(): any {
			return this._r;
		}
		set result(r) {
			this._r = r;
			this._ready = true;
			
			for(var i = 0; i < this._checkStack.length; i++) {
				this.check(this._checkStack[i].callback, this._checkStack[i].error);
			}
		}
		
		shouldBe(value: any) {
			return this.check(() => { 
				return this.result === value;
			}, 'Expected: ' + value + ' Got: ' + this.result);
		}
		
		shouldBeTrue() {
			return this.shouldBe(true);
		}
		
		shouldBeFalse() {
			return this.shouldBe(false);
		}
		
		shouldBeTruthy() {
			return this;
		}
		
		shouldBeFalsy() {
			return this;
		}
		
		shouldThrowException(text? : string) {
			return this;	
		}
		
		private check(callback: () => boolean, error?: string) {
			if(!this._ready) {
				this._checkStack.push({
					callback: callback,
					error: error
				});
			} else {
				setTimeout(() => {
					if(callback()) {
						
					} 
				}, 0);
			}
			
			return this;
		}
	}
}