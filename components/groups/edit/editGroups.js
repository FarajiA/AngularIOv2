; (function () {
    var app = angular.module('App');
    app.controller('AddEditController', ['$scope', '$rootScope', '$ionicHistory', '$state', '$ionicPopup', '$stateParams', 'Traffic', 'Groups', 'Search', function ($scope, $rootScope, $ionicHistory, $state, $ionicPopup, $stateParams, Traffic, Groups, Search) {

        var vm = this;
        vm.groupID = _.toNumber($stateParams.groupID);
        vm.groupMembersIndex = 0;
        vm.groupMembersTotal = 0;
        vm.groupName = "";
        $scope.showChasers = true;
        vm.deleteMemberList = [];

        var history = $ionicHistory;

        $scope.searchIndex = { index: 0 };
        $scope.searchCount = { figure: 0 };
        $scope.searchresults = { array: [] };
        $scope.initial = { first: true };
        $scope.searchresults.array = Traffic.getChasers().results;
        $scope.Members = { array: [] };

        if (vm.groupID > 0)
        {
            vm.groupTitle = groupEditGroup_CONSTANT;
            vm.buttonText = groupSaveButtonText_CONSTANT;
            Groups.getGroupDetails(vm.groupID).then(function (response) {
                vm.groupName = response.result.name;
                vm.groupMembersTotal = response.result.membersAmount;
            });

            Groups.getMembers(vm.groupID, vm.groupMembersIndex).then(function (response) {
                $scope.Members.array = response.results;
                vm.OGmembers = response.results;
                _.forEach($scope.Members.array, function (parentValue, parentKey) {
                    var user = _.find($scope.searchresults.array, { 'id': parentValue.id });
                    if (user)
                        user.checked = true;
                });
                vm.groupMembersTotal = response.total;
                vm.groupMembersIndex++;
            });
        }
        else {
            vm.groupTitle = groupNewGroup_CONSTANT;
            vm.buttonText = groupAddButtonText_CONSTANT;
        }

        vm.updateMembers = function (user) {
            if ($scope.Members.array.length <= 9) {
                var present = _.some($scope.Members.array, ['id', user.id]);

                if (present) {
                    _.remove($scope.Members.array, function (n) {
                        return n.id === user.id;
                    });
                    vm.groupMembersTotal--;
                }
                else {
                    vm.groupMembersTotal++;
                    $scope.Members.array.push(user);
                }
            }
            else {
                var confirmPopup = $ionicPopup.confirm({
                    title: groupMax_CONSTANT
                });
            }
        };

        vm.deleteMember = function (id) {
            vm.groupMembersTotal--;
            _.remove($scope.Members.array, function (n) {
                return n.id === id;
            });

            var user = _.find($scope.searchresults.array, { 'id': id });
            if (user)
                user.checked = false;
        };

        vm.saveGroup = function () {            
            if (vm.groupID > 0) {
                Groups.updateGroup(vm.groupName, vm.groupID, _.map($scope.Members.array, 'id')).then(function (response) {
                    $ionicHistory.goBack();
                });
            }
            else {
                Groups.addGroup(vm.groupName, _.map($scope.Members.array, 'id')).then(function (response) {
                    $ionicHistory.goBack();
                });
            }
        };
        
        $scope.$on("$ionicView.leave", function (event, data) {
            _.forEach(Traffic.getChasers().results, function (parentValue, parentKey) {
                parentValue.checked = false;
            });
        });
    }]);
})();