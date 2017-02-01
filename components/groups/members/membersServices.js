; (function () {
    angular.module('App').factory("Members", ['$http', '$q', function ($http, $q) {
       
        var groupMembers = [];
        var Members = {};

        Members.allGroups = function (groupID, index) {
            var deffered = $q.defer();
            $http.get(baseURL_CONSTANT + "api/groups/" + groupID + "/" + index + "/" + countSet_CONSTANT)
            .success(function (d) {
                groupMembers = d;
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };
        
        Members.addGroupMember = function (name, addlist) {
            var deffered = $q.defer();
            var msg = { "name": name, "MembersList": addlist};
            $http.post(baseURL_CONSTANT + "api/groups", msg)
            .success(function (d) {
                groupsList.push(d);
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Members.updateGroup = function (name, groupID, deleteMembers, addMembers) {
            var deffered = $q.defer();
            var msg = {"name": name, "ID": groupID, "DeleteMembersList": deleteMembers, "MembersList": addMembers}
            $http.put(baseURL_CONSTANT + "api/groups", msg)
            .success(function (d) {
                _.remove(groupsList, function (group) {
                    return  group.id == d.id;
                });
                groupsList.push(d);
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Members.getMembers = function (groupID, index) {
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

        Members.deleteGroup = function (groupID, index) {
            var deffered = $q.defer();
            $http.delete(baseURL_CONSTANT + "api/groups/" + groupID)
            .success(function (d) {
                deffered.resolve(d);
            })
            .error(function (data, status) {
                console.log("Request failed " + status);
            });
            return deffered.promise;
        };

        Members.members = function () { return groupMembers; };
        return Members;

    }]);

})();