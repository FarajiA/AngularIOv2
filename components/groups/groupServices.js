; (function () {
    angular.module('App').factory("Groups", ['$http', '$q', 'UserStore', function ($http, $q, UserStore) {
       
        var groupsList = [];
        var Groups = {};

        Groups.allGroups = function (index) {
            var deffered = $q.defer();
            $http.get(baseURL_CONSTANT + "api/groups/" + index + "/" + countSet_CONSTANT)
            .success(function (d) {
                groupsList = d;
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };
        
        Groups.addGroup = function (name, addlist) {
            var deffered = $q.defer();
            var msg = { "name": name, "MembersList": addlist};
            $http.post(baseURL_CONSTANT + "api/groups", msg)
            .success(function (d) {
                if (groupsList.results.length > 0)
                    groupsList.results.unshift(d);
                else
                    groupsList.results = d;
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Groups.updateGroup = function (name, groupID, Members) {
            var deffered = $q.defer();
            var msg = { "name": name, "ID": groupID, "MembersList": Members };
            $http.put(baseURL_CONSTANT + "api/groups", msg)
            .success(function (d) {
                var group = _.find(groupsList.results, ['id', d.id]);
                group.name = d.name;
                group.membersAmount = d.membersAmount;
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Groups.getGroupDetails = function (groupID) {
            var deffered = $q.defer();
            $http.get(baseURL_CONSTANT + "api/groups/" + groupID)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Groups.getMembers = function (groupID, index) {
            var deffered = $q.defer();
            $http.get(baseURL_CONSTANT + "api/groups/" + groupID + "/" + index + "/" + countSet_CONSTANT)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Groups.deleteGroup = function (groupID, index) {
            var deffered = $q.defer();
            $http.delete(baseURL_CONSTANT + "api/groups/" + groupID)
            .success(function (d) {
                if (d) {
                    _.remove(groupsList.results, function (n) {
                        return n.id === groupID;
                    });
                }
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Groups.getGroups = function () { return groupsList; };
        return Groups;

    }]);

})();