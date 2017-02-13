; (function () {
    angular.module('App').factory('Chasing', ['$http', '$q', function ($http, $q) {
        var data = [];
        var User = {};

        User.chasing = function (index, guid) {
            var deffered = $q.defer();
            $http.get(baseURL_CONSTANT + "api/chasing/" + guid + "/" + index + "/" + countSet_CONSTANT)
            .success(function (d) {
                data = d;
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        User.data = function () { return data };
        return User;
    }]);

})();
