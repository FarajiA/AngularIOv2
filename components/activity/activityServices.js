; (function () {
    angular.module('App').factory("Activity", ['$http', '$q', 'UserStore', function ($http, $q, UserStore) {
        var broadcastingData = [];
        var requestsData = [];
        var Activity = {};

        Activity.broadcasting = function (index) {
            var deffered = $q.defer();
            $http.get(baseURL_CONSTANT + "api/chasing/broadcasting/" + index + "/" + countSet_CONSTANT, {
                cache: false
            })
            .success(function (d) {
                deffered.resolve(d);
                broadcastingData = d;
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });

            return deffered.promise;
        };

        Activity.requests = function (index) {
            var deffered = $q.defer();

            $http.get(baseURL_CONSTANT + "api/requests/" + index + "/" + countSet_CONSTANT, {
                cache: false
            })
            .success(function (d) {
                deffered.resolve(d);
                requestsData = d;
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });

            return deffered.promise;
        };

        Activity.requestDecline = function (userGuid) {
            var deffered = $q.defer();
            var guid = UserStore.data().id;
            

            return deffered.promise;
        };

        Activity.requestAccept = function (userGuid) {
            var deffered = $q.defer();
            var guid = UserStore.data().id;
            var msg = { "requester": userGuid, "requestee": guid };
            

            return deffered.promise;
        };

        Activity.viewed = function () {
            var deffered = $q.defer();
            $http.put(baseURL_CONSTANT + "api/requests/viewed")
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
                deffered.reject(data);
            });

            return deffered.promise;
        };

        Activity.broadcastingData = function () { return broadcastingData; };
        Activity.requestsData = function () { return requestsData; };

        return Activity;
    }]);

})();