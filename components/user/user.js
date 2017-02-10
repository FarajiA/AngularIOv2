; (function () {
    var app = angular.module('App');
    app.controller('UserController', ['$scope', '$timeout', '$stateParams', '$ionicModal', '$location', 'UserStore', 'User', 'BroadcastStatus', 'Block', 'CentralHub', function ($scope, $timeout, $stateParams, $ionicModal, $location, UserStore, User, BroadcastStatus, Block, CentralHub) {
        var vm = this;
        vm.username = $stateParams.username;
        vm.title = vm.username;
        vm.broadcast = {};
        $scope.chaserBroadcast = {};
        var path = $location.path().split("/") || "Unknown";
        vm.segment = path[2];

        var getUserRequest = function () {
            User.Info(vm.username).then(function (response) {
                vm.fullName = response.fullName;
                vm.id = response.id;
                vm.photo = response.photo;
                vm.private = response.private;
                vm.publicKey = response.publicKey;
                $scope.chasing = response.chasing;
                $scope.chasers = response.chasers;
                vm.broadcasting = response.broadcasting;
                $scope.relationship = response.relationship;
                $scope.broadcastObject = response.broadcast;
            });
        };

        getUserRequest();

        /*  Map logic */
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
        /* End map*/

        $scope.$on('$ionicView.enter', function () {
            if (!(vm.id === UserStore.data().id)) {
                vm.chaserLink = '#/main/' + vm.segment + '/chasers/' + vm.id;
                vm.chasingLink = '#/main/' + vm.segment + '/chasing/' + vm.id;

                $scope.$watch("vm.broadcasting", function (newValue, oldValue) {
                    if (newValue && !_.isEmpty($scope.broadcastObject)) {
                        vm.allowedAccess = false;
                        switch (_.toString($scope.broadcastObject.broadcastType)) {
                            case Everyone_CONSTANT:
                                vm.allowedAccess = true;
                                vm.isBroadcasting = userBroadcasting_CONSTANT.broadcasting;
                                break;
                            case AllChasers_CONSTANT:
                                if ($scope.relationship == 1) {
                                    vm.allowedAccess = true;
                                    vm.isBroadcasting = userBroadcasting_CONSTANT.broadcasting;
                                }
                                break;
                            case Group_CONSTANT:
                                BroadcastStatus.access().then(function (response) {
                                    vm.allowedAccess = response;
                                    vm.isBroadcasting = response ? userBroadcasting_CONSTANT.broadcasting : userBroadcasting_CONSTANT.notBroadcasting;
                                });
                                break;
                            default:
                                vm.isBroadcasting = userBroadcasting_CONSTANT.notBroadcasting;
                                break;
                        }
                    }
                    else {
                        vm.isBroadcasting = userBroadcasting_CONSTANT.notBroadcasting;
                        vm.allowedAccess = false;
                    }
                });
            }
        });

        $scope.$on('$ionicView.leave', function () {
            /* 
            if (!$scope.selfIdentity) {
                UserView.SetUserPageCurrent(false);
            }
            */
        });





    }]);
})();