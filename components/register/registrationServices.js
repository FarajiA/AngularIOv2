; (function () {
    angular.module('main').factory("Registration", function ($http, $q) {
    // defines a service used to populate initial data. Also persists value changes between pages.
    var data;
    var Register = {};

        Register.emailCheck = function(email) {
            var deffered = $q.defer();
            var msg = { "email": email };
            $http.post(baseURL + "api/emailcheck", msg)
                .success(function(d) {
                    data = d;
                    deffered.resolve();
                })
                .error(function(data, status) {
                    console.log("Request failed " + status);
                });

            return deffered.promise;
        };

        Register.usernameCheck = function(username) {
            var deffered = $q.defer();
            var msg = { "username": username };
            $http.post(baseURL + "api/namecheck", msg)
                .success(function(d) {
                    data = d;
                    deffered.resolve();
                })
                .error(function(data, status) {
                    console.log("Request failed " + status);
                });

            return deffered.promise;
        };

        Register.data = function() { return data; };
    return Register;
});

})();