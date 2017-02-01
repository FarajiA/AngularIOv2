; (function () {
    var app = angular.module('App');
    app.controller('TrafficController', ['$scope', '$timeout', '$stateParams', 'Traffic', 'UserStore', 'ionicMaterialInk', 'ionicMaterialMotion', function ($scope, $timeout, $stateParams, Traffic, UserStore, ionicMaterialInk, ionicMaterialMotion) {
        var vm = this;
        ionicMaterialMotion.fadeSlideInRight();
        vm.TrafficService = Traffic;
        vm.imageURL = imgURL_CONSTANT;
        vm.chasersIndex = 0;
        vm.chasingIndex = 0;
        /*
        var fadeSlideInRight = function () {            
           
            document.getElementsByTagName('ion-list')[0].className += ' animate-fade-slide-in-right';
            
            $timeout(function () {
                ionicMaterialMotion.fadeSlideInRight();
            }, 400);
           
            setTimeout(function () {
                ionicMaterialMotion.fadeSlideInRight();
            }, 500); 
            
        };
        fadeSlideInRight();
        */

        vm.loadChasingState = $scope.$parent.loadChasingState;
        vm.showChasing = ($stateParams.chasing === "chasing") || vm.loadChasingState;

        var unbindGetChasers = $scope.$watch('vm.TrafficService.getChasers()', function (newVal, oldVal) {
            if (_.has(newVal, 'index')) {
                vm.Chasers = newVal.results;
                vm.chasersNo = newVal.total;
                vm.moChasers = (vm.chasersNo > countSet_CONSTANT);
                vm.chasersIndex++;
                unbindGetChasers();
            }
        });

        vm.loadMoreChasers = function () {
            var deffered = $q.defer();
            var pagingChaserMax = Math.ceil(vm.chasersNo / countSet_CONSTANT, 1);
            if (vm.chasersIndex < pagingChaserMax && vm.chasersIndex > 0) {
                Traffic.chasers(vm.chasersIndex).then(function (data) {
                    var chaserMerged = vm.Chasers.concat(data.results);
                    vm.chasersNo = data.total;
                    vm.Chasers = chaserMerged;
                    vm.chasersIndex++;
                    vm.moChasers = (vm.chasersNo > countSet_CONSTANT);
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
                vm.moChasing = (vm.chasingNo > countSet_CONSTANT);
                vm.chasingIndex++;
                unbindGetChasing();
            }
        });

        vm.loadMoreChasing = function () {
            var deffered = $q.defer();
            var pagingChasingMax = Math.ceil(vm.chasingNo / countSet_CONSTANT, 1);
            if (vm.chasingIndex < pagingChasingMax && vm.chasingIndex > 0) {
                Traffic.chasing(vm.chasingIndex).then(function (data) {
                    var chaserMerged = vm.Chasers.concat(data.results);
                    vm.chasingNo = data.total;
                    vm.Chasers = chaserMerged;
                    vm.chasingIndex++;
                    vm.moChasing = (vm.chasersNo > countSet_CONSTANT);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    deffered.resolve();
                });
            }
            else if (vm.chasingIndex >= pagingChasingMax)
                vm.moChasers = false;

            return deffered.promise;
        };

        $scope.$watch('$parent.loadChasingState', function (newVal, oldVal) {
            vm.showChasing = newVal;
        });





    }]);
})();