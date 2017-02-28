; (function () {
    angular.module('App').controller('SettingsController', ['$scope', '$state', '$ionicLoading', '$ionicPopup', '$ionicHistory', 'UserStore', 'Settings', function ($scope, $state, $ionicLoading, $ionicPopup, $ionicHistory, UserStore, Settings) {

        var vm = this;
        vm.form = {};
        //vm.settingsData = UserStore.data();

        $scope.$on('$ionicView.enter', function (event, data) {
            data.enableBack = true;
            vm.settingsData = angular.copy($scope.$parent.user);
        });

        vm.back = function () {
            var back = $ionicHistory.viewHistory().backView;
            $ionicHistory.goBack();
        };

        vm.settingsSubmit = function (user) {

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
                          var valid = Settings.passwordValid($scope.data.oldpassword);
                          if (vm.form.passwordForm.$valid) {
                              if (valid) {
                                  /*
                                  Settings.updatePassword($scope.data.confirmpassword).then(function () {
                                      var successful = Settings.successfulPassword();
                                      if (successful)
                                          myPopup.close();
                                  });
                                  */
                              }
                              else {
                                  e.preventDefault();
                              }
                          } else {
                              e.preventDefault();
                          }                             
                      }
                  }
                ]
            });
        };

        


    }]);
})();