; (function () {
    angular.module('App').controller('ChasersController', ['$scope', '$stateParams', '$location', 'Chasers', function ($scope, $stateParams, $location, Chasers) {

        var vm = this;
        var userID = $stateParams.userId;
        vm.imageURL = imgURL_CONSTANT;
        vm.index = 0;
        vm.total = 0;
        //vm.noMoChasers = true;

        var chasersInit = function () {
            //$ionicLoading.show();
            Chasers.chasers(vm.index, userID).then(function (response) {
                vm.chasers = response.results;
                vm.index++;
                vm.total = response.total;
                //$ionicLoading.hide();
            }, function (error) {
               //$ionicLoading.hide();
            });
        };

        chasersInit();

        vm.loadMoreChasers = function () {
            var chasersNo = Chasers.data().total;
            var pagingMax = Math.ceil(chasersNo / countSet_CONSTANT, 1);
            if (vm.index < pagingMax && vm.index > 0) {
                Chasers.chasers(vm.index, userID).then(function (response) {
                    var merged = vm.chasers.concat(response.results);
                    vm.chasers = merged;
                    vm.index++;
                });
            }
            else if (vm.index == pagingMax)
                vm.noMoChasers = true;

            $scope.$broadcast('scroll.infiniteScrollComplete');
        };

        var path = $location.path().split("/") || "Unknown";
        vm.segment = path[2];

    }]);
})();