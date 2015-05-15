/// <reference path="typed/jquery.d.ts" />
(function (Testing) {
    var $element = $('body');
    Object.defineProperty(Testing, 'Element', {
        get: function () {
            return $element;
        },
        set: function (element) {
            $element = $(element);
        }
    });

    function Tester(name, testFn) {
        var _this = this;
        var controller = new TestController($element, testFn);

        return function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            controller.addTest(_this, args);
        };
    }
    Testing.Tester = Tester;

    var testHtml = [
        '<div class="test">',
        '<div class="test-name"></div>',
        '<div class="row test-headers">',
        '<div class="test-input">Input</div>',
        '<div class="test-output">Output</div>',
        '<div class="test-result">Result</div>',
        '</div>',
        '</div>'
    ].join(''), resultHtml = [
        '<div class="row test-result">',
        '<div class="test-input"></div>',
        '<div class="test-output"></div>',
        '<div class="test-result"></div>',
        '</div>'
    ].join('');

    var TestController = (function () {
        function TestController(appendTo, testFn) {
            this.$test = $(testHtml).appendTo(appendTo);
            this.fn = testFn;
        }
        TestController.prototype.addTest = function (context) {
            var inputs = [];
            for (var _i = 0; _i < (arguments.length - 1); _i++) {
                inputs[_i] = arguments[_i + 1];
            }
        };
        return TestController;
    })();

    var Result = (function () {
        function Result() {
            this._r = true;
            this._ready = false;
        }
        Object.defineProperty(Result.prototype, "result", {
            get: function () {
                return this._r;
            },
            set: function (r) {
                this._r = r;
                this._ready = true;
            },
            enumerable: true,
            configurable: true
        });

        Result.prototype.shouldBe = function (value) {
            var _this = this;
            return this.check(function () {
                return _this.result === value;
            }, 'Expected: ${value}, Got: ${this.result}');
        };

        Result.prototype.shouldBeTrue = function () {
            return this.shouldBe(true);
        };

        Result.prototype.shouldBeFalse = function () {
            return this.shouldBe(false);
        };

        Result.prototype.shouldBeTruthy = function () {
            return this;
        };

        Result.prototype.shouldBeFalsy = function () {
            return this;
        };

        Result.prototype.shouldThrowException = function (text) {
            return this;
        };

        Result.prototype.check = function (callback, error) {
            if (!this._ready) {
                this._checkStack.push(callback);
            } else {
                setTimeout(function () {
                    if (callback()) {
                    }
                }, 0);
            }

            return this;
        };
        return Result;
    })();
})(exports.Testing || (exports.Testing = {}));
var Testing = exports.Testing;
