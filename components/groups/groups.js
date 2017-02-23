; (function () {
    var app = angular.module('App');
    app.controller('GroupsController', ['$scope', '$ionicPopup', '$ionicHistory', 'Groups', function ($scope, $ionicPopup, $ionicHistory, Groups) {

        var vm = this;
        vm.groupIndex = 0;
        vm.groupsTotal = 0;
       
        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });
       
        Groups.allGroups(vm.groupIndex).then(function (response) {
            vm.Groups = response.results;
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
                        if (!response) {
                            var confirmPopup = $ionicPopup.confirm({
                                title: genericError_CONSTANT
                            });
                        }

                    });
                }
            });
        };
        /*
        vm.goBack = function () {
            var back = $ionicHistory.viewHistory().backView;
            $ionicHistory.goBack();
        };
        */
    }]);
})();