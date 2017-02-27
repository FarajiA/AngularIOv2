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
            $http.get(baseURL + "api/blocks/" + index + "/" + countSet)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Setting.updatePassword = function (password) {
            var deffered = $q.defer();
            passwordUpdated = false;
            var msg = { "guid": guid, "password": password };
            $http.post(baseURL + "api/update_password", msg)
            .success(function (d) {
                passwordUpdated = d;
                localStorageService.set('authorizationData', { chaserID: UserObject.data().GUID, chaseruser: UserObject.data().username, chasrpsswd: password });
                deffered.resolve();
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Setting.usernameCheck = function (username) {
            var deffered = $q.defer();
            var msg = { "guid": guid, "password": password };
            $http.post(baseURL + "api/update_password", msg)
            .success(function (d) {
                passwordUpdated = d;
                localStorageService.set('authorizationData', { chaserID: UserObject.data().GUID, chaseruser: UserObject.data().username, chasrpsswd: password });
                deffered.resolve();
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