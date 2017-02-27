; (function () {
    angular.module('App').controller('SettingsController', ['$scope', '$state', '$ionicLoading', '$ionicPopup', '$ionicHistory', 'UserStore', 'Settings', function ($scope, $state, $ionicLoading, $ionicPopup, $ionicHistory, UserStore, Settings) {

        var vm = this;
        vm.settingsData = UserStore.data();

        vm.back = function () {
            var back = $ionicHistory.viewHistory().backView;
            $ionicHistory.goBack();
        };



    }]);
})();