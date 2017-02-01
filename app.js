const baseURL_CONSTANT = "http://localhost:59822/";
const imgURL_CONSTANT = baseURL_CONSTANT + "photos/";
const signalRURL_CONSTANT = baseURL_CONSTANT + "socketpocket";
const clientID_CONSTANT = "ngAuthApp";
const refreshTokenLife_CONSTANT = 7;
const countSet_CONSTANT = 20;
const AllChasers_CONSTANT = "0";
const AnyoneWithLink_CONSTANT = "1";
const Everyone_CONSTANT = "2";
const Group_CONSTANT = "3";

const genericError_CONSTANT = "Oops try again";
const newMesssageTitle_CONSTANT = "New Message";
const newRequestTitle_CONSTANT = "New Request";
const newChasingTitle_CONSTANT = "Accepted Request";
const newChaserTitle_CONSTANT = "New Chaser";
const newBroadcastingTitle_CONSTANT = "New Broadcast";
const newBroadcasting_CONSTANT = "{0} is broadcasting";
const newMesssage_CONSTANT = "{0} sent you a message.";
const newRequest_CONSTANT = "{0} sent you a request.";
const newChasing_CONSTANT = "{0} accepted your request.";
const newChaser_CONSTANT = "{0} started chasing you.";
const composeNewMsg_CONSTANT = "Enter message";
const groupDeleteConfirmTitle_CONSTANT = "Delete {0} group?";
const groupAddButtonText_CONSTANT = "Add Group";
const groupSaveButtonText_CONSTANT = "Save Changes";
const groupEditGroup_CONSTANT = "Edit Group";
const groupNewGroup_CONSTANT = "New Group";
const groupMax_CONSTANT = "10 members maximum";

ionic.Gestures.gestures.Hold.defaults.hold_threshold = 20;

var app = angular.module('App',
        ['ionic',
        'oc.lazyLoad',
        'LocalStorageModule',
        'toaster',
        'irontec.simpleChat',
        'mdChips'//,
        /*
        'App.Activity',
        'App.Messages',
        'App.Traffic',
        'App.Dash'
        */
]);


app.run(function (AuthService, Encryption, $state, $rootScope, $ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
   
    AuthService.fillAuthData();
    Encryption.fillKeyData();
    
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        var authdata = AuthService.authentication;

        if ($rootScope.stateChangeBypass || toState.name === 'login' || toState.name == 'register') {
            $rootScope.stateChangeBypass = false;
            return;
        }

        event.preventDefault();

        if (authdata.isAuth) {
            $rootScope.stateChangeBypass = true;
            $state.go(toState, toParams);
        }
        else 
            $state.go('login');
    });
    
});

app.config(RouteMethods, ocLazyLoadProvider);
RouteMethods.$inject = ["$stateProvider", "$urlRouterProvider", "$httpProvider", "$ionicConfigProvider", "$provide"];
ocLazyLoadProvider.$inject = ["$ocLazyLoadProvider"];

function RouteMethods($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider, $provide) {

    // Turn off caching for demo simplicity's sake
    //$ionicConfigProvider.views.maxCache(0);

    /*
    // Turn off back button text
    $ionicConfigProvider.backButton.previousTitleText(false);
    */
    $provide.decorator('mdChipsDirective', function ($delegate, $injector) {
        var directive, link;
        directive = $delegate[0];
        link = directive.link;
        directive.compile = function () {
            return function Link(scope, element, attrs, ctrls) {
                var SearchService = $injector.get("Search");
                var rootscope = $injector.get("$rootScope");
                element.bind('input', function (event) {
                    if (event.target.value) {
                        SearchService.search(event.target.value, 0);
                    }
                });

                return link.apply(this, arguments);
            };
        };
        return $delegate;
    });


    $stateProvider.state('main', {
        url: '/main',
        abstract: true,
        templateUrl: 'shared/templates/tabs.html'
    })
      .state('main.dash', {
          url: '/dash',
          views: {
              'main-dash': {
                  templateUrl: 'components/dash/dash.html',
                  controller: 'DashController as vm'
              }
          },
          resolve: {
              loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'dash',
                      files: [
                          'components/dash/dash.js',
                      ]
                  });
              }],
              data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                  $ionicSideMenuDelegate.canDragContent(true);
              }]
          }
      })
      .state('main.traffic', {
          url: '/traffic/:chasing',
          views: {
              'main-traffic': {
                  templateUrl: 'components/traffic/traffic.html',
                  controller: 'TrafficController as vm'
              }
          },
          resolve: {
              loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'traffic',
                      files: [
                          'components/traffic/traffic.js'
                      ]
                  });
              }],
              data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                  $ionicSideMenuDelegate.canDragContent(false);
              }]
          }
      })
      .state('main.traffic-detail', {
          url: '/traffic/user/:username',
          views: {
              'main-traffic': {
                  templateUrl: 'components/user/user.html',
                  controller: 'UserController as vm'
              }
          },
          resolve: {
              loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'trafficDetails',
                      files: [
                          //'lib/angular-simple-logger.js',
                          //'lib/angular-google-maps.js',
                          'components/user/userServices.js',
                          'components/user/user.js',
                          'components/user/userDirectives.js',
                          'components/blocks/blocksServices.js'
                      ]
                  });
              }],
              data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                  $ionicSideMenuDelegate.canDragContent(false);
              }]
          }
      })
      .state('main.activity', {
          url: '/activity/:requests',
          views: {
              'main-activity': {
                  templateUrl: 'components/activity/activity.html',
                  controller: 'ActivityController as vm'
              }
          },
          resolve: {
              loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'activity',
                      files: [
                          'components/activity/activity.js'
                      ]
                  });
              }],
              data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                  $ionicSideMenuDelegate.canDragContent(false);
              }]
          }
      })
      .state('main.activity-detail', {
          url: '/activity/user/:username',
          views: {
              'main-activity': {
                  templateUrl: 'components/user/user.html',
                  controller: 'UserController as vm'
              }
          },
          resolve: {
              loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'activityDetails',
                      files: [
                          //'lib/angular-simple-logger.js',
                          //'lib/angular-google-maps.js',
                          'components/user/userServices.js',
                          'components/user/user.js',
                          'components/user/userDirectives.js',
                          'components/blocks/blocksServices.js'
                      ]
                  });
              }],
              data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                  $ionicSideMenuDelegate.canDragContent(false);
              }]
          }
      })
      .state('main.messages', {
          url: '/messages',
          views: {
              'main-messages': {
                  templateUrl: 'components/messages/messages.html',
                  controller: 'MessagesController as vm'
              }
          },
          resolve: {
              loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'messages',
                      files: [
                          'components/messages/messages.js',
                          'components/messages/messagesFilters.js'
                      ]
                  });
              }],
              data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                  $ionicSideMenuDelegate.canDragContent(false);
              }]
          }
      })
      .state('main.messages-thread', {
          url: '/messages/:userID',
          views: {
              'main-messages': {
                  templateUrl: 'components/messages/thread/thread.html',
                  controller: 'ThreadController as vm'
              }
          },
          resolve: {
              loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'thread',
                      files: [
                          'components/messages/thread/thread.js',
                          'components/messages/messagesFilters.js',
                          'components/messages/thread/threadDirectives.js',
                          'components/messages/thread/threadServices.js'
                      ]
                  });
              }],
              data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                  $ionicSideMenuDelegate.canDragContent(false);
              }]
          }
      })
      .state('main.messages-compose', {
          url: '/messages-compose',
          views: {
              'main-messages': {
                  templateUrl: 'components/messages/compose/compose.html',
                  controller: 'ComposeController as vm'
              }
          },
          resolve: {
              loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'compose',
                      files: [
                          'components/messages/compose/compose.js',
                          'components/messages/thread/threadServices.js',
                          'components/search/searchServices.js'
                      ]
                  });
              }],
              data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                  $ionicSideMenuDelegate.canDragContent(false);
              }]
          }
      })
      .state('login', {
          url: '/login',
          templateUrl: 'components/login/login.html',
          controller: 'LoginController as vm',
          resolve: {
              loadExternals: [
                  '$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load({
                          name: 'login',
                          files: [
                              'lib/angular-messages.js',
                              'components/login/login.js',
                              'components/login/loginServices.js',
                              'components/login/loginDirectives.js'
                          ]
                      });
                  }
              ]
          }
      })
      .state('groups', {
          url: '/groups',
          templateUrl: 'components/groups/groups.html',
          controller: 'GroupsController as vm',
          resolve: {
              loadExternals: [
                  '$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load({
                          name: 'groups',
                          files: [
                              'components/groups/groups.js',
                              'components/groups/groupServices.js'
                          ]
                      });
                  }
              ]
          }
      })
      .state('group-edit', {
          url: '/groups/edit/:groupID',
          templateUrl: 'components/groups/edit/editGroups.html',
          controller: 'AddEditController as vm',
          resolve: {
              loadExternals: [
                  '$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load({
                          name: 'groupsAddEdit',
                          files: [
                            'components/groups/edit/editGroups.js',
                            'components/groups/edit/editGroupsDirectives.js',
                            'components/search/searchServices.js'
                          ]
                      });
                  }
              ]
          }
      })
      .state('dash-group', {
          url: '/dash/groups',
          templateUrl: 'components/dash/groups/groups.html',
          controller: 'DashGroupController as vm',
          resolve: {
              loadExternals: [
                  '$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load({
                          name: 'dashgroups',
                          files: [
                              'components/dash/groups/groups.js',
                              'components/groups/groupServices.js',
                              'components/dash/dashServices.js'
                          ]
                      });
                  }
              ]
          }
      });

    
    $urlRouterProvider.otherwise(function ($injector) {
        var $state = $injector.get("$state");
        $state.go("main.dash");
    });
    
    $httpProvider.interceptors.push('authInterceptorService');
};

function ocLazyLoadProvider($ocLazyLoadProvider) {
    $ocLazyLoadProvider.config({
        debug: true
    });
};

/************ Factory Services **********/
// Store and Process User data
app.factory('AuthService', ['$http', '$q', 'localStorageService', 'UserStore', function ($http, $q, localStorageService, UserStore) {

    var authServiceFactory = this;

    authServiceFactory.authentication = {
        isAuth: false,
        userName: "",
        token: "",
        refreshToken: "",
        refreshTokenExp: ""
    };

    authServiceFactory.externalAuthData = {
        provider: "",
        userName: "",
        externalAccessToken: ""
    };

    authServiceFactory.Register = function (registration) {

        authServiceFactory.logOut();
        var deferred = $q.defer();

        $http.post(baseURL_CONSTANT + 'api/accounts/register', registration, { skipAuthorization: true }).success(function (response) {
            deferred.resolve(response.result);
        }).error(function (err, status) {
            authServiceFactory.logOut();
            deferred.reject(err);
        });

        return deferred.promise;
    };

    authServiceFactory.Login = function (loginData) {

        var data = "grant_type=password&username=" + loginData.username + "&password=" + loginData.password + "&client_id=" + clientID_CONSTANT;;

        var deferred = $q.defer();
        var date = new Date();

        $http.post(baseURL_CONSTANT + 'oauth/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, skipAuthorization: true }).success(function (response) {

            var refreshTokenDate = date.setDate(date.getDate() + refreshTokenLife_CONSTANT);
            localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.username, refreshToken: response.refresh_token, refreshExpiration: refreshTokenDate });

            authServiceFactory.authentication.isAuth = true;
            authServiceFactory.authentication.userName = response.userName;
            authServiceFactory.authentication.token = response.access_token;
            authServiceFactory.authentication.refreshToken = response.refresh_token;
            authServiceFactory.authentication.refreshTokenExp = refreshTokenDate;
            deferred.resolve(response);

        }).error(function (err, status) {
            authServiceFactory.logOut();
            deferred.reject(err);
        });

        return deferred.promise;
    };

    authServiceFactory.logOut = function () {

        localStorageService.remove('authorizationData');

        authServiceFactory.authentication.isAuth = false;
        authServiceFactory.authentication.userName = "";
        authServiceFactory.authentication.token = "";
        authServiceFactory.authentication.refreshToken = "";
        authServiceFactory.authentication.refreshTokenExp = "";
    };

    authServiceFactory.fillAuthData = function () {
        var authData = localStorageService.get('authorizationData');
        if (authData) {
            authServiceFactory.authentication.isAuth = true;
            authServiceFactory.authentication.userName = authData.userName;
            authServiceFactory.authentication.token = authData.token;
            authServiceFactory.authentication.refreshToken = authData.refreshToken;
            authServiceFactory.authentication.refreshTokenExp = authData.refreshTokenExp;
        }
    };

    authServiceFactory.refreshToken = function () {
        var deferred = $q.defer();

        var authData = localStorageService.get('authorizationData');
        if (authData) {

            var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + clientID_CONSTANT;
            localStorageService.remove('authorizationData');
            var date = new Date();
            $http.post(baseURL_CONSTANT + 'oauth/token', data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, skipAuthorization: true }).success(function (response) {
                var refreshTokenDate = date.setDate(date.getDate() + 7);
                localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, refreshExpiration: refreshTokenDate });

                authServiceFactory.authentication.isAuth = true;
                authServiceFactory.authentication.userName = response.userName;
                authServiceFactory.authentication.token = response.access_token;
                authServiceFactory.authentication.refreshToken = response.refresh_token;
                authServiceFactory.authentication.refreshTokenExp = refreshTokenDate;

                deferred.resolve(response);
            }).error(function (err, status) {
                authServiceFactory.logOut();
                deferred.reject(err);
            });
        }

        return deferred.promise;
    };

    authServiceFactory.obtainAccessToken = function (externalData) {

        var deferred = $q.defer();

        $http.get(baseURL_CONSTANT + 'api/account/ObtainLocalAccessToken', { params: { provider: externalData.provider, externalAccessToken: externalData.externalAccessToken } }).success(function (response) {
            localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

            authServiceFactory.authentication.isAuth = true;
            authServiceFactory.authentication.userName = response.userName;
            authServiceFactory.authentication.useRefreshTokens = false;

            deferred.resolve(response);
        }).error(function (err, status) {
            authServiceFactory.logOut();
            deferred.reject(err);
        });

        return deferred.promise;

    };

    authServiceFactory.registerExternal = function (registerExternalData) {

        var deferred = $q.defer();

        $http.post(baseURL_CONSTANT + 'api/account/registerexternal', registerExternalData).success(function (response) {

            localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: "", useRefreshTokens: false });

            authServiceFactory.authentication.isAuth = true;
            authServiceFactory.authentication.userName = response.userName;
            authServiceFactory.authentication.useRefreshTokens = false;

            deferred.resolve(response);

        }).error(function (err, status) {
            authServiceFactory.logOut();
            deferred.reject(err);
        });

        return deferred.promise;
    };

    return authServiceFactory;
}]);

app.factory('authInterceptorService', ['$q', '$rootScope', '$injector', 'localStorageService', function ($q, $rootScope, $injector, localStorageService) {

    var authInterceptorServiceFactory = {};

    var _request = function (config) {

        if (config.skipAuthorization) {
            return config;
        }

        config.headers = config.headers || {};

        var authData = localStorageService.get('authorizationData');
        if (authData) {
            config.headers.Authorization = 'Bearer ' + authData.token;
        }

        return config;
    };

    var _responseError = function (rejection) {
        if (rejection.status === 401) {
            var authService = $injector.get('AuthService');
            var jwtHelper = $injector.get('jwtHelper');
            var state = $injector.get('$state');
            var authData = localStorageService.get('authorizationData');

            var date = jwtHelper.getTokenExpirationDate(authData.token);
            var expired = jwtHelper.isTokenExpired(authData.token);

            authService.refreshToken().then(function (response) {
                $rootScope.$emit("tokenRefreshed");
                console.log("refresh token");
            },
             function (err) {
                 console.log("an error");
                 state.go("login");
             });

            authService.logOut();
        }
        return $q.reject(rejection);
    };

    authInterceptorServiceFactory.request = _request;
    authInterceptorServiceFactory.responseError = _responseError;

    return authInterceptorServiceFactory;
}]);



app.controller('mainController', ['$scope', '$q', '$state', '$stateParams', '$ionicModal', 'AuthService', 'Encryption', 'UserStore', 'Traffic', 'Activity', 'Messages', 'CentralHub', 'toaster', function ($scope, $q, $state, $stateParams, $ionicModal, AuthService, Encryption, UserStore, Traffic, Activity, Messages, CentralHub, $toaster) {

    var mc = this;
    
    $scope.user = UserStore.data();

    $scope.loadRequestState = false;
    $scope.loadChasingState = false;

    $scope.proxyCentralHub = null;

    $scope.activeThread = {};
    $scope.showTabs = {};
    $scope.showTabs.show = true;

    $scope.shareLink = "";
    mc.showShare = $scope.shareLink.length > 0;

    var authdata = AuthService.authentication;
    $scope.badge = {
        Activity: "",
        Traffic: "",
        Messages: ""
    };

    mc.badgeTrafficCheck = function () {
        if (_.isEqual($scope.badge.Traffic, 1)) {
            Traffic.viewed().then(function (response) {
                $scope.badge.Traffic = 0;
            });
        }
    };

    mc.badgeActivityCheck = function () {
        if (_.isEqual($scope.badge.Activity, 1)) {
            $scope.loadRequestState = true;
            Activity.viewed().then(function (response) {
                $scope.badge.Activity = 0;
            });
        }
    };

    mc.badgeMessageCheck = function (msgsArray) {
        if (_.isEqual($scope.badge.Messages, 1)) {
            var messages = _.some(msgsArray.results, ['viewed', false]);
        }
    };

    $ionicModal.fromTemplateUrl('passphrase.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        mc.phraseModal = modal;
    });

    $scope.openModal = function () {
        mc.phraseModal.show();
    };
    $scope.closeModal = function () {
        mc.phraseModal.hide();
    };

    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        mc.phraseModal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });

    $scope.userInitiate = function () {
        var deffered = $q.defer();
        UserStore.setUser().then(function (response) {
            $scope.user = response;
            Encryption.Key.publicKey = response.publicKey;
            $q.all([
                Traffic.chasers(0),
                Traffic.chasing(0),
                Activity.broadcasting(0),
                Activity.requests(0),
                Messages.inbox(0)
            ]).then(function (value) {
                // Success callback where value is an array containing the success values
                var newChasers = _.some(value[0].results, ['viewed', false]);
                var newBroadcasters = _.some(value[2].results, ['viewed', false]);
                var newRequests = _.some(value[3].results, ['viewed', false]);
                var newMessages = _.some(value[4].results, ['viewed', false]);

                $scope.badge.Activity = newRequests ? 1 : "";
                $scope.badge.Traffic = newChasers ? 1 : "";
                $scope.badge.Messages = newMessages ? 1 : "";

                if ($state.current.name === 'main.activity')
                    mc.badgeActivityCheck();
                if ($state.current.name === 'main.traffic')
                    mc.badgeTrafficCheck();

                $scope.proxyCentralHub = CentralHub.initialize('centralHub');
                deffered.resolve(true);
            }, function (reason) {
                // Error callback where reason is the value of the first rejected promise
                deffered.reject(reason);
            });
        }, function (error) {
            deffered.reject(error);
        }).finally(function () {
            mc.loadingDone = true;

            if (_.isEmpty(Encryption.Key.privateKey))
                mc.phraseModal.show();
        });

        return deffered.promise;
    };

    if (authdata.isAuth) {
        $scope.userInitiate();
    }
    else {
        mc.loadingDone = true;
    }

    $scope.$parent.$on("centralHubNotification", function (e, notify) {
        var title;
        var text;
        var state;

        switch (notify.type) {
            case 0:
                Traffic.chasers(0);
                title = newChaserTitle_CONSTANT;
                text = newChasing_CONSTANT;
                state = "main.traffic";
                if ($state.current.name != state)
                    $scope.badge.Traffic = 1;
                break;
            case 1:
                Activity.requests(0);
                title = newRequestTitle_CONSTANT;
                text = newRequest_CONSTANT;
                state = "main.activity";
                if ($state.current.name != state)
                    $scope.badge.Activity = 1;
                $scope.$apply(function () {
                    $scope.loadRequestState = true;
                });
                break;
            case 2:
                Traffic.chasing(0);
                title = newChasingTitle_CONSTANT;
                text = newChasing_CONSTANT;
                state = "main.traffic";
                if ($state.current.name != state)
                    $scope.badge.Traffic = 1;
                $scope.$apply(function () {
                    $scope.loadChasingState = true;
                });
                break;
            case 3:
                Activity.broadcasting(0);
                title = newBroadcastingTitle_CONSTANT;
                text = newBroadcasting_CONSTANT;
                state = "main.activity"
                break;
            case 4:
                Messages.inbox(0);
                title = newMesssageTitle_CONSTANT;
                text = newMesssage_CONSTANT;
                state = "main.messages";
                break;
        }

        $scope.$apply(function () {
            if ($state.current.name != "main.messages-thread") {
                $toaster.pop('success', notify.username, title /*_.replace(text, '{0}', notify.username) */, "", 'trustedHtml', function (toaster) {
                    $state.go(state);
                    return true;
                });
            }
        });
    });

    $scope.$parent.$on("tokenRefreshed", function () {
        $scope.userInitiate();
    });

    $scope.$parent.$on("centralHubMessage", function (e, message) {

        if ($state.current.name == "main.messages-thread") {
            var stateParams = $stateParams.userID;
            var activeMessage = Messages.active();

            if (activeMessage.corresponder == message.corresponder) {
                Messages.updateActive(message).then(function () {
                    $scope.activeThread = message;
                });

                var msgResults = Messages.inboxMessages();
                message.viewed = true;
                Messages.viewed(message.corresponder).then(function (response) {
                    Messages.updateThread(message, false);
                });
            }
        }
        else
            Messages.updateThread(message, true).then(function (response) {
                $scope.badge.Messages = 1;
            });
    });


    $scope.$parent.$on("centralHubBroadcast", function (e, coords) {
        $scope.$broadcast('mapUpdate', { coords })
    });

    mc.CheckBadge = function (badge) {
        switch (badge) {
            case 0:
                mc.badgeTrafficCheck();
                break;
            case 1:
                mc.badgeActivityCheck();
                break;
            case 2:
                if (_.isEqual($scope.badge.Messages, 1)) {
                    $scope.badge.Messages = 0;
                }
                break;
        }
    };

    mc.showDangToast = function () {
        $toaster.pop('success', 'New Thang', 'Notification stuff goes here', "", 'trustedHtml', function (toaster) {
            console.log("stuff yea whatever");
            return true;
        });
    };

    mc.savePhrase = function () {
        if (_.isEmpty(Encryption.Key.publicKey)) {
            Encryption.generatePrivateKey(_.toLower(mc.passPhrase).replace(/\s+/g, '')).then(function (response) {
                if (response)
                    mc.phraseModal.hide();
            });
        }
        else {
            Encryption.verifyPassphrase(_.toLower(mc.passPhrase).replace(/\s+/g, '')).then(function (response) {
                if (response) {
                    Encryption.generatePrivateKey(_.toLower(mc.passPhrase).replace(/\s+/g, '')).then(function (response) {
                        if (response)
                            mc.phraseModal.hide();
                    });
                }
                else {
                    console.log("Didn't Match");
                }
            });
        }
    };
    
}]);
