; (function () {
    angular.module('App').directive('autoSearch', ['Search', function (Search) {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, elem, attrs, ctrl) {
                elem.bind('propertychange keyup paste', function () {
                    var value = elem.val();
                    scope.searchIndex.index = 0;
                    //var min = attrs.min;
                    if (value.length >= attrs.min) {
                        scope.$apply(function () {
                            Search.search(value, scope.searchIndex.index).then(function () {
                                scope.searchCount.figure = Search.data().total;
                                scope.searchresults.array = Search.data().results;
                                scope.noMoSearch = (scope.searchCount.figure <= countSet_CONSTANT);
                                scope.initial.first = false;
                                scope.searchIndex.index++;
                            });
                        });
                    }
                    else
                        scope.searchresults.array = {};
                });
            }
        }
    }]);

})();