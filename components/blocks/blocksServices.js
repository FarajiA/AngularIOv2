; (function () {
    angular.module('App').factory('Block', ['$http', '$q', 'UserStore', function ($http, $q, UserStore) {
        var Block = {};
        var data = [];

        Block.blocks = function (index) {
            var deffered = $q.defer();
            $http.get(baseURL + "api/blocks/" + index + "/" + countSet)
            .success(function (d) {
                data = d;
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Block.block = function (guid) {
            var deffered = $q.defer();
            var msg = { "blocker": UserStore.data().id, "blocked": guid };
            $http.post(baseURL + "api/block", msg)
            .success(function (d) {
                data = d;
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Block.blockExists = function (guid) {
            var deffered = $q.defer();
            /*
            $http.get(baseURL + "api/block/" + guid)
            .success(function (d) {
                data = d
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            */
            return deffered.promise;
        };

        Block.DeleteBlock = function (ID) {
            var deffered = $q.defer();
            /*
            $http.delete(baseURL + "api/block/" + ID)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            */
            return deffered.promise;

        };

        Block.data = function () { return data; };
        return Block;
    }]);

})();