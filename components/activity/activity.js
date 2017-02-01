; (function () {
    var app = angular.module('App');
    app.controller('ActivityController', ['$scope', '$stateParams', 'Activity', function ($scope, $stateParams, Activity) {
        // reusable authorization
        var vm = this;
        vm.ActivityService = Activity;
        vm.imageURL = imgURL_CONSTANT;
        vm.broadcastingIndex = 0;
        vm.requestsIndex = 0;

        vm.loadRequestState = $scope.$parent.loadRequestState;
        vm.showRequests = ($stateParams.requests === "requests") || _.isEqual($scope.$parent.badge.Activity, 1);
        
        var unbindBroadcasters = $scope.$watch('vm.ActivityService.broadcastingData()', function (newVal, oldVal) {
            if (_.has(newVal, 'index')) {
                vm.Broadcasting = newVal.results;
                vm.broadcastersNo = newVal.total;
                vm.moBroadcasters = (vm.broadcastersNo > countSet_CONSTANT);
                vm.broadcastingIndex++;
                unbindBroadcasters();
            }
        });

        vm.loadMoreBroadcasters = function () {
            var deffered = $q.defer();
            var pagingBroadcastingMax = Math.ceil(vm.broadcastingIndex / countSet, 1);
            if (vm.broadcastingIndex < pagingBroadcastingMax && vm.broadcastingIndex > 0) {
                Activity.broadcasting(vm.broadcastingIndex).then(function (data) {
                    var merged = vm.Broadcasting.concat(data.results);
                    vm.broadcastersNo = data.total;
                    vm.Broadcasting = merged;
                    vm.moBroadcasters = (vm.broadcastersNo < countSet_CONSTANT)
                    vm.broadcastingIndex++;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    deffered.resolve();
                });
            }
            else if (vm.broadcastingIndex >= pagingBroadcastingMax)
                vm.moBroadcasters = false;

            return deffered.promise;
        };

        var unbindRequests = $scope.$watch('vm.ActivityService.requestsData()', function (newVal, oldVal) {
            if (_.has(newVal, 'index')) {
                vm.Requests = newVal.results;
                vm.requestsNo = newVal.total;
                vm.moRequests = (vm.requestsNo > countSet_CONSTANT);
                vm.broadcastingIndex++;
                unbindRequests();
            }
        });


        vm.loadMoreRequests = function () {
            var deffered = $q.defer();
            var pagingRequestMax = Math.ceil(vm.requestsIndex / countSet, 1);
            if (vm.requestsIndex < pagingRequestMax && vm.requestsIndex > 0) {
                Activity.requests(vm.requestsIndex).then(function (data) {
                    var merged = vm.Requests.concat(data.results);
                    vm.requestsNo = data.total;
                    vm.Requests = merged;
                    vm.moRequests = (vm.requestsNo < countSet_CONSTANT)
                    vm.requestsIndex++;
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    deffered.resolve();
                });
            }
            else if (vm.requestsIndex >= pagingRequestMax)
                vm.moRequests = false;

            return deffered.promise;
        };

        
        $scope.$watch('$parent.loadRequestState', function (newVal, oldVal) {
            vm.showRequests = newVal;
            //$scope.$parent.loadRequestState = false;
        });

    }]);
})();