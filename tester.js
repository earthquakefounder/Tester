/// <reference path="typed/jquery.d.ts" />
var Testing;
(function (Testing) {
    var TesterConfig = (function () {
        function TesterConfig() {
        }
        Object.defineProperty(TesterConfig, "Element", {
            get: function () {
                return this.$element;
            },
            set: function (element) {
                this.$element = $(element);
            },
            enumerable: true,
            configurable: true
        });
        TesterConfig.$element = $('body');
        return TesterConfig;
    })();
    Testing.TesterConfig = TesterConfig;

    function Tester(name, testFn) {
        var _this = this;
        var controller = new TestController(TesterConfig.Element, name, testFn);

        return function () {
            var args = [];
            for (var _i = 0; _i < (arguments.length - 0); _i++) {
                args[_i] = arguments[_i + 0];
            }
            return controller.addTest(_this, args);
        };
    }
    Testing.Tester = Tester;

    var testHtml = [
        '<div class="test container">',
        '<div class="test-name row col-xs-12"></div>',
        '<div class="row test-header col-xs-12">',
        '<div class="test-input col-xs-2">Input</div>',
        '<div class="test-output col-xs-2">Output</div>',
        '<div class="test-result col-xs-8">Result</div>',
        '</div>',
        '</div>'
    ].join(''), resultHtml = [
        '<div class="test-result-container row col-xs-12">',
        '<div class="test-input col-xs-2"></div>',
        '<div class="test-output col-xs-2"></div>',
        '<div class="test-result col-xs-8"></div>',
        '</div>'
    ].join('');

    var TestController = (function () {
        function TestController(appendTo, name, testFn) {
            this.$test = $(testHtml).appendTo(appendTo);
            this.fn = testFn;
            this.$test.find('.test-name').text(name);
        }
        TestController.prototype.addTest = function (context, inputs) {
            var _this = this;
            var result = new Result(this.$test, inputs);

            setTimeout(function () {
                try  {
                    result.result = _this.fn.apply(context || window, inputs);
                } catch (ex) {
                    result.result = ex;
                }
            });
            return result;
        };
        return TestController;
    })();

    var Result = (function () {
        function Result($test, inputs) {
            this._ready = false;
            this._checkStack = [];
            this.$resultContainer = $(resultHtml).appendTo($test);
            this.$input.text(inputs.join(','));
        }
        Object.defineProperty(Result.prototype, "$input", {
            get: function () {
                return this.$resultContainer.find('.test-input');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Result.prototype, "$output", {
            get: function () {
                return this.$resultContainer.find('.test-output');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Result.prototype, "$result", {
            get: function () {
                return this.$resultContainer.find('.test-result');
            },
            enumerable: true,
            configurable: true
        });

        Object.defineProperty(Result.prototype, "result", {
            get: function () {
                return this._r;
            },
            set: function (r) {
                this._r = r;
                this._ready = true;
                this.$output.text(r);

                for (var i = 0; i < this._checkStack.length; i++) {
                    this.check(this._checkStack[i].checker, this._checkStack[i].error);
                }
            },
            enumerable: true,
            configurable: true
        });

        Result.prototype.shouldBe = function (value) {
            var _this = this;
            return this.check(function () {
                return _this.result === value;
            }, function () {
                return 'Expected: ' + value + ' Got: ' + _this.result;
            });
        };

        Result.prototype.shouldBeTrue = function () {
            return this.shouldBe(true);
        };

        Result.prototype.shouldBeFalse = function () {
            return this.shouldBe(false);
        };

        Result.prototype.shouldBeTruthy = function () {
            var _this = this;
            return this.check(function () {
                return !_this.result;
            }, 'Expected a truthy value');
        };

        Result.prototype.shouldBeFalsy = function () {
            var _this = this;
            return this.check(function () {
                return !_this.result;
            }, "Expected a falsy value: '', undefined, null, 0, false, NaN");
        };

        Result.prototype.shouldThrowException = function (text) {
            var _this = this;
            return this.check(function () {
                return _this.result instanceof Array && (!text || _this.result.message === text);
            }, 'Expected a thrown exception');
        };

        Result.prototype.check = function (checker, error) {
            var _this = this;
            var errorFn = typeof error === 'function' ? error : function () {
                return error || 'Failed';
            };

            if (!this._ready) {
                this._checkStack.push({
                    checker: checker,
                    error: errorFn
                });
            } else {
                setTimeout(function () {
                    if (checker()) {
                        _this.$resultContainer.addClass('ok');
                        _this.$result.text('Passed!');
                    } else {
                        _this.$resultContainer.addClass('bad');
                        _this.$result.text(errorFn());
                    }
                }, 0);
            }

            return this;
        };
        return Result;
    })();
    Testing.Result = Result;
})(Testing || (Testing = {}));
