; (function () {
    var app = angular.module('App');
    app.controller('GroupsController', ['$scope', '$ionicPopup', '$ionicHistory', 'BroadcastInfo', 'Groups', function ($scope, $ionicPopup, $ionicHistory, BroadcastInfo, Groups) {

        var vm = this;        
        vm.groupsTotal = 0;
        var broadcast = BroadcastInfo.broadcast();
       
        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });
       
        $scope.$on('$ionicView.enter', function (event, data) {
            vm.groupIndex = 0;
            Groups.allGroups(vm.groupIndex).then(function (response) {
                vm.Groups = response.results;
                vm.groupsTotal = response.total;
                vm.groupIndex++;
            });
        });        

        vm.deleteGroup = function (id, name) {
            if (broadcast.broadcastGroupID === vm.groupID) {
                var alertPopup = $ionicPopup.alert({
                    title: userBroadcasting_CONSTANT.broadcastGroupConflictTitle,
                    template: userBroadcasting_CONSTANT.broadcastGroupConflict
                });
            }
            else {
                var confirmPopup = $ionicPopup.confirm({
                    title: _.replace(groupDeleteConfirmTitle_CONSTANT, '0', name)
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        Groups.deleteGroup(id).then(function (response) {
                            if (!response) {
                                var confirmPopup = $ionicPopup.confirm({
                                    title: genericError_CONSTANT
                                });
                            }

                        });
                    }
                });
            }
        };
        /*
        vm.goBack = function () {
            var back = $ionicHistory.viewHistory().backView;
            $ionicHistory.goBack();
        };
        */
    }]);
})();