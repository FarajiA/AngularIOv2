; (function () {
    angular.module('main').directive('pwCheck', [function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var me = attrs.ngModel;
                var matchTo = attrs.pwCheck;

                scope.$watchGroup([me, matchTo], function (value) {
                    ctrl.$setValidity('pwmatch', value[0] === value[1]);
                });
            }
        }
    }]);
    
    angular.module('main').directive('usernameValidate', ['Registration', function (Registration) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var me = attrs.ngModel;
                var min = attrs.ngMinlength;

                scope.$watch(me, function (value) {
                    if (value) {
                        Registration.usernameCheck(value).then(function () {
                            var isValid = !Registration.data();
                            ctrl.$setValidity('usernamevalid', isValid);
                        });
                    }
                });
            }
        }
    }]);
    
    angular.module('main').directive('emailValidate', ['Registration', function (Registration) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var me = attrs.ngModel;
                elem.bind('blur', function () {
                    var value = elem.val();
                    if (value) {
                        Registration.emailCheck(value).then(function () {
                            var isValid = Registration.data();
                            ctrl.$setValidity('emailvalid', isValid);
                        });
                    }

                });
            }
        }
    }]);

})();