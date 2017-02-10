﻿; (function () {
    angular.module('App').controller('ChasersController', ['$scope', '$stateParams', '$location', 'Chasing', function ($scope, $stateParams, $location, Chasing) {

        var vm = this;
        var userID = $stateParams.userId;
        vm.imageURL = imgURL_CONSTANT;

        var chasersInit = function () {
            //$ionicLoading.show();
            vm.index = 0;
            Chasers.chasers(vm.index, userID).then(function (response) {
                vm.chasers = response.results;
                vm.index++;
                //$ionicLoading.hide();
            }, function (error) {
                //$ionicLoading.hide();
            });
        };

        chasersInit();

        vm.loadMoreChasers = function () {
            var chasersNo = Chasers.data().Total;
            var pagingMax = Math.ceil(chasersNo / countSet_CONSTANT, 1);
            if (vm.index < pagingMax && vm.index > 0) {
                Chasers.chasers(vm.index, userID).then(function (response) {
                    var merged = vm.chasers.concat(response.Results);
                    vm.chasers = merged;
                    vm.index++;
                });
            }
            else if (vm.index == pagingMax)
                $scope.noMoChasers = true;

            $scope.$broadcast('scroll.infiniteScrollComplete');
        };

        var path = $location.path().split("/") || "Unknown";
        vm.segment = path[2];

    }]);
})();