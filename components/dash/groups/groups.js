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
        
        vm.allChasers = AllChasers_CONSTANT;
        vm.anyonewithLink = AnyoneWithLink_CONSTANT;
        vm.everyone = Everyone_CONSTANT;
        vm.groupOnly = Group_CONSTANT;
       vm.coords = { longitude: "-118.198020", latitude: "33.771682" };
       
        Groups.allGroups(vm.groupIndex).then(function (response) {
            vm.selections = [
                { text: 'All Followers', selected: false, groupID: 0, type: vm.allChasers, amount: 0 },
                { text: 'Anyone with link', selected: false, groupID: 0, type: vm.anyonewithLink, amount: 0 },
                { text: 'Anyone & Everyone', selected: false, groupID: 0, type: vm.everyone, amount: 0 }
            ];
            _.forEach(response.results, function (value, key) {
                var mapped = {
                    text: value.name,
                    selected: false,
                    groupID: value.id,
                    type: vm.groupOnly,
                    amount: value.membersAmount
                };
                vm.selections.push(mapped);
            });
            //vm.Groups = response.results;
            vm.groupsTotal = response.total;
            vm.groupIndex++;
            $ionicLoading.hide();
        });

        vm.broadcast = function () {
            $ionicLoading.show({
                content: '<ion-spinner icon="dots" class="spinner-dark"></ion-spinner>',
                animation: 'fade-in',
                showBackdrop: false,
                maxWidth: 200,
                showDelay: 0
            });

            var selected = JSON.parse(vm.choice);
            $cordovaGeolocation
               .getCurrentPosition(posOptions)
               .then(function (position) {
                   $scope.user.latitude = position.coords.latitude;
                   $scope.user.longitude = position.coords.longitude;
                   Broadcast.On(position.coords, selected.groupID, selected.type).then(function (response) {
                       if (!_.isEmpty(response.broadcastType)) {
                           $scope.$parent.user.broadcasting = true;
                           $scope.$parent.user.broadcast = response;
                           $ionicLoading.hide();
                           $ionicHistory.goBack();
                           $scope.$emit('emit_Broadcasting', { action: "turn-on" });
                           Broadcast.Notify(selected.type, selected.groupID);
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
        
        $ionicPopover.fromTemplateUrl('groupPopover.html', {
            scope: $scope
        }).then(function (popover) {
            vm.popover = popover;
        });
        vm.openPopover = function ($event, type) {
            switch (type) {
                case AllChasers_CONSTANT:
                    vm.helperText = broadcast_CONSTANT.allfollowers;
                    break;
                case AnyoneWithLink_CONSTANT:
                    vm.helperText = broadcast_CONSTANT.anyoneLink;
                    break;
                case Everyone_CONSTANT:
                    vm.helperText = broadcast_CONSTANT.anyoneEvery;
                    break;
            }
            vm.popover.show($event);
        };

        $scope.closePopover = function () {
            $scope.popover.hide();
        };

        $scope.$on('$destroy', function () {
           vm.popover.remove();
        });




    }]);
})();