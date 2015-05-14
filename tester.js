/// <reference path="typed/jquery.d.ts" />
var Testing;
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
    var Tester = (function () {
        function Tester(testFn) {
        }
        return Tester;
    })();
    Testing.Tester = Tester;
})(Testing = exports.Testing || (exports.Testing = {}));
