; (function () {
    angular.module('App').factory('Settings', ['$http', '$q', 'localStorageService', 'UserStore', function ($http, $q, localStorageService, UserStore) {
        var Setting = {};
        var data;
        var passwordUpdated = false;
        var emailUpdated = false;
        var usernameValid = false;

        Setting.updateUser = function (user) {
            var deffered = $q.defer();
            var authData = localStorageService.get('authorizationData');
            var msg = { "firstname": user.firstName, "lastname": user.lastName, "Username": user.userName, "email": user.email, "Private": user.private};
            $http.put(baseURL_CONSTANT + "api/accounts/user", msg)
            .success(function (d) {
                localStorageService.set('authorizationData', { token: authData.token, userName: user.userName, refreshToken: authData.refreshToken, refreshExpiration: authData.refreshExpiration });
                deffered.resolve(d.result);
            })
            .error(function (data, status) {
                deffered.resolve(false);
            });
            return deffered.promise;
        };

        Setting.updatePassword = function (password) {
            var deffered = $q.defer();
            passwordUpdated = false;
            var msg = { "oldpassword": password.oldpassword, "newpassword": password.newpassword, "confirmpassword": password.confirmpassword };
            $http.post(baseURL_CONSTANT + "api/accounts/ChangePassword", msg)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                deffered.resolve(false);
            });
            return deffered.promise;
        };

        Setting.usernameCheck = function (username) {
            var deffered = $q.defer();
            var msg = { "username": username };
            $http.post(baseURL_CONSTANT + "api/accounts/user/checkuserusername", msg)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Setting.emailCheck = function (email) {
            var deffered = $q.defer();
            var msg = { "email": email };
            $http.post(baseURL_CONSTANT + "api/accounts/user/checkuseremail", msg)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };


        Setting.data = function () { return data; };
        return Setting;
    }]);

})();