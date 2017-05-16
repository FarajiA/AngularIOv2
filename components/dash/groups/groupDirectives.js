; (function () {
    
    angular.module('App').directive('customRadio', function () {
        return {
            restrict: 'A',
            require: '^ngModel',
            scope: {
                choice: '='
            },
            link: function (scope, elem, attrs, ngModelCtrl) {
                elem.on('click', function () {
                    scope.$apply(function () {
                        ngModelCtrl.$setViewValue(scope.choice);
                    });
                });
            }
        };
    });

})();