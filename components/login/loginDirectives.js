; (function () {
    angular.module('App').directive('emailValidate', ['Registration', function (Registration) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var me = attrs.ngModel;
                elem.bind('blur', function () {
                    var value = elem.val();
                    var pattern = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                    if (pattern.test(value)) {
                        Registration.emailCheck(value).then(function () {
                            var isValid = Registration.data();
                            ctrl.$setValidity('emailvalid', isValid);
                        });
                    }
                });
                elem.bind('focusin', function () {
                    ctrl.$setValidity('emailvalid', true);
                });
            }
        }
    }]).directive('usernameValidate', ['Registration', function (Registration) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var me = attrs.ngModel;
                //var min = attrs.ngMinlength;                
                scope.$watch(me, function (value) {
                    var theexpression = attrs.usernameValidate;
                    var flags = attrs.regexValidateFlags || '';

                    if (value) {
                        var regex = new RegExp(theexpression, flags);
                        var valid = regex.test(value);
                        ctrl.$setValidity('charactersvalid', valid);
                        if (valid) {
                            Registration.usernameCheck(value).then(function () {
                                var isValid = !Registration.data();
                                ctrl.$setValidity('usernamevalid', isValid);
                            });
                        } else
                            ctrl.$setValidity('usernamevalid', true);
                    }
                    else {
                        ctrl.$setValidity('usernamevalid', true);
                        ctrl.$setValidity('charactersvalid', true);
                    }
                });
            }
        }
    }]).directive('pwValidate', [function () {
        /*  Attributes to add for validation to include alphabet & numeral
        pw-validate="^(?=.{6,})(?=.*[a-zA-Z])(?=.*[0-9]).*$" regex-validate-flags="g" 
        */
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                var me = attrs.ngModel;
                elem.bind('focusin', function () {
                    ctrl.$setValidity('passwordvalid', true);
                });

                elem.bind('blur', function () {
                    var value = elem.val();
                    var theexpression = attrs.pwValidate;
                    var flags = attrs.regexValidateFlags || '';
                    if (value) {
                        var regex = new RegExp(theexpression, flags);
                        var valid = regex.test(value);
                        ctrl.$setValidity('passwordvalid', valid);
                    }
                    else
                        ctrl.$setValidity('passwordvalid', true);
                });
            }
        }
    }]).directive('pwCheck', [function () {
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

})();