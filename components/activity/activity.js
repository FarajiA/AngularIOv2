; (function () {
    var app = angular.module('App');
    app.controller('ActivityController', ['$scope', '$stateParams', '$ionicPopup', 'Activity',function ($scope, $stateParams,$ionicPopup,Activity) {
        // reusable authorization
        var vm = this;
        vm.ActivityService = Activity;
        vm.imageURL = imgURL_CONSTANT;
        vm.broadcastingIndex = 0;
        vm.requestsIndex = 0;

        vm.loadRequestState = $scope.$parent.loadRequestState;
        vm.showRequests = ($stateParams.requests === "requests") || _.isEqual($scope.$parent.badge.Activity, 1);
        
        $scope.$on('update_activity', function (event, args) {
            if (args.action === "broadcasts")
                GetBroadcasters();
            if (args.action === "requests")
                GetRequests();
        });

        var unbindBroadcasters =  $scope.$watch('vm.ActivityService.broadcastingData()', function (newVal, oldVal) {
            if (_.has(newVal, 'index')) {
                vm.Broadcasting = newVal.results;
                vm.broadcastersNo = newVal.total;
                vm.moBroadcasters = (vm.broadcastersNo > countSet_CONSTANT);
                vm.broadcastingIndex++;
                unbindBroadcasters();
            }
        });

        var GetBroadcasters = function () {
            vm.broadcastingIndex = 0;
            Activity.broadcasting(vm.broadcastingIndex).then(function (data) {
                vm.Broadcasting = data.results;
                vm.broadcastersNo = data.total;
                vm.moBroadcasters = (vm.broadcastersNo < countSet_CONSTANT)
                vm.broadcastingIndex++;
            });
        };

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

        var GetRequests = function () {
            vm.requestsIndex = 0;
            Activity.requests(vm.requestsIndex).then(function (data) {
                vm.Requests = data.results;
                vm.requestsNo = data.total;
                vm.moRequests = (vm.requestsNo < countSet_CONSTANT)
                vm.requestsIndex++;
            });
        };

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

        vm.decision = function (guid, username, accept, index) {
            //$scope.requestUsername = username;
            var userRequest = {};
            if (accept) {
                userRequest = request_CONSTANT.acceptRequestMsg.replace(/0/gi, username);
                var confirmPopup = $ionicPopup.confirm({
                    title: userRequest,
                    template: ''
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        Activity.requestAccept(guid).then(function (response) {
                            var successful = response;
                            if (successful) {
                                vm.Requests.splice(index, 1);
                                vm.requestsNo = (vm.requestsNo - 1);
                                $scope.$emit('emit_Chasers', { action: "chasers" });
                            }
                            else {
                                var alertPopup = $ionicPopup.alert({
                                    title: genericError_CONSTANT
                                });
                            }
                        });
                    }
                });
            }
            else {
                userRequest = request_CONSTANT.declineRequestMsg.replace(/0/gi, username);
                var confirmPopup = $ionicPopup.confirm({
                    title: userRequest,
                    template: ''
                });
                confirmPopup.then(function (res) {
                    if (res) {
                        Activity.requestDecline(guid).then(function (response) {
                            if (response) {
                                vm.Requests.splice(index, 1);
                                vm.requestsNo = (vm.requestsNo - 1);
                            }
                        });
                    }
                });
            }
        };
                
        $scope.$watch('$parent.loadRequestState', function (newVal, oldVal) {
            vm.showRequests = newVal;
            //$scope.$parent.loadRequestState = false;
        });

    }]);
})();