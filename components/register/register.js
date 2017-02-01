; (function () {

    angular.module('main').controller('RegisterController', [function () {

        var vm = this;

        /*
        // function to submit the form after all validation has occurred
        $scope.submitRegister = function (user) {
            // check to make sure the form is completely valid
            if ($scope.registerform.$valid) {
                UserObject.register(user).then(function () {
                    $scope.user = UserObject.data();
                    if ($scope.user.GUID) {
                        $rootScope.username = $scope.user.username;
                        $location.path("/dash");
                    }
                    else {
                        $scope.user = "";
                        alert("Something went wrong. Try again!");
                    }
                });
            }
        };
        */
    }]);  
})();