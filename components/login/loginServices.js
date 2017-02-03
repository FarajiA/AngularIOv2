; (function () {

    angular.module('App').factory('UserLogin', ['$http', '$q', function ($http, $q) {
        var data = [];
        var Login = {};

        Login.setUser = function (provider, token) {
            var deffered = $q.defer();
            var msg = { "provider": provider, "ExternalAccessToken": token };
            $http.post(baseURL_CONSTANT + "api/accounts/existingaccount")
            .success(function (d) {
                data = d.result;
                deffered.resolve(d.result);
            })
            .error(function (data, status) {
                deffered.reject(data);
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Login.emailCheck = function (email) {
            var deffered = $q.defer();
            var msg = { "email": email };
            $http.post(baseURL_CONSTANT + "api/accounts/user/checkemail", msg)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Login.usernameCheck = function (username) {
            var deffered = $q.defer();
            var msg = { "username": username };
            $http.post(baseURL_CONSTANT + "api/accounts/user/checkusername", msg)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Login.forgotPassword = function (email) {
            var deffered = $q.defer();
            var msg = { "email": email };
            $http.post(baseURL_CONSTANT + "api/accounts/user/forgotpassword", msg)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };


        Login.data = function () { return data; };
        return Login;
    }]);
})();