; (function () {
    angular.module('App').factory('Chasers', ['$http', '$q', function ($http, $q) {
        var data = [];
        var User = {};

        User.chasers = function (index, guid) {            
            var deffered = $q.defer();
            $http.get(baseURL + "api/chasers/" + guid + "/" + index + "/" + countSet)
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