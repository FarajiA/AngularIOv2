; (function () {
    angular.module('App').factory("Messages", ['$http', '$q', 'UserStore', function ($http, $q, UserStore) {
        var inboxMessages = [];
        var active = {};
        var Message = {};

        Message.inbox = function (index) {
            var deffered = $q.defer();

            $http.get(baseURL_CONSTANT + "api/messages/inbox/" + index + "/" + countSet_CONSTANT, {
                cache: false
            })
            .success(function (d) {
                inboxMessages = d;
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            
            return deffered.promise;
        };

        Message.viewed = function (user) {
            var deffered = $q.defer();
            var msg = { "user": user };
            $http.put(baseURL_CONSTANT + "api/messages/viewed", msg)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });

            return deffered.promise;
        };

        Message.updateThread = function (msg, refresh) {
            var deffered = $q.defer();
            var promises = [];

         if (refresh) {
                this.inbox(0).then(function (response) {
                    deffered.resolve(response);
                });
         }        
         else {

             var correspondents = _.split(msg.corresponder, ',');
             var usernames = _.split(msg.username, ',');
             var publickeys = _.split(msg.publickey, ',');

             var zipped = _.zip(correspondents, usernames, publickeys);
             
             _.forEach(zipped, function (value) {
                 _.remove(inboxMessages.results, function (n) {
                     return n.corresponder === value[0];
                 });
                 var newMsg = angular.copy(msg);
                 newMsg.corresponder = value[0];
                 newMsg.username = value[1];
                 newMsg.publickey = value[2];
                 inboxMessages.results.unshift(newMsg);
             });

             deffered.resolve(inboxMessages.results);
         }
            return deffered.promise;
        };

        Message.recentMessage = function(user) {
            var deffered = $q.defer();
            $http.get(baseURL_CONSTANT + "api/messages/recent/" + user)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });

            return deffered.promise;
        };

        Message.activemessage = function (msg) {
            var deffered = $q.defer();
            active = msg;
            deffered.resolve(active);
            return deffered.promise;
        };

        Message.updateActive = function (msg) {
            var deffered = $q.defer();
            active = msg;
            deffered.resolve(active);
            return deffered.promise;
        }
       
        Message.inboxMessages = function () { return inboxMessages; };
        Message.active = function () { return active; };
        return Message;

    }]);

})();