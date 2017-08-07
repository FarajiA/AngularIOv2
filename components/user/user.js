﻿; (function () {
    var app = angular.module('App');
    //app.requires.push('uiGmapgoogle-maps');
    app.controller('UserController', ['$scope', '$q', '$rootScope', '$state', '$timeout', '$stateParams', '$ionicModal', '$ionicPopover', '$ionicPopup', '$ionicLoading', '$location', '$ionicHistory', '$ionicPlatform', '$cordovaGeolocation', 'UserStore', 'User', 'BroadcastStatus', 'Block', 'Messages', 'CentralHub', 'UserView', 'uiGmapGoogleMapApi', 'uiGmapIsReady',
        function ($scope, $q, $rootScope, $state, $timeout, $stateParams, $ionicModal, $ionicPopover, $ionicPopup, $ionicLoading, $location, $ionicHistory, $ionicPlatform, $cordovaGeolocation, UserStore, User, BroadcastStatus, Block, Messages, CentralHub, UserView, GoogleMapApi, uiGmapIsReady) {
        var vm = this;
        /*
        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });
        */
        vm.username = $stateParams.username;
        vm.title = vm.username;
        vm.broadcast = {
            id: 1,
            options: { icon: 'img/checkered_chaser.png' }
        };
        vm.imageURL = $scope.$parent.imageURL;
        var path = $location.path().split("/") || "Unknown";
        vm.segment = path[2];
        vm.showBack = _.isEmpty($ionicHistory.viewHistory().backView);
        vm.userMarker = {
            id: 2,
            options: { icon: 'img/map_dot.png' },
        };
        var options = {
            timeout: 7000,
            enableHighAccuracy: true,
            maximumAge: 500000
        };
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
                vm.blockText = $scope.relationship == 3 ? decision_CONSTANT.unblock : decision_CONSTANT.block;
                
                if (_.toString($scope.relationship) == 1 || !vm.private) {
                    vm.chaserLink = '#/main/' + vm.segment + '/chasers/' + vm.id;
                    vm.chasingLink = '#/main/' + vm.segment + '/chasing/' + vm.id;
                }
                else 
                    vm.chaserLink = vm.chasingLink = "javascript:void(0)";

                Messages.recentMessage(vm.id).then(function (response) {
                    vm.messageLink = "#/messages/" + vm.username + "/" + vm.id;
                    var Msg = response || {};
                    Msg.username = vm.username;
                    Msg.publickey = vm.publicKey;
                    Messages.activemessage(Msg);
                });
            });
        };

        getUserRequest();

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
            } else 
                vm.selfIdentity = true;
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

       vm.goBack = function () {
           var back = $ionicHistory.viewHistory().backView;
           if (!_.isEmpty(back))
               $ionicHistory.goBack();
           else
               $state.go('main.dash');
       };

       $scope.$on('$destroy', function () {
           vm.popover.remove();
       });


       /************** Map ***************/
       $ionicModal.fromTemplateUrl('mapModal.html', {
           scope: $scope,
           animation: 'slide-in-up'
       }).then(function (modal) {
           vm.mapModal = modal;
       });

       vm.openMap = function () {
           $ionicLoading.show({
               template: '<ion-spinner></ion-spinner> Connecting to ' + vm.username
           });
           CentralHub.joinbroadcast($scope.$parent.proxyCentralHub, vm.username).then(function (coords) {
               vm.broadcast.coords = {
                   latitude:  _.toNumber(coords.Latitude),
                   longitude: _.toNumber(coords.Longitude)
               };
               GeoWatch().then(function () {
                   vm.mapModal.show();
                   CentralHub.streamBroadcast($scope.$parent.proxyCentralHub);
                   GoogleMapInvoke();
               }, function () {
                   $ionicLoading.hide();
               });
           });
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
                   latitude: _.toNumber(value.Latitude),
                   longitude: _.toNumber(value.Longitude)
               };
           });
       });

       function GoogleMapInvoke() {
           GoogleMapApi.then(function (maps) {
               $ionicLoading.hide();
               vm.options = { disableDefaultUI: true };
               var markerBounds = new maps.LatLngBounds();
               var chaser_Latlng = new maps.LatLng(vm.broadcast.coords.latitude, vm.broadcast.coords.longitude);
               var user_Latlng = new maps.LatLng(vm.userMarker.coords.latitude, vm.userMarker.coords.longitude);

               markerBounds.extend(chaser_Latlng);
               markerBounds.extend(user_Latlng);
               vm.map = { control: {}, center: { latitude: markerBounds.getCenter().lat(), longitude: markerBounds.getCenter().lng() }, zoom: 12 };

               uiGmapIsReady.promise().then(function (maps) {
                   vm.map.control.getGMap().fitBounds(markerBounds);
                   //$scope.map.control.getGMap().setZoom($scope.map.control.getGMap().getZoom());
               });
           },
               function (error) {
                   $scope.modal.hide();
                   $ionicPopup.alert({
                       title: mapsPrompt_CONSTANT.Errortitle
                   }).then(function (res) {
                   });
               });
       };7
       function GeoWatch() {
           var d = $q.defer()
           $ionicPlatform.ready(function () {
               $scope.geoWatch = $cordovaGeolocation.watchPosition(options);
               $scope.geoWatch.then(null,
                 function (error) {
                     d.reject();
                     $ionicPopup.alert({
                         title: mapsPrompt_CONSTANT.title,
                         template: mapsPrompt_CONSTANT.text
                     }).then(function (res) {
                         //GeoAlert.setGeoalert(true);
                     });
                 }, function (position) {
                     d.resolve();
                     vm.userMarker.coords = {
                         latitude: position.coords.latitude,
                         longitude: position.coords.longitude
                     };
                 });
           });
           return d.promise;
       };

       var clearGeoWatch = function () {
           if (!_.isEmpty($scope.geoWatch))
               $scope.geoWatch.clearWatch();
       };

        /*********** End Map ***************/

       $scope.$on('$ionicView.leave', function () {
           if (!vm.selfIdentity) {
               clearGeoWatch();
               UserView.SetUserPageCurrent(false);
           }
       });
    }]);
})();