; (function () {
    angular.module('App').controller('LoginController', ['$q', '$scope', '$state', '$ionicLoading', '$ionicModal', 'AuthService', 'UserStore', function ($q, $scope, $state, $ionicLoading, $ionicModal, AuthService, UserStore) {

        var vm = this;
        vm.form = {};

        $ionicModal.fromTemplateUrl('components/login/templates/forgot_password.html', {
            scope: $scope,
        }).then(function (modal) {
            vm.mForgotPassword = modal;
        });

        $ionicModal.fromTemplateUrl('components/login/templates/register.html', {
            scope: $scope,
        }).then(function (modal) {
            vm.mRegister = modal;
        });
        
        // function to submit the form after all validation has occurred
        vm.submitLogin = function (user) {
            if (vm.loginform.$valid) {
                AuthService.Login(user).then(function (response) {
                    $scope.$parent.userInitiate(response.userName).then(function () {
                        $state.go("main.dash");
                    }), function (err) {
                        console.log("error logging user in: " + err)
                    };
                });
            }
        };

        vm.submitRegister = function (user) {
            if (vm.registerform.$valid) {
                AuthService.Register(user).then(function (UserAcct) {
                    AuthService.Login(user).then(function (response) {
                        $scope.$parent.userInitiate(response.userName);
                        $state.go('main.dash');
                    });
                });
            };
        };

        var fbLoginError = function (error) {
            console.log('fbLoginError', error);
            $ionicLoading.hide();
        };
        var fbLoginSuccess = function (response) {
            if (!response.authResponse) {
                fbLoginError("Cannot find the authResponse");
                return;
            }
            var authResponse = response.authResponse;
          
            CheckifAccountExists(authResponse).then(function (exists) {
                if (exists) {
                    $state.go('app.profile');
                    $ionicLoading.hide();
                };
            });            
        };
        // This method is to get the user profile info from the facebook api
        var getFacebookProfileInfo = function (authResponse) {
            var info = $q.defer();

            facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
              function (response) {
                  console.log(response);
                  UserStore.setUser("Facebook", authResponse.accessToken).then(function (response) {
                      var success = response;
                  });

                  info.resolve(response);
              },
              function (response) {
                  console.log(response);
                  info.reject(response);
              }
            );
            return info.promise;
        };

        var CheckifAccountExists = function (provider, token) {
            var info = $q.defer();
            return info.promise;
        }

        vm.facebookSignIn = function () {
            facebookConnectPlugin.getLoginStatus(function (success) {
                if (success.status === 'connected') {
                    console.log('getLoginStatus', success.status);

                    var authResponse = success.authResponse;
                    CheckifAccountExists("Facebook", authResponse.accessToken).then(function (exists) {
                        var stuff = exists;
                    });
                } else {
                    console.log('getLoginStatus', success.status);
                    $ionicLoading.show({
                        template: 'Checking account...'
                    });
                    facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
                }
            });
        };

        var GoogleOptions = {
            webClientId: "32004928430.apps.googleusercontent.com"
        };

        vm.googleSignIn = function () {
            $ionicLoading.show({
                template: 'Logging in...'
            });
            window.plugins.googleplus.login(GoogleOptions,
              function (user_data) {
                  // For the purpose of this example I will store user data on local storage
                  
                  $ionicLoading.hide();
                  $state.go('main.dash');
              },
              function (msg) {
                  $ionicLoading.hide();
              }
            );
        };


    }]);
})();