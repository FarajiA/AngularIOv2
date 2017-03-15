; (function () {
    var app = angular.module('App');
    app.controller('UserController', ['$scope', '$timeout', '$stateParams', '$ionicModal', '$location', '$ionicPopover', 'UserStore', 'User', 'BroadcastStatus', 'Block', 'Messages', 'CentralHub', function ($scope, $timeout, $stateParams, $ionicModal, $location, $ionicPopover, UserStore, User, BroadcastStatus, Block, Messages, CentralHub) {
        var vm = this;
        vm.username = $stateParams.username;
        vm.title = vm.username;
        vm.broadcast = {};
        vm.imageURL = imgURL_CONSTANT;
        $scope.chaserBroadcast = {};
        vm.alreadyBlocked = false;
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
                vm.blockText = $scope.relationship == 3 ? decision_CONSTANT.block : decision_CONSTANT.unblock;

                Messages.recentMessage(vm.id).then(function (response) {
                    vm.messageLink = "#/messages/" + vm.id;
                    var Msg = response || {};
                    Msg.username = vm.username;
                    Msg.publickey = vm.publicKey;
                    Messages.activemessage(Msg);
                });

                if (_.toString($scope.relationship) == 1 || !vm.private) {
                    vm.chaserLink = '#/main/' + vm.segment + '/chasers/' + vm.id;
                    vm.chasingLink = '#/main/' + vm.segment + '/chasing/' + vm.id;
                }
                else 
                    vm.chaserLink = vm.chasingLink = "javascript:void(0)";
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
            if (!(vm.id === $scope.user.id)) {
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
                                else
                                    vm.isBroadcasting = userBroadcasting_CONSTANT.notBroadcasting;
                                break;
                            case Group_CONSTANT:
                                BroadcastStatus.access().then(function (response) {
                                    vm.allowedAccess = response.allowed;
                                    vm.isBroadcasting = response.allowed ? userBroadcasting_CONSTANT.broadcasting : userBroadcasting_CONSTANT.notBroadcasting;
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

        $ionicPopover.fromTemplateUrl('menuPopover.html', {
            scope: $scope,
        }).then(function (popover) {
            vm.popover = popover;

            vm.flagUser = function () {
                vm.popover.hide();

                var reportPopup = $ionicPopup.show({
                    templateUrl: 'components/user/report-modal.html',
                    cssClass: 'reportUserPopup',
                    title: 'Report',
                    scope: $scope,
                    buttons: [
                      { text: 'Cancel' },
                      {
                          text: '<b>Report</b>',
                          type: 'button-positive',
                          onTap: function (e) {
                              $ionicLoading.show();
                              var reportResponse;
                              var selected = vm.selectedReportValue;
                              Report.Flag(vm.id, UserObject.data().GUID, selected).then(function (response) {
                                  $ionicLoading.hide();
                                  if (response.ID > 0) {
                                      reportPopup.close();
                                      var alertPopup = $ionicPopup.alert({
                                          title: reporting_CONSTANT.flaggedTitle.replace(/0/gi, vm.username),
                                          template: reporting_CONSTANT.flaggedText
                                      });
                                  }
                                  else {
                                      reportPopup.close();
                                      var alertPopup = $ionicPopup.alert({
                                          title: 'Whoops!',
                                          template: updatedUserConst.unsuccessfulUpdate
                                      });
                                  }
                              }, function () {
                                  $ionicLoading.hide();
                              }).finally(function () {
                                  $ionicLoading.hide();
                              });
                          }
                      }
                    ]
                });
            };

            vm.blockAction = function () {
                vm.popover.hide();
                if (UserObject.getBlocked()) {
                    $timeout(function () {
                        angular.element(document.querySelector('#btnDecision')).triggerHandler('click');
                    }, 100);
                }
                else {
                    var blockPopup = $ionicPopup.show({
                        title: block_CONSTANT.blockedConfirmTitle,
                        buttons: [
                            {
                                text: 'Cancel'
                            },
                            {
                                text: '<b>Sure</b>',
                                type: 'button-positive',
                                onTap: function (e) {
                                    Block.block(vm.id).then(function (response) {
                                        $ionicLoading.hide();
                                        if (response.ID > 0) {
                                            blockPopup.close();
                                            var alertPopup = $ionicPopup.alert({
                                                title: block_CONSTANT.blockedCompletedTitle.replace(/0/gi, $scope.username),
                                                template: block_CONSTANT.blockedCompletedText
                                            });

                                            alertPopup.then(function (res) {
                                                $scope.$emit('emit_Chasers_Block', { action: true });
                                            });

                                            $scope.$emit('emit_Activity', { action: true });


                                            getUserRequest();
                                        }
                                        else {
                                            blockPopup.close();
                                            var alertPopup = $ionicPopup.alert({
                                                title: 'Oops!',
                                                template: genericError_CONSTANT2
                                            });
                                        }
                                    });
                                }
                            }
                        ]
                    });
                }
            };
        });

        vm.FlagOptions = [
            { text: "Inappropriate image", value: "img" },
            { text: "Username or Name", value: "name" },
            { text: "Being an idiot", value: "idiot" },
            { text: "All the above", value: "all" }
        ];

        vm.ReportChange = function (item) {
            vm.selectedReportValue = item.value;
        };

       vm.reportdata = {
            option: 'img'
        };




    }]);
})();