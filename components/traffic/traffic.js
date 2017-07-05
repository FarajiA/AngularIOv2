; (function () {
    var app = angular.module('App');
    app.controller('TrafficController', ['$scope','$rootScope', '$timeout', '$stateParams', '$ionicPopup', 'Traffic', 'UserStore', function ($scope,$rootScope, $timeout, $stateParams, $ionicPopup, Traffic, UserStore) {
        var vm = this;
        vm.TrafficService = Traffic;
        vm.imageURL = $scope.$parent.imageURL;
        vm.chasersIndex = 0;
        vm.chasingIndex = 0;

        vm.loadChasingState = $scope.$parent.loadChasingState;
        vm.showChasing = ($stateParams.chasing === "chasing") || vm.loadChasingState;
        $scope.$parent.badgeTrafficCheck()

        vm.doRefresh = function() {
            GetChasers();
            GetChasing();
        };
        /*
        $scope.$on('update_Chasers', function (event, args) {
            LoadFromBroadcast(args);
        });
        */

        $rootScope.$on('update_Chasers', function (evt, args) {
            if (args.action === "chasers")
                GetChasers();
            if (args.action === "chasing")
                GetChasing();
        });

        function LoadFromBroadcast(args) {
            if (args.action === "chasers")
                GetChasers();
            if (args.action === "chasing")
                GetChasing();
        };

        var unbindGetChasers =  $scope.$watch('vm.TrafficService.getChasers()', function (newVal, oldVal) {
            if (_.has(newVal, 'index')) {
                vm.Chasers = newVal.results;
                vm.chasersNo = newVal.total;
                vm.chasersIndex++;
                vm.moChasers = (vm.chasersNo > countSet_CONSTANT * vm.chasersIndex);
                unbindGetChasers();
            }
        });     

        var GetChasers = function () {
            vm.chasersIndex = 0;
            Traffic.chasers(vm.chasersIndex).then(function (data) {
                vm.Chasers = data.results;
                vm.chasersNo = data.total;
                vm.chasersIndex++;
                vm.moChasers = (vm.chasersNo > countSet_CONSTANT * vm.chasersIndex);
            });
        };

        vm.loadMoreChasers = function () {
            var deffered = $q.defer();
            var pagingChaserMax = Math.ceil(vm.chasersNo / countSet_CONSTANT, 1);
            if (vm.chasersIndex < pagingChaserMax && vm.chasersIndex > 0) {
                Traffic.chasers(vm.chasersIndex).then(function (data) {
                    var chaserMerged = vm.Chasers.concat(data.results);
                    vm.chasersNo = data.total;
                    vm.Chasers = chaserMerged;
                    vm.chasersIndex++;
                    vm.moChasers = (vm.chasersNo > countSet_CONSTANT * vm.chasersIndex);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    deffered.resolve();
                });
            }
            else if (vm.chasersIndex >= pagingChaserMax)
                vm.moChasers = false;

            return deffered.promise;
        };
        
       var unbindGetChasing = $scope.$watch('vm.TrafficService.getChasing()', function (newVal, oldVal) {
            if (_.has(newVal, 'index')) {
                vm.Chasing = newVal.results;
                vm.chasingNo = newVal.total;
                vm.chasingIndex++;
                vm.moChasing = (vm.chasingNo > countSet_CONSTANT * vm.chasingIndex);
                unbindGetChasing();
            }
       });

       var GetChasing = function () {
           vm.chasingIndex = 0;
           Traffic.chasing(vm.chasingIndex).then(function (data) {
               vm.Chasing = data.results;
               vm.chasingNo = data.total;
               vm.chasingIndex++;
               vm.moChasing = (vm.chasingNo > countSet_CONSTANT * vm.chasingIndex);
           });
       };

        vm.loadMoreChasing = function () {
            var deffered = $q.defer();
            var pagingChasingMax = Math.ceil(vm.chasingNo / countSet_CONSTANT, 1);
            if (vm.chasingIndex < pagingChasingMax && vm.chasingIndex > 0) {
                Traffic.chasing(vm.chasingIndex).then(function (data) {
                    var chaserMerged = vm.Chasers.concat(data.results);
                    vm.chasingNo = data.total;
                    vm.Chasers = chaserMerged;
                    vm.chasingIndex++;
                    vm.moChasing = (vm.chasersNo > countSet_CONSTANT * vm.chasingIndex);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    deffered.resolve();
                });
            }
            else if (vm.chasingIndex >= pagingChasingMax)
                vm.moChasing = false;

            return deffered.promise;
        };

        $scope.$watch('$parent.loadChasingState', function (newVal, oldVal) {
            vm.showChasing = newVal;
        });


        vm.removeChaser = function (userID, username, index) {
            var confirmPopup = $ionicPopup.confirm({
                title: _.replace(removeFollower_CONSTANT.removeUserTitle, '0', username),
                template: ''
            });
            confirmPopup.then(function (res) {
                if (res) {
                    Traffic.unfollow(userID).then(function (response) {
                        var successful = response;
                        if (successful) {
                            vm.Chasers.splice(index, 1);
                            vm.chasersNo = (vm.chasersNo - 1);
                        }
                        else 
                            var whoopsPopup = $ionicPopup.confirm({ title: block_CONSTANT.unblockOops });
                    }, function () {
                        var whoopsPopup = $ionicPopup.confirm({
                            title: block_CONSTANT.unblockOops
                        });
                    });
                } 
            });
        };


    }]);
})();