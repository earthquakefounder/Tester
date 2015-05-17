/// <reference path="typed/jquery.d.ts" />

module Testing {
	export class TesterConfig {
		private static $element: JQuery = $('body');
		static get Element(): JQuery { return this.$element; }
		static set Element(element: JQuery) { this.$element = $(element); }
	}
	
	export interface IResultChecker {
		shouldBe: (value: any) => IResultChecker;
		shouldBeTrue: () => IResultChecker;
		shouldBeFalse: () => IResultChecker;
		shouldBeTruthy: () => IResultChecker;
		shouldBeFalsy: () => IResultChecker;
		shouldThrowException: (text? : string) => IResultChecker;
	}
	
	export function Tester(name: string, testFn: (...args : any[]) => any) {
		var controller = new TestController(TesterConfig.Element, name, testFn);
		
		return (...args : any[]) => {
			return controller.addTest(this, args);
		};
	}
	
	var testHtml = [
		'<div class="test container">',
			'<div class="test-name row col-xs-12"></div>',
			'<div class="row test-header col-xs-12">',
				'<div class="test-input col-xs-2">Input</div>',
				'<div class="test-output col-xs-2">Output</div>',
				'<div class="test-result col-xs-8">Result</div>',
			'</div>',
		'</div>'
	].join(''),
	resultHtml = [
		'<div class="test-result-container row col-xs-12">',
			'<div class="test-input col-xs-2"></div>',
			'<div class="test-output col-xs-2"></div>',
			'<div class="test-result col-xs-8"></div>',
		'</div>'
	].join('');
	
	class TestController {
		private $test: JQuery;
		private fn: (...args: any[]) => any;
		
		constructor(appendTo: JQuery, name: string, testFn: (...args: any[]) => any) {
			this.$test = $(testHtml).appendTo(appendTo);
			this.fn = testFn;
			this.$test.find('.test-name').text(name);
		}
		
		addTest(context: any, inputs: any[]) {
			var result = new Result(this.$test, inputs);
			
			setTimeout(() => {
				result.result = this.fn.apply(context || window, inputs);
			})
			return result;
		}
	}
		
	export class Result implements IResultChecker {
		private _r: any;
		private _ready: boolean = false;
		private _checkStack: Array<{checker: () => boolean; error: () => string}> = [];
		private $resultContainer: JQuery;
		
		private get $input():JQuery { return this.$resultContainer.find('.test-input'); }
		private get $output():JQuery { return this.$resultContainer.find('.test-output'); }
		private get $result():JQuery { return this.$resultContainer.find('.test-result'); }
		
		constructor($test: JQuery, inputs: any[]) {
			this.$resultContainer = $(resultHtml).appendTo($test);
			this.$input.text(inputs.join(','));
		}
		
		get result(): any {
			return this._r;
		}
		set result(r) {
			this._r = r;
			this._ready = true;
			this.$output.text(r);
			
			for(var i = 0; i < this._checkStack.length; i++) {
				this.check(this._checkStack[i].checker, this._checkStack[i].error);
			}
		}
		
		shouldBe(value: any) {
			return this.check(() => { 
				return this.result === value;
			}, () => { return 'Expected: ' + value + ' Got: ' + this.result; });
		}
		
		shouldBeTrue() {
			return this.shouldBe(true);
		}
		
		shouldBeFalse() {
			return this.shouldBe(false);
		}
		
		shouldBeTruthy() {
			return this.check(() => {
				return !this.result;
			}, 'Expected a truthy value')
		}
		
		shouldBeFalsy() {
			return this.check(() => {
				return !this.result;
			}, "Expected a falsy value: '', undefined, null, 0, false, NaN");
		}
		
		shouldThrowException(text? : string) {
			return this.check(() => {
				return this.result instanceof Array && (!text || this.result.message === text);
			}, 'Expected a thrown exception');
		}
		
		private check(checker: () => boolean, error?: string);
		private check(checker:() => boolean, error?: () => string);
		
		private check(checker: () => boolean, error?: any) {
			var errorFn = typeof error === 'function'
				? error
				: () => { return error || 'Failed'; };
				
			if(!this._ready) {
				this._checkStack.push({
					checker: checker,
					error: errorFn
				});
			} else {
				setTimeout(() => {
					if(checker()) {
						this.$resultContainer.addClass('ok');
						this.$result.text('Passed!');
					} else {
						this.$resultContainer.addClass('bad');
						this.$result.text(errorFn());
					}
				}, 0);
			}
			
			return this;
		}
	}
}