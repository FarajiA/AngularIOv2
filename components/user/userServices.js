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

})();