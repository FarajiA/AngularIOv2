; (function () {
    angular.module('App').factory("Search", ['$http', '$q', 'UserStore', function ($http, $q, UserStore) {
        var Search = {};
        var data = [];

        Search.search = function (query, index) {
            var deffered = $q.defer();
            $http.get(baseURL_CONSTANT + "api/search/" + query + "/" + index + "/" + countSet_CONSTANT)
            .success(function (d) {
                deffered.resolve(d);
                data.push(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });

            return deffered.promise;
        };

        Search.searchChasers = function (query, index) {
            var deffered = $q.defer();
            $http.get(baseURL_CONSTANT + "api/search/chasers/" + query + "/" + index + "/" + countSet_CONSTANT)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });

            return deffered.promise;
        };


        Search.data = function () { return data; };
        return Search;
    }]);

})();