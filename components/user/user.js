; (function () {
    var app = angular.module('App');
    app.controller('UserController', ['$scope', '$timeout', '$stateParams', '$ionicModal', 'UserStore', 'User', 'Block', 'CentralHub', function ($scope, $timeout, $stateParams, $ionicModal, UserStore, User, Block, CentralHub) {
        var vm = this;
        vm.username = $stateParams.username;
        vm.title = vm.username;
        vm.broadcast = {};

        $scope.chaserBroadcast = {};

        var getUserRequest = function () {
            User.Info(vm.username).then(function (response) {
                vm.fullName = response.fullName;
                vm.id = response.id;
                vm.isChasing = response.isChasing;
                vm.photo = response.photo;
                vm.private = response.private;
                vm.publicKey = response.publicKey;
                vm.chasing = response.chasing;
                vm.chasers = response.chasers;
                vm.broadcasting = response.broadcast;
                /*
                Block.blockExists(vm.id).then(function (response) {

                 
                    UserObject.setBlocked(response.ID > 0);
                    if (response.ID > 0) {
                        $scope.isChasing = $scope.symbol = 3;
                        $scope.blockText = activityConst.unblock;
                    }
                    else {
                        $scope.isChasing = $scope.symbol = UserObject.details().isChasing;
                        $scope.blockText = activityConst.block;
                    }
                  
                });  
                */
            });
        };

        getUserRequest();
        
        $ionicModal.fromTemplateUrl('mapModal.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function (modal) {
            vm.mapModal = modal;
        });

        vm.openMap = function () {
            CentralHub.joinbroadcast($scope.$parent.proxyCentralHub, vm.username).then(function (coords) {
                vm.broadcast.coords = {
                    latitude: _.toNumber(coords.Latitude),
                    longitude: _.toNumber(coords.Longitude)
                };
                CentralHub.streamBroadcast($scope.$parent.proxyCentralHub);
            });
            vm.mapModal.show();            
        };

        vm.closeMap = function () {
            vm.mapModal.hide();
            CentralHub.leavebroadcast($scope.$parent.proxyCentralHub, vm.id);
        };

        // Cleanup the modal when we're done with it!
        $scope.$on('$destroy', function () {
            vm.mapModal.remove();

        });

        $scope.$on('mapUpdate', function (event, value) {
            $scope.$apply(function () {
            vm.broadcast.coords = {
                latitude: _.toNumber(value.coords.Latitude),
                longitude: _.toNumber(value.coords.Longitude)
            };
            });
        });

    }]);
})();