; (function () {
    angular.module('App').requires.push('monospaced.elastic');
    /*
    angular.module('App')
        .directive('scrollBottom', function () {
        return {
            scope: {
                schrollBottom: "="
            },
            link: function(scope, element) {
                scope.$watchCollection('schrollBottom', function(newValue) {
                    if (newValue) {
                        $(element).scrollTop($(element)[0].scrollHeight);
                    }
                });
            }
        };
    });
    */
    angular.module('App')
        .directive('elastic', function () {
        return {
            restric: 'A',
            link: function (scope, el, attr) {
                scope.$on('elastic:resize', function (event, element, oldHeight, newHeight) {
                    newHeight = Math.max(44, newHeight);
                    el[0].style.height = newHeight + 'px';
                });
            }
        }
    });

})();