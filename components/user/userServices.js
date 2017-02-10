; (function () {
    angular.module('App').factory("User", ['$http', '$q', 'UserStore', function ($http, $q, UserStore) {
        var User = {};
        var data = [];

        User.Info = function (username) {
            var deffered = $q.defer();
            $http.get(baseURL_CONSTANT + "api/accounts/user/" + username)
            .success(function (d) {
                deffered.resolve(d.result);
                data = d.result;
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });

            return deffered.promise;
        };

        User.data = function () { return data; };
        return User;
    }]);
    angular.module('App').factory('Decision', ['$http', '$q', 'UserStore', function ($http, $q, UserStore) {
        var Decision = {};

        Decision.follow = function (guid) {
            var deffered = $q.defer();
            var msg = { "chaser": guid };
            $http.post(baseURL_CONSTANT + "api/chasing", msg)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Decision.unfollow = function (username) {
            var deffered = $q.defer();
            $http.delete(baseURL_CONSTANT + "api/chasing/" + username)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Decision.request = function (guid) {
            var deffered = $q.defer();
            var msg = { "requestee": guid };
            $http.post(baseURL_CONSTANT + "api/requests", msg)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        return Decision;
    }]);
    angular.module('App').factory("BroadcastStatus", ['$http', '$q', 'User', function ($http, $q, User) {
        var Broadcast = {};
        var data = [];

        Broadcast.access = function () {
            var deffered = $q.defer();
            $http.get(baseURL_CONSTANT + "api/broadcast/access/" + User.data().id)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Broadcast.data = function () { return data; };
        return Broadcast;
    }]);
})();