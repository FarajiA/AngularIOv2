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
                    if (response) {
                        $scope.$emit('emit_Broadcasting', { action: "turn-off" });
                        $scope.$parent.user.broadcasting = false;
                        $scope.$parent.user.broadcast.viewing = null;
                    }
                    else {
                        var alertPopup = $ionicPopup.alert({
                            title: genericError_CONSTANT
                        });
                    }
                });
            };
        };        

        vm.shareBroadcast = function () {
            $cordovaSocialSharing.share(shareLocation_CONSTANT.msg.replace(/0/gi, $scope.user.userName), null, null, shareLocation_CONSTANT.link + share) // Share via native share sheet
            .then(function (result) {
                // Success!
            }, function (err) {
                // An error occured. Show a message to the user
            });
            
        };


    }]);
})();