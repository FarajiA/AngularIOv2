; (function () {
    var app = angular.module('App');
    app.controller('MembersController', ['$scope', '$ionicPopup', 'Groups', 'Members', function ($scope, $ionicPopup, Groups, Members) {

        var vm = this;
        vm.membersIndex = 0;
        vm.membersTotal = 0;

        Members.allMembers(vm.membersIndex).then(function (response) {
            vm.Members = response.results;
            vm.groupsTotal = response.total;
            vm.groupIndex++;
        });

        vm.deleteGroup = function (id, name) {
            var confirmPopup = $ionicPopup.confirm({
                title: _.replace(groupDeleteConfirmTitle_CONSTANT, '{0}', name)
            });
            confirmPopup.then(function (res) {
                if (res) {
                    Groups.deleteGroup(id).then(function (response) {
                        console.log("Group deleted");
                    });
                }
            });
        };

    }]);
})();