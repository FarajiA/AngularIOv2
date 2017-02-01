; (function () {   
    angular.module('App').directive('searchMembers',  ['Search', 'Traffic', SearchMembers]);
            
    function SearchMembers(Search, Traffic) {
        return {
            restrict: 'A',
            link: function (scope, elem, attrs) {
                elem.bind('propertychange keyup paste', function (e) {
                    var value = elem.val();
                    scope.$apply(function () {
                        scope.showChasers = true;
                    });
                    if (!_.isEmpty(value)) {
                        scope.searchIndex.index = 0;
                        scope.$apply(function () {
                            Search.searchChasers(value, scope.searchIndex.index).then(function (response) {
                                scope.searchCount.figure = response.total
                                scope.searchresults.array = response.results;
                                scope.noMoSearch = (scope.searchCount.figure <= countSet_CONSTANT);
                                scope.initial.first = false;
                                scope.searchIndex.index++;
                                _.forEach(scope.Members.array, function (parentValue, parentKey) {
                                    var user = _.find(scope.searchresults.array, { 'id': parentValue.id });
                                    if (user)
                                        user.checked = true;
                                });
                            });
                        });
                    }
                    else {
                        scope.$apply(function () {
                            scope.searchresults.array = _.forEach(Traffic.getChasers().results, function (parentValue, parentKey) {
                                var user = _.find(scope.Members.array, { 'id': parentValue.id });
                                if (user)
                                    user.checked = true;
                            });
                        });
                    }
                });
            }
        };

    }


      
})();