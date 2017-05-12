; (function () {
    var app = angular.module('App');
    app.controller('DashGroupController', ['$scope', '$state', '$ionicHistory', 'Groups', 'Broadcast', 'CentralHub', '$cordovaGeolocation', '$ionicPopup', '$ionicLoading', '$ionicPopover', function ($scope, $state, $ionicHistory, Groups, Broadcast, CentralHub, $cordovaGeolocation, $ionicPopup, $ionicLoading, $ionicPopover) {

        var vm = this;
        vm.groupIndex = 0;
        vm.groupsTotal = 0;
        var posOptions = { timeout: 10000, enableHighAccuracy: false };

        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });

        vm.all = false;
        vm.any = false;
        vm.every = false;

        vm.allChasers = AllChasers_CONSTANT;
        vm.anyonewithLink = AnyoneWithLink_CONSTANT;
        vm.everyone = Everyone_CONSTANT;
        vm.groupOnly = Group_CONSTANT;
        //vm.coords = { longitude: "-118.198020", latitude: "33.771682" };
        
        Groups.allGroups(vm.groupIndex).then(function (response) {
            vm.Groups = response.results;
            vm.groupsTotal = response.total;
            vm.groupIndex++;
        });

        vm.broadcast = function (groupID, type) {
            $ionicLoading.show({
                content: '<ion-spinner icon="dots" class="spinner-dark"></ion-spinner>',
                animation: 'fade-in',
                showBackdrop: false,
                maxWidth: 200,
                showDelay: 0
            });
            $cordovaGeolocation
               .getCurrentPosition(posOptions)
               .then(function (position) {
                   $scope.user.latitude = position.coords.latitude;
                   $scope.user.longitude = position.coords.longitude;
                   Broadcast.On(position.coords, groupID, type).then(function (response) {
                       if (!_.isEmpty(response.broadcastType)) {
                           $scope.$parent.user.broadcasting = true;
                           $scope.$parent.user.broadcast = response;
                           $ionicLoading.hide();
                           $ionicHistory.goBack();
                           $scope.$emit('emit_Broadcasting', { action: "turn-on" });
                           Broadcast.Notify(type, groupID);
                           CentralHub.views($scope.$parent.proxyCentralHub);
                       }
                   }, function (err) {
                       $ionicLoading.hide();
                   });
               }, function (err) {
                   $ionicLoading.hide();
                   $ionicPopup.alert({
                       title: maps_CONSTANT.title
                   }).then(function (res) {
                       //console.log("Location services not on");
                   });
               });
        };
        vm.updateBroadcast = function () {

        };


        $ionicPopover.fromTemplateUrl('groupPopover.html', {
            scope: $scope
        }).then(function (popover) {
            vm.popover = popover;
        });
        var choiceArray = [vm.all, vm.any, vm.every ]
        $scope.openPopover = function ($event) {

            //vm.helperText = 

            $scope.popover.show($event);
        };

        $scope.closePopover = function () {
            $scope.popover.hide();
        };

        $scope.$on('$destroy', function () {
           vm.popover.remove();
        });




    }]);
})();