; (function () {
    angular.module('App').controller('LoginController', ['$q', '$scope', '$state', '$ionicLoading', '$ionicModal', '$ionicPopup', 'AuthService', 'UserLogin', 'UserStore', function ($q, $scope, $state, $ionicLoading, $ionicModal, $ionicPopup, AuthService, UserLogin, UserStore) {

        var vm = this;
        vm.form = {};
        vm.masterAuthReponse = {
            token: "",
            provider:""
        };

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

        $ionicModal.fromTemplateUrl('components/login/templates/verifyforgotten.html', {
            scope: $scope,
        }).then(function (modal) {
            vm.mVerifyForgotten = modal;
        });
 		
		$ionicModal.fromTemplateUrl('components/login/templates/username.html', {
            scope: $scope,
        }).then(function (modal) {
            vm.mUsername = modal;
        });

        vm.Login = function (user) {            
            if (vm.form.loginForm.$valid) {
                AuthService.Login(user).then(function (response) {
                    $scope.$parent.userInitiate(response.userName).then(function () {
                        $state.go("main.dash");
                    }), function (err) {
                        console.log("error logging user in: " + err)
                    };
                });
            }
        };

        vm.Register = function (user) {
            if (vm.form.registerForm.$valid) {
                AuthService.Register(user).then(function (UserAcct) {
                    AuthService.Login(user).then(function (response) {
                        $scope.$parent.userInitiate(response.userName);
                        $state.go('main.dash');
                    });
                });
            };
        };

        vm.forgotPassword = function (user) {
            if (vm.form.forgotForm.$valid) {
                UserLogin.forgotPassword(user.email).then(function (response) {
                    if (response) {
                        vm.notOnFile = false;
                        vm.mForgotPassword.hide();
                        vm.mVerifyForgotten.show();
                    }
                    else
                        vm.notOnFile = true;
                });
            }
        };

        vm.submitForgotten = function (user) {
            if (vm.form.verifyForm.$valid) {
                UserLogin.resetPassword(user).then(function (response) {
                    if (response) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Updated!',
                            template: 'Login with new credentials'
                        });
                        alertPopup.then(function (res) {
                            vm.mVerifyForgotten.hide();
                        });
                    }
                    else {
                        var alertPopup = $ionicPopup.alert({
                            title: genericError_CONSTANT,
                            template: 'Something went wrong, try again.'
                        });
                    }                        
                });
            }
        };

        vm.newUsername = function (username) {
            $ionicLoading.show({
                template: 'Registering...'
            });
            var user_data = {
                username: username,
                provider: vm.masterAuthReponse.provider,
                externalaccesstoken: vm.masterAuthReponse.token
            };
            AuthService.registerExternal(user_data).then(function (response) {
                $scope.$parent.userInitiate(response.userName).then(function () {
                    $state.go('main.dash');
                });
            });
        };

        var fbLoginError = function (error) {
            var alertPopup = $ionicPopup.alert({
                title: genericError_CONSTANT
            });
            $ionicLoading.hide();
        };
        var fbLoginSuccess = function (response) {
            $ionicLoading.show({
                template: 'Logging in...'
            });
            if (!response.authResponse) {
                fbLoginError("Cannot find the authResponse");
                return;
            }
            var authResponse = response.authResponse;
          
            CheckifAccountExists("Facebook", authResponse.accessToken).then(function (exists) {
                if (!exists) {
                    $ionicLoading.hide();
                    vm.mUsername.show();
                    vm.masterAuthReponse.provider = "Facebook";
                    vm.masterAuthReponse.token = authResponse.accessToken;
                };
            });
            
            
        };
       /*
        // This method is to get the user profile info from the facebook api
        var getFacebookProfileInfo = function (authResponse) {
            var info = $q.defer();

            facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
              function (response) {
                  info.resolve(response);
              },
              function (response) {
                  console.log(response);
                  info.reject(response);
              }
            );
            return info.promise;
        };
       */
        var CheckifAccountExists = function (provider, token) {
            var info = $q.defer();
            UserLogin.checkAccount(provider, token).then(function (response) {
                if (_.has(response, 'access_token')) {
                    AuthService.externalLogin(response);
                    $scope.$parent.userInitiate(response.userName).then(function () {
                        $ionicLoading.hide();
                        $state.go('main.dash');
                        info.resolve(response);
                    }), function (err) {
                        console.log("error logging user in: " + err)
                    };
                }
                else if (!reponse) {
                    info.resolve(response);
                }                
            }, function () {
                var alertPopup = $ionicPopup.alert({
                    title: genericError_CONSTANT
                });
                $ionicLoading.hide();
            });
            return info.promise;
        };

        vm.facebookSignIn = function () {
            $ionicLoading.show({
                template: 'Verifying account...'
            });
            facebookConnectPlugin.getLoginStatus(function (success) {
                if (success.status === 'connected') {
                    var authResponse = success.authResponse;
                    CheckifAccountExists("Facebook", authResponse.accessToken).then(function (exists) {
                        $ionicLoading.hide();
                        if (!exists) {
                            vm.mUsername.show();
                            authResponse.provider = "Facebook";
                            vm.masterAuthReponse = authResponse;
                        }
                    });
                } else {
                    facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
                }
            });
        };

        var GoogleOptions = {
            androidApiKey: "32004928430-fu72cmv7oom069hj7b1cr0ft45fdb5nk.apps.googleusercontent.com",
            webClientId: "32004928430-i22lnlmlsuinehebs5rv9640pi3phoos.apps.googleusercontent.com"
        };

        vm.googleSignIn = function () {
            $ionicLoading.show({
                template: 'Verifying account...'
            });
            window.plugins.googleplus.login(GoogleOptions,
              function (user_data) {
                  CheckifAccountExists("Google", user_data.idToken).then(function (response) {
                      $ionicLoading.hide();
                      if (!exists) {
                          vm.mUsername.show();
                          authResponse.provider = "Google";
                          vm.masterAuthReponse = user_data;
                      }
                  });
              },
              function (msg) {
                  $ionicLoading.hide();
              }
            );
        };


    }]);
})();