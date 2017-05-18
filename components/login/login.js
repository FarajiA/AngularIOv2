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
                $ionicLoading.show();
                AuthService.Login(user).then(function (response) {
                    $scope.$parent.userInitiate(response.userName).then(function () {
                        $ionicLoading.hide();
                        $state.go("main.dash");
                    }), function (err) {
                        var alertPopup = $ionicPopup.alert({
                            title: genericError_CONSTANT
                        });
                    };
                }, function () {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: loginError_CONSTANT
                    });
                });
            }
        };

        vm.Register = function (user) {
            if (vm.form.registerForm.$valid) {
                $ionicLoading.show();
                AuthService.Register(user).then(function (UserAcct) {
                    AuthService.Login(user).then(function (response) {
                        $ionicLoading.hide();
                        $scope.$parent.userInitiate(response.userName);
                        $state.go('main.dash');
                    }, function () {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: genericError_CONSTANT2
                        });                        
                    });
                }, function () {
                    $ionicLoading.hide();
                });
            };
        };

        vm.forgotPassword = function (user) {
            if (vm.form.forgotForm.$valid) {
                $ionicLoading.show();
                UserLogin.forgotPassword(user.email).then(function (response) {
                    $ionicLoading.hide();
                    if (response) {
                        vm.notOnFile = false;
                        vm.mForgotPassword.hide();
                        vm.mVerifyForgotten.show();
                    }
                    else
                        vm.notOnFile = true;
                }, function () {
                    $ionicLoading.hide();
                });
            }
        };

        vm.submitForgotten = function (user) {
            if (vm.form.verifyForm.$valid) {
                $ionicLoading.show();
                UserLogin.resetPassword(user).then(function (response) {
                    if (response) {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: 'Updated!',
                            template: 'Login with new credentials'
                        });
                        alertPopup.then(function (res) {
                            vm.mVerifyForgotten.hide();
                        });
                    }
                    else {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: genericError_CONSTANT
                        });
                    }                        
                }, function () {
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: genericError_CONSTANT
                    });
                });
            }
        };

        vm.newUsername = function (username) {
            if (vm.form.usernameForm.$valid) {
                $ionicLoading.show({
                    template: 'Creating Account...'
                });
                var user_data = {
                    username: username,
                    provider: vm.masterAuthReponse.provider,
                    externalaccesstoken: vm.masterAuthReponse.token
                };
                AuthService.registerExternal(user_data).then(function (response) {
                    $scope.$parent.userInitiate(response.userName).then(function () {
                        vm.mUsername.hide();
                        $ionicLoading.hide();
                        $state.go('main.dash');
                    }, function () {
                        $ionicLoading.hide();
                        var alertPopup = $ionicPopup.alert({
                            title: genericError_CONSTANT
                        });
                        alertPopup.then(function (res) {
                            vm.mUsername.hide();
                        });
                    });
                });
            }
            else {
                $ionicLoading.hide();
                var alertPopup = $ionicPopup.alert({
                    title: "Username Taken"
                });
            }
        };

        var fbLoginError = function (error) {
            $ionicLoading.hide();
            var alertPopup = $ionicPopup.alert({
                title: genericError_CONSTANT
            });
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
                else if (!response) {
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
                            vm.masterAuthReponse.provider = "Facebook";
                            vm.masterAuthReponse.token = authResponse.accessToken;
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
                  CheckifAccountExists("Google", user_data.idToken).then(function (exists) {
                      $ionicLoading.hide();
                      if (!exists) {
                          vm.mUsername.show();
                          vm.masterAuthReponse.provider = "Google";
                          vm.masterAuthReponse.token = user_data.idToken;
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