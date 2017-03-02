; (function () {
    angular.module('App').controller('SettingsController', ['$scope', '$state', '$ionicLoading', '$ionicPopup', '$ionicHistory', 'UserStore', 'Settings', function ($scope, $state, $ionicLoading, $ionicPopup, $ionicHistory, UserStore, Settings) {

        var vm = this;
        vm.form = {};

        $scope.$on('$ionicView.enter', function (event, data) {
            data.enableBack = true;
            vm.settingsData = angular.copy($scope.$parent.user);
        });

        vm.back = function () {
            var back = $ionicHistory.viewHistory().backView;
            $ionicHistory.goBack();
        };

        vm.settingsSubmit = function () {
            if (vm.form.settingsForm.$valid) {
                $ionicLoading.show({
                    template: 'Saving...'
                });
                Settings.updateUser(vm.settingsData).then(function (response) {
                    if (response) {
                        $scope.$parent.user.firstName = response.firstName;
                        $scope.$parent.user.lastName = response.lastName;
                        $scope.$parent.user.userName = response.userName;
                        $scope.$parent.user.private = response.private;
                        var alertPopup = $ionicPopup.alert({
                            title: "Updated"
                        });
                        alertPopup.then(function (res) {
                            $ionicHistory.goBack();
                        });                       
                    }
                    else {
                        var alertPopup = $ionicPopup.alert({
                            title: genericError_CONSTANT
                        });

                        alertPopup.then(function (res) {
                           
                        });
                    }
                }).finally(function () {
                    $ionicLoading.hide();
                });
            }
        };

        vm.updatePassword = function () {
            $scope.data = {};
            vm.form = {
                passwordForm: {}
            };          
            // An elaborate, custom popup
            var myPopup = $ionicPopup.show({
                templateUrl: 'components/settings/password-modal.html',
                cssClass: 'passwordPopup',
                title: 'Update Password',
                scope: $scope,
                buttons: [
                  { text: 'Cancel' },
                  {
                      text: '<b>Update</b>',
                      type: 'button-positive',
                      onTap: function (e) {
                          if (vm.form.passwordForm.$valid) {
                              $ionicLoading.show({ template: 'Saving...' });
                              Settings.updatePassword(vm.passwordData).then(function (response) {   
                                  if (response) {
                                      myPopup.close();
                                      var alertPopup = $ionicPopup.alert({
                                          title: "Updated"
                                      });
                                      alertPopup.then(function (res) {
                                          $ionicHistory.goBack();
                                      });
                                  }
                                  else {
                                      var alertPopup = $ionicPopup.alert({
                                          title: genericError_CONSTANT
                                      });
                                      alertPopup.then(function (res) {
                                          
                                      });
                                  }
                              }).finally(function () {
                                  $ionicLoading.hide();
                              });
                                                
                          }
                          else 
                              e.preventDefault();
                      }
                  }
                ]
            });
        };

        $scope.$on('$ionicView.leave', function () {

        });



    }]);
})();