; (function () {
    angular.module('App')
        .controller('DashController', ['$scope','$state', '$ionicPopup', 'Broadcast', function ($scope, $state, $ionicPopup, Broadcast) {
        // reusable authorization
        var vm = this;       
        
        vm.broadcast = function () {
            if (!$scope.$parent.user.broadcasting)
                $state.go("dash-group");
            else {
                Broadcast.Off().then(function (response) {
                    if (response)
                        $scope.$parent.user.broadcasting = false;
                    else {
                        var alertPopup = $ionicPopup.alert({
                            title: genericError_CONSTANT
                        });
                    }
                });
            };
        };
        

    }]);
})();