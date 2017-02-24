; (function () {
    angular.module('App').factory('Broadcast', ['$http', '$q', function ($http, $q) {
        var data = [];
        var Broadcast = {};

        Broadcast.On = function (coords, groupID, broadcastType) {
            var deffered = $q.defer();
            var msg = { 'Coords': { "Longitude": coords.longitude, "Latitude": coords.latitude }, "BroadcastGroupID": groupID, "BroadcastType": broadcastType };
            $http.post(baseURL_CONSTANT + "api/broadcast/on", msg)
            .success(function (d) {
                data = d;
                deffered.resolve(d);
            })
            .error(function (data, status) {
                deffered.reject(data);
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Broadcast.Broadcast = function (coords) {
            var deffered = $q.defer();
            var msg = { "Longitude": coords.longitude, "Latitude": coords.latitude };
            $http.post(baseURL_CONSTANT + "api/broadcast", msg)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                deffered.reject(data);
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Broadcast.Off = function () {
            var deffered = $q.defer();
            $http.put(baseURL_CONSTANT + "api/broadcast/off")
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                deffered.reject(data);
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Broadcast.Notify = function (type, group) {
            var deffered = $q.defer();
            var msg = { 'type': type, 'group': group };
            $http.post(baseURL_CONSTANT + "api/broadcast/notify", msg)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                deffered.reject(data);
                console.log("Request failed " + status);
            });
            return deffered.promise;
        }

        Broadcast.data = function () { return data; };
        return Broadcast;
    }]);
})();

