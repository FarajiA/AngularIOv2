; (function () {
    angular.module('App').factory("Traffic", ['$http', '$q', 'UserStore', function ($http, $q, UserStore) {
        var getChasing = [];
        var getChasers = [];
        var Traffic = {};

        Traffic.chasers = function (index) {
            var deffered = $q.defer();
            $http.get(baseURL_CONSTANT + "api/chasers/" + index + "/" + countSet_CONSTANT, {
                cache: false
            })
            .success(function (d) {
                deffered.resolve(d);
                getChasers = d;
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Traffic.chasing = function (index) {
            var deffered = $q.defer();
            $http.get(baseURL_CONSTANT + "api/chasing/" + index + "/" + countSet_CONSTANT, {
                cache: false
            })
            .success(function (d) {
                deffered.resolve(d);
                getChasing = d;
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });

            return deffered.promise;
        };

        Traffic.unfollow = function (guid) {
            var deffered = $q.defer();

            return deffered.promise;
        };

        Traffic.viewed = function () {
            var deffered = $q.defer();
            $http.put(baseURL_CONSTANT + "api/chasing/viewed")
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
                deffered.reject(data);
            });
            return deffered.promise;
        };

        Traffic.getChasing = function () { return getChasing; };
        Traffic.getChasers = function () { return getChasers; };

        return Traffic;
    }]);

})();