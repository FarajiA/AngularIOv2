; (function () {
    angular.module('App').controller('ChasingController', ['$scope', '$stateParams', '$location', 'Chasing', function ($scope, $stateParams, $location, Chasing) {

        var vm = this;
        var userID = $stateParams.userId;
        vm.imageURL = imgURL_CONSTANT;
        vm.total = 0;
        vm.index = 0;

        var chasingInit = function () {
            //$ionicLoading.show();
            Chasing.chasing(vm.index, userID).then(function (response) {
                vm.chasing = response.results;
                vm.total = response.total;
                vm.index++;
                //$ionicLoading.hide();
            }, function (error) {
                //$ionicLoading.hide();
            });
        };

       chasingInit();

       vm.loadMoreChasing = function () {
            var chasersNo = vm.total;
            var pagingMax = Math.ceil(chasersNo / countSet_CONSTANT, 1);
            if (vm.index < pagingMax && vm.index > 0) {
                Chasers.chasing(vm.index, userID).then(function (response) {
                    var merged = vm.chasing.concat(response.results);
                    vm.chasing = merged;
                    vm.index++;
                });
            }
            else if (vm.index == pagingMax)
                vm.noMoChasing = true;

            $scope.$broadcast('scroll.infiniteScrollComplete');
        };

        var path = $location.path().split("/") || "Unknown";
        vm.segment = path[2];

    }]);
})();