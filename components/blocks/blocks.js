; (function () {
    angular.module('App').controller('BlocksController', ['$scope', '$state', '$ionicLoading', '$ionicPopup', 'Block', function ($scope, $state, $ionicLoading, $ionicPopup, Block) {
        var vm = this;
        vm.index = 0;
        vm.imageURL = $scope.$parent.imageURL;
        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;
        });

        var init = function () {           
            Block.blocks(vm.index).then(function (response) {
                vm.Blocks = response.results;
                vm.blocksNo = response.total;
                vm.index++;
                vm.moBlocks = (response.total > countSet_CONSTANT * vm.index);
            });
        };

        init();

        vm.Unblock = function (ID, username, index) {
            var confirmPopup = $ionicPopup.confirm({
                title: block_CONSTANT.unblockConfirmTitle.replace(/0/gi, username)
            });
            confirmPopup.then(function (res) {
                if (res) {
                    $ionicLoading.show({
                        template: 'Saving...'
                    });
                    Block.DeleteBlock(ID).then(function (response) {
                        if (response) {
                            vm.blocksNo--;
                            vm.Blocks.splice(index, 1);
                        }
                        else {
                            var whoopsPopup = $ionicPopup.confirm({
                                title: block_CONSTANT.unblockOops
                            });
                        }
                    }).finally(function () {
                        $ionicLoading.hide();
                    });;
                }
            });
        };

        vm.loadMoreBlockers = function () {

            vm.blocksNo = Block.data().Total;
            var pagingMax = Math.ceil($scope.blocksNo / countSet, 1);
            if ($scope.index < pagingMax && $scope.index > 0) {
                Block.blocks($scope.index).then(function (response) {
                    var merged = $scope.blocks.concat(response.Results);
                    $scope.blocks = merged;
                    $scope.index++;
                });
            }
            else if ($scope.index == pagingMax)
                $scope.noMoBlockers = true;

            $scope.$broadcast('scroll.infiniteScrollComplete');
            
        };


    }]);
})();