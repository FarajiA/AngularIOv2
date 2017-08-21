const baseURL_CONSTANT = "https://ch-mo.com/";
//const baseURL_CONSTANT = "http://localhost:59822/";
const imgURL_CONSTANT = baseURL_CONSTANT + "photos/";
const signalRURL_CONSTANT = baseURL_CONSTANT + "socketpocket";
const clientID_CONSTANT = "ngAuthApp";
const refreshTokenLife_CONSTANT = 7;
const countSet_CONSTANT = 20;
const msgCountSet_CONSTANT = 10;
const AllChasers_CONSTANT = "0";
const AnyoneWithLink_CONSTANT = "1";
const Everyone_CONSTANT = "2";
const Group_CONSTANT = "3";

const genericError_CONSTANT = "Oops try again";
const genericError_CONSTANT2 = "Something went wrong. Try again";
const loginError_CONSTANT = "We don't know you";
const newMesssageTitle_CONSTANT = "New Message";
const newRequestTitle_CONSTANT = "New Request";
const newChasingTitle_CONSTANT = "Accepted Request";
const newChaserTitle_CONSTANT = "New Follower";
const newBroadcastingTitle_CONSTANT = "Broadcasting";
const newBroadcasting_CONSTANT = "0 is broadcasting";
const newMesssage_CONSTANT = "0 sent you a message.";
const newRequest_CONSTANT = "0 sent you a request.";
const newChasing_CONSTANT = "0 accepted your request.";
const newChaser_CONSTANT = "0 started following you.";
const newViewing_CONSTANT = "{0} watching, {1} views";
const composeNewMsg_CONSTANT = "Message";
const groupDeleteConfirmTitle_CONSTANT = "Delete 0 group?";
const groupAddButtonText_CONSTANT = "Add Group";
const groupSaveButtonText_CONSTANT = "Save Changes";
const groupEditGroup_CONSTANT = "Edit Group";
const groupNewGroup_CONSTANT = "New Group";
const groupMax_CONSTANT = "10 members maximum";
const userBroadcasting_CONSTANT = {
    broadcasting: 'Broadcasting',
    notBroadcasting: 'Not broadcasting',
    broadcastGroupConflictTitle: 'Unable to delete',
    broadcastGroupConflict: 'You are currently broadcasting to this group, broadcast must end first.'
};
const decision_CONSTANT = {
    following: 'Following',
    follow: 'Follow',
    requested: 'Requested',
    unblock: 'Unblock',
    block: 'Block'
};
const block_CONSTANT = {
    blockedConfirmTitle: 'Are you sure?',
    blockedCompletedTitle: '0 has been blocked!',
    blockedCompletedText: 'This user will no longer be able to view your profile or location.',
    unblockConfirmTitle: 'Unblock 0?',
    unblockOops: 'Oops! Something went wrong, try again.'
};
var reporting_CONSTANT = {
    flaggedTitle: '0 reported!',
    flaggedText: 'All reports are taken seriously and will be reviewed. Thanks.'
};
const request_CONSTANT = {
    acceptRequest: 'Accept',
    declineRequest: 'Decline',
    acceptRequestMsg: 'Allow 0 to follow you?',
    declineRequestMsg: "Reject 0's request?",
    acceptRequestSuccess: '0 accepted',
    declineRequestSuccess: '0 declined'
};
const invite_CONSTANT = {
    msg : 'Add me on Chaser! Username: 0',
    subject: 'Super Tight Invite',
    link: 'http://chasertheapp.com/invite'
};
const shareLocation_CONSTANT = {
    msg: 'Follow the route of 0 on Chaser.',
    link: baseURL_CONSTANT + 'broadcast/'
};
const maps_CONSTANT = {
    title: 'Location services off',
    text: 'To see your position turn on location services',
    error: 'Location services off',
    Errortitle: 'Map failed, sorry dawg',
    NolongerBroadcasting: '0 is no longer broadcasting'
};
const broadcast_CONSTANT = {
    allfollowers: "Allows only your followers to view your location.",
    anyoneLink: "We provide a link. Only those with it can view your location.",
    anyoneEvery: "We provide a link & anyone can view your location. Following or not."
};
const passphrase_CONSTANT = {
    didntmatch_title: "Doesn't match",
    didntmatch_text: "You can still use this passphrase your previous messages will not be decoded.",
    create: "Create",
    enter: "Enter",
    helpText: "Your passphrase is used to create an encryption key for your messages. Remember this phrase if you plan on using this account on multiple devices."
};
const removeFollower_CONSTANT = {
    removeUserTitle: 'remove 0?',
    successfullyDeleted: '0 is no longer following you.'
};

ionic.Gestures.gestures.Hold.defaults.hold_threshold = 20;
var app = angular.module('App',
        ['ionic',
        'oc.lazyLoad',
        'LocalStorageModule',
        'toastr',
        'mdChips',
        'ngCordova',
        'toastr',
        'ngImgCrop',
        'uiGmapgoogle-maps'
        /*
        'App.Activity',
        'App.Messages',
        'App.Traffic',
        'App.Dash'
        */
]);

app.run(function (AuthService, Encryption, $state, $rootScope, $ionicPlatform, $templateCache) {
       
    $ionicPlatform.ready(function () {
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

    $rootScope.$on('emit_Chasers', function (event, args) {
        $rootScope.$broadcast('update_Chasers', args);
    });

    $rootScope.$on('emit_Activity', function (event, args) {
        $rootScope.$broadcast('update_activity', args);
    });

    $rootScope.$on('emit_NewMessage', function (event, args) {
        $rootScope.$broadcast('update_thread', args);
    });
    
    $rootScope.$on('emit_Broadcasting', function (event, args) {
        $rootScope.$broadcast('update_location', args);
    });
    /*
    $rootScope.$on('emit_UserView', function (event, args) {
        $rootScope.$broadcast('turnOn_locationWatch', args);
    });
    $rootScope.$on('emit_Chasers_Block', function (event, args) {
        $rootScope.$broadcast('update_Chasers_block', args);
    });
    */
    
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
    
    $templateCache.put('directives/toast/toast.html',
        "<div id=\"{{extraData.id}}\" class=\"{{toastClass}} {{toastType}}\" ng-click=\"tapToast()\">\n <div ng-switch on=\"allowHtml\">\n <ion-item class=\"item-icon-right item item-complex\" type=\"item-text-wrap\" href=\"javascript:void(0)\" ng-class=\" {'item-avatar': (extraData.type != 5)}  \" ><img ng-if=\"extraData.type != 5\" ng-src=\"{{extraData.photo && extraData.url + extraData.id + '.png' || 'img/default_avatar.png' }}\"><h2 ng-if=\"extraData.type != 5\">{{title}}</h2><p>{{message}}</p><i class=\"icon {{extraData.icon}}\"></i></ion-item><div ng-switch-when=\"true\" ng-if=\"title\" class=\"{{titleClass}}\" ng-bind-html=\"title\"></div>\n<div ng-switch-when=\"true\" class=\"{{messageClass}}\" ng-bind-html=\"message\"></div>\n  </div>\n<progress-bar ng-if=\"progressBar\"></progress-bar>\n</div>\n"
    );
});

app.config(RouteMethods, ocLazyLoadProvider);
RouteMethods.$inject = ["$stateProvider", "$urlRouterProvider", "$httpProvider", "$ionicConfigProvider", "$provide", "toastrConfig", "uiGmapGoogleMapApiProvider"];
ocLazyLoadProvider.$inject = ["$ocLazyLoadProvider"];

function RouteMethods($stateProvider, $urlRouterProvider, $httpProvider, $ionicConfigProvider, $provide, toastrConfig, uiGmapGoogleMapApiProvider) {

    $ionicConfigProvider.backButton.previousTitleText(false).text('');
    $ionicConfigProvider.tabs.position('bottom');

    uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyC4SnjNGk2uAkaSZHnT6auYwgA-79Qky1M'
    })

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
   
    angular.extend(toastrConfig, {
        iconClasses: {
            error: 'toast-error',
            info: 'toast-info',
            success: 'toast-success',
            warning: 'toast-warning',
            message: 'toast-message',
            request: 'toast-request',
            broadcast: 'toast-broadcast',
            follower: 'toast-follower'
        },
        positionClass: 'toast-top-full-width',
        timeOut: 5000,
        titleClass: 'toast-title',
        toastClass: 'toast'
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
                          'components/dash/dash.js'
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
        .state('main.traffic-chasers', {
            url: '/traffic/chasers/:userId',
            views: {
                'main-traffic': {
                    templateUrl: 'components/user/chasers/chasers.html',
                    controller: 'ChasersController as vm'
                }
            },
            resolve: {
                loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'trafficChasers',
                        files: [
                            'components/user/chasers/chaserServices.js',
                            'components/user/chasers/chasers.js'
                        ]
                    });
                }],
                data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                    $ionicSideMenuDelegate.canDragContent(false);
                }]
            }
        })
        .state('main.traffic-chasing', {
            url: '/traffic/chasing/:userId',
            views: {
                'main-traffic': {
                    templateUrl: 'components/user/chasing/chasing.html',
                    controller: 'ChasingController as vm'
                }
            },
            resolve: {
                loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'trafficChasing',
                        files: [
                            'components/user/chasing/chasingServices.js',
                            'components/user/chasing/chasing.js'
                        ]
                    });
                }],
                data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                    $ionicSideMenuDelegate.canDragContent(false);
                }]
            }
        })
      .state('main.activity', {
          url: '/activity/:requests?username',
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
        .state('main.activity-chasers', {
            url: '/activity/chasers/:userId',
            views: {
                'main-activity': {
                    templateUrl: 'components/user/chasers/chasers.html',
                    controller: 'ChasersController as vm'
                }
            },
            resolve: {
                loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'activityChasers',
                        files: [
                            'components/user/chasers/chaserServices.js',
                            'components/user/chasers/chasers.js'
                        ]
                    });
                }],
                data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                    $ionicSideMenuDelegate.canDragContent(false);
                }]
            }
        })
        .state('main.activity-chasing', {
            url: '/activity/chasing/:userId',
            views: {
                'main-activity': {
                    templateUrl: 'components/user/chasing/chasing.html',
                    controller: 'ChasingController as vm'
                }
            },
            resolve: {
                loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'activityChasing',
                        files: [
                            'components/user/chasing/chasingServices.js',
                            'components/user/chasing/chasing.js'
                        ]
                    });
                }],
                data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                    $ionicSideMenuDelegate.canDragContent(false);
                }]
            }
        })
      .state('main.search', {
          url: '/search',
          views: {
              'main-search': {
                  templateUrl: 'components/search/search.html',
                  controller: 'SearchController as vm'
              }
          },
          resolve: {
              loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'search',
                      files: [
                          'components/search/searchservices.js',
                          'components/search/search.js',
                          'components/search/searchDirectives.js'
                      ]
                  });
              }]
          }
      })
      .state('main.search-detail', {
          url: '/search/user/:username',
          views: {
              'main-search': {
                  templateUrl: 'components/user/user.html',
                  controller: 'UserController as vm'
              }
          },
          resolve: {
              loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'searchDetails',
                      files: [
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
        .state('main.search-chasers', {
            url: '/search/chasers/:userId',
            views: {
                'main-search': {
                    templateUrl: 'components/user/chasers/chasers.html',
                    controller: 'ChasersController as vm'
                }
            },
            resolve: {
                loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'searchChasers',
                        files: [
                            'components/user/chasers/chaserServices.js',
                            'components/user/chasers/chasers.js'
                        ]
                    });
                }],
                data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                    $ionicSideMenuDelegate.canDragContent(false);
                }]
            }
        })
        .state('main.search-chasing', {
            url: '/search/chasing/:userId',
            views: {
                'main-search': {
                    templateUrl: 'components/user/chasing/chasing.html',
                    controller: 'ChasingController as vm'
                }
            },
            resolve: {
                loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        name: 'searchChasing',
                        files: [
                            'components/user/chasing/chasingServices.js',
                            'components/user/chasing/chasing.js'
                        ]
                    });
                }],
                data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                    $ionicSideMenuDelegate.canDragContent(false);
                }]
            }
        })
      .state('messages', {
          url: '/messages',
          templateUrl: 'components/messages/messages.html',
          controller: 'MessagesController as vm',
          resolve: {
              loadExternals: [
                  '$ocLazyLoad', function ($ocLazyLoad) {
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
      .state('messages-thread', {
          url: '/messages/:username/:userID',
          templateUrl: 'components/messages/thread/thread.html',
          controller: 'ThreadController as vm',
          resolve: {
              loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'thread',
                      files: [
                          'lib/elastic.js',
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
      .state('messages-compose', {
          url: '/messages-compose',
          templateUrl: 'components/messages/compose/compose.html',
          controller: 'ComposeController as vm',
          resolve: {
              loadExternals: ['$ocLazyLoad', function ($ocLazyLoad) {
                  return $ocLazyLoad.load({
                      name: 'compose',
                      files: [
                          'lib/elastic.js',
                          'components/messages/compose/compose.js',
                          'components/messages/thread/threadServices.js',
                          'components/search/searchservices.js',
                          'components/messages/messagesFilters.js',
                          'components/messages/thread/threadDirectives.js',
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
              ],
              data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                  $ionicSideMenuDelegate.canDragContent(false);
              }]
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
                            'components/search/searchservices.js'
                          ]
                      });
                  }
              ],
              data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                  $ionicSideMenuDelegate.canDragContent(false);
              }]
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
              ],
              data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                  $ionicSideMenuDelegate.canDragContent(false);
              }]
          }
      })
      .state('settings', {
          url: '/settings',
          templateUrl: 'components/settings/settings.html',
          controller: 'SettingsController as vm',
          resolve: {
              loadExternals: [
                  '$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load({
                          name: 'settings',
                          files: [
                              'components/settings/settings.js',
                              'components/settings/settingServices.js',
                              'components/settings/settingsDirectives.js'
                          ]
                      });
                  }
              ],
              data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                  $ionicSideMenuDelegate.canDragContent(false);
              }]
          }
      })
      .state('blocks', {
          url: '/blocks',
          templateUrl: 'components/blocks/blocks.html',
          controller: 'BlocksController as vm',
          resolve: {
              loadExternals: [
                  '$ocLazyLoad', function ($ocLazyLoad) {
                      return $ocLazyLoad.load({
                          name: 'blocks',
                          files: [
                              'components/blocks/blocks.js',
                              'components/blocks/blocksServices.js'
                          ]
                      });
                  }
              ],
              data: ['$ionicSideMenuDelegate', function ($ionicSideMenuDelegate) {
                  $ionicSideMenuDelegate.canDragContent(false);
              }]
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

//function toasterConfig(toastrConfig) {
    
//};

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

        var data = "grant_type=password&username=" + loginData.username + "&password=" + loginData.password + "&client_id=" + clientID_CONSTANT;

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

    authServiceFactory.externalLogin = function (data) {
        var date = new Date();
        var refreshTokenDate = date.setDate(date.getDate() + refreshTokenLife_CONSTANT);
        localStorageService.set('authorizationData', { token: data.access_token, userName: data.username, refreshToken: data.refresh_token, refreshExpiration: data.refreshTokenDate });
        authServiceFactory.authentication.isAuth = true;
        authServiceFactory.authentication.userName = data.userName;
        authServiceFactory.authentication.token = data.access_token;
        authServiceFactory.authentication.refreshToken = data.refresh_token;
        authServiceFactory.authentication.refreshTokenExp = data.refreshTokenDate;
    };

    authServiceFactory.logOut = function (cb) {

        localStorageService.remove('authorizationData');
        localStorageService.remove('KeyData');

        authServiceFactory.authentication.isAuth = false;
        authServiceFactory.authentication.userName = "";
        authServiceFactory.authentication.token = "";
        authServiceFactory.authentication.refreshToken = "";
        authServiceFactory.authentication.refreshTokenExp = "";
        cb();
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

    authServiceFactory.registerExternal = function (registerExternalData) {

        var deferred = $q.defer();
        var date = new Date();
        $http.post(baseURL_CONSTANT + 'api/accounts/registerexternal', registerExternalData).success(function (response) {
            var refreshTokenDate = date.setDate(date.getDate() + refreshTokenLife_CONSTANT);
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
            var state = $injector.get('$state');
            var authData = localStorageService.get('authorizationData');

            authService.refreshToken().then(function (response) {
                $rootScope.$emit("tokenRefreshed");
                console.log("refresh token");
            },
             function (err) {
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

app.controller('mainController', ['$scope', '$rootScope', '$q', '$state', '$stateParams', '$ionicLoading', '$ionicModal', '$ionicPopup', '$ionicPopover', '$ionicPlatform', 'AuthService', 'Encryption', 'UserStore', 'Traffic', 'Activity', 'Messages', 'CentralHub', 'UserViewMap', 'toastr', 'ControllerChecker', 'Device','Broadcast', 'localStorageService', '$cordovaPushV5', '$cordovaSocialSharing','$cordovaGeolocation','$cordovaCamera', '$cordovaFileTransfer', 'localStorageService',
    function ($scope, $rootScope, $q, $state, $stateParams, $ionicLoading, $ionicModal, $ionicPopup, $ionicPopover, $ionicPlatform, AuthService, Encryption, UserStore, Traffic, Activity, Messages, CentralHub, UserViewMap, $toaster, ControllerChecker, Device, Broadcast, localStorageService, $cordovaPushV5, $cordovaSocialSharing, $cordovaGeolocation, $cordovaCamera, $cordovaFileTransfer) {
    
    var mc = this;    

    $scope.loadRequestState = false;
    $scope.loadChasingState = false;

    $scope.proxyCentralHub = null;

    $scope.activeThread = {};
    $scope.showTabs = {};
    $scope.showTabs.show = true;
    $scope.imageURL = imgURL_CONSTANT;
    mc.profileloading = false;
    $scope.viewFigures = false;

    //$scope.shareLink = "";
    //mc.showShare = $scope.shareLink.length > 0;

    var authdata = AuthService.authentication;
    $scope.badge = {
        Activity: "",
        Traffic: "",
        Messages: ""
    };

    $scope.badgeTrafficCheck = function () {
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

    $scope.badgeMessageCheck = function (msgsArray) {
        if (_.isEqual($scope.badge.Messages, 1))
            var messages = _.some(msgsArray.results, ['viewed', false]);
    };

    $ionicModal.fromTemplateUrl('passphrase.html', {
        scope: $scope,
        animation: 'slide-in-up',
        hardwareBackButtonClose: false
    }).then(function (modal) {
        mc.phraseModal = modal;
    });

    $scope.openModal = function () {
        mc.phraseModal.show();
    };
    $scope.closeModal = function () {
        mc.phraseModal.hide();
    };

    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        mc.phraseModal.remove();
    });
        
    $scope.errorHandlerFunction = function(title, text, callback){
        $ionicLoading.hide();
        if (!_.isEmpty(title) && !_.isEmpty(text)) {
            var alertObject = {};
            Object.assign(alertObject, !_.isEmpty(title) ? { title: title } : null,
                                       !_.isEmpty(text) ? { template: text } : null);

            if (typeof callback === "function") 
                callback(alertObject);
            else 
                var confirmPopup = $ionicPopup.alert(alertObject);
        }
    };

    $scope.userInitiate = function () {
        var deffered = $q.defer();
        UserStore.setUser().then(function (response) {
            $scope.user = response;
            Encryption.Key.publicKey = response.publicKey;
            if (_.isEmpty(Encryption.Key.privateKey)) {
                if (_.isEmpty(Encryption.Key.publicKey))
                    mc.phraseText = passphrase_CONSTANT.create;
                else
                    mc.phraseText = passphrase_CONSTANT.enter;

                mc.phraseModal.show();
            }
            photoUpdate();
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
                    $scope.badgeTrafficCheck();
                                
                CentralHub.initialize('centralHub', function(proxy){
                    $scope.proxyCentralHub = proxy;
                }); 

                if ($scope.user.broadcasting) {
                    //updateCoordinatesAwake();
                    document.addEventListener('deviceready', function () {
                        $scope.BackgroundServiceFunction();
                    }, false);
                    CentralHub.views($scope.proxyCentralHub);
                }
                ionic.Platform.ready(function () {
                    var deviceInformation = ionic.Platform.device();
                    Device.devices().then(function (responseDevices) {
                        var deviceInfo = _.find(responseDevices, ['model', deviceInformation.model]);
                        $cordovaPushV5.initialize(Pushoptions).then(function (data) {
                            // start listening for new notifications
                            $cordovaPushV5.onNotification();
                            // start listening for errors
                            $cordovaPushV5.onError();
                            // register to get registrationId
                            $cordovaPushV5.register().then(function (registrationId) {
                                if (_.isEmpty(deviceInfo))
                                    Device.register(deviceInformation.platform, deviceInformation.model, registrationId, true);
                                else {
                                    if (deviceInfo.token != registrationId)
                                        Device.register(deviceInformation.platform, deviceInformation.model, registrationId, true);
                                }
                            });
                        });
                    });
                });
                deffered.resolve(true);
            }, function (reason) {
                // Error callback where reason is the value of the first rejected promise
                deffered.reject(reason);
            });
        }, function (error) {
            deffered.reject(error);
        }).finally(function () {
            mc.loadingDone = true;
        });

        return deffered.promise;
    };

    if (authdata.isAuth) {
        $scope.userInitiate();
    }
    else {
        mc.loadingDone = true;
    }
    var options = {
        timeout: 7000,
        enableHighAccuracy: true,
        maximumAge: 500000
    };

    $scope.broadcastloading = false;
    $scope.geoWatch = {};

    $scope.BackgroundServiceFunction = function () {
        var backgroundServiceSuccess = function (location) {
            $scope.user.broadcast.latitude = location.latitude;
            $scope.user.broadcast.longitude = location.longitude;
            console.log('[js] BackgroundGeoLocation callback:  ' + location.latitude + ',' + location.longitude);
            var coords = {
                latitude: location.latitude,
                longitude: location.longitude
            };
            CentralHub.broadcast($scope.proxyCentralHub, coords).then(function (updated) {
                console.log('[postCommplete]: ' + updated + ' BackgroundGeoLocation callbackSent: ' + location.latitude + ',' + location.longitude);
            });
            backgroundGeoLocation.finish();
        };

        var backgroundServiceFail = function (error) {
            //console.log('BackgroundGeoLocation error');
        };

        var bgOptions = {
            stationaryRadius: 50,
            distanceFilter: 50,
            desiredAccuracy: 10,
            debug: true,
            notificationIcon: 'broadcast_icon',
            notificationText: 'ENABLED',
            notificationTitle: "Chaser",
            notificationText: "Broadcasting location...",
            locationProvider: 0,//backgroundGeolocation.provider.ANDROID_DISTANCE_FILTER_PROVIDER,
            interval: 10,
            fastestInterval: 5,
            activitiesInterval: 10,
            stopOnTerminate: false,
            startOnBoot: false,
            startForeground: true,
            stopOnStillActivity: true,
            activityType: 'AutomotiveNavigation',
            syncThreshold: 100,
            /*
            url: 'https://ch-mo.com/api/broadcast/locations',
            syncUrl: 'https://ch-mo.com/api/broadcast/locations',
            syncThreshold: 100,
            httpHeaders: {
                'Authorization': 'Bearer ' + authdata.token
            },
             */
            pauseLocationUpdates: false,
            saveBatteryOnBackground: false,
            maxLocations: 50
        };
        
        backgroundGeoLocation.configure(backgroundServiceSuccess, backgroundServiceFail, bgOptions);
       
        backgroundGeoLocation.start();
    };

    $scope.$on('update_location', function (event, args) {
        if (args.action === "turn-on") {            
            document.addEventListener('deviceready', function () {
                $scope.BackgroundServiceFunction();
            }, false);
        }
        else if (args.action === "turn-off") {
            backgroundGeoLocation.stop();
        }
    });

    var Pushoptions = {
        android: {
            senderID: "927875139886"
        },
        ios: {
            alert: "true",
            badge: "true",
            sound: "true"
        },
        windows: {}
    };

    $scope.$parent.$on("centralHubNotification", function (e, notify) {
        notify.coldstart = false;
        notify.foreground = true;
        NotificationAction(notify);
    });

    $scope.$parent.$on("tokenRefreshed", function () {
        $scope.userInitiate();
    });

    $scope.$parent.$on("centralHubBroadcast", function (e, coords) {
        $scope.$broadcast('mapUpdate', coords);
    });

    $scope.$parent.$on("centralHubViewing", function (e, watching, views) {
        $scope.$apply(function () {
            $scope.user.broadcast.viewing = watching;
            $scope.user.broadcast.views = views;
        });
    });

    $scope.$parent.$on("centralHubBroadcastOff", function (e, userID, userName) {
        $scope.$broadcast('broadcastOff', userID, userName);
    });

    mc.CheckBadge = function (badge) {
        switch (badge) {
            case 0:
                $scope.badgeTrafficCheck();
                break;
            case 1:
                mc.badgeActivityCheck();
                break;
            case 2:
                if (_.isEqual($scope.badge.Messages, 1)) 
                    $scope.badge.Messages = 0;
                break;
        }
    };

    // triggered every time notification received
    $rootScope.$on('$cordovaPushV5:notificationReceived', function (event, data) {        
        var notify = {
            "type" : data.additionalData.type,
            "username": data.additionalData.username,
            "photo": data.additionalData.photo == "1" ? true : false,
            "Id": data.additionalData.userid,
            "viewing": data.additionalData.viewing,
            "views": data.additionalData.views,
            "foreground": data.additionalData.foreground,
            "coldstart" : data.additionalData.coldstart
        };

        NotificationAction(notify);
    });

    // triggered every time error occurs
    $rootScope.$on('$cordovaPushV5:errorOcurred', function (event, e) {
        console.log(e);
    });

    mc.shareProfile = function () {
        $cordovaSocialSharing.share(invite_CONSTANT.msg.replace(/0/gi, $scope.user.userName), null, null, invite_CONSTANT.link) // Share via native share sheet
        .then(function (result) {
        // Success!
           }, function (err) {
        // An error occured. Show a message to the user
          });
    };

    var Encrypt = function(passphrase, newPhrase){
        Encryption.generatePrivateKey(passphrase.replace(/\s+/g, ''), newPhrase).then(function (response) {
            $ionicLoading.hide();
            if (response)
                mc.phraseModal.hide();
            else
                $scope.errorHandlerFunction(genericError_CONSTANT);

        }, $scope.errorHandlerFunction(genericError_CONSTANT));
    };
        
    $ionicPopover.fromTemplateUrl("shared/templates/passphraseHelp.html", {
        scope: $scope,
    }).then(function (popover) {
        mc.phrasePopover = popover;
        mc.phraseHelper = passphrase_CONSTANT.helpText;
    });

    mc.savePhrase = function () {
        $ionicLoading.show();
        var passphrase = _.toLower(mc.passPhrase);
        if (_.isEmpty(Encryption.Key.publicKey)) {
            Encrypt(mc.passPhrase, true);            
        }
        else {
            Encryption.verifyPassphrase(passphrase.replace(/\s+/g, '')).then(function (response) {
                if (response) {
                    Encrypt(mc.passPhrase, false);
                }
                else {
                    $scope.errorHandlerFunction(passphrase_CONSTANT.didntmatch_title, passphrase_CONSTANT.didntmatch_text, function (alertObject) {
                        var confirmPopup = $ionicPopup.confirm(alertObject);
                        confirmPopup.then(function (res) {
                            if (res) {
                                Encrypt(mc.passPhrase, true);
                            } 
                        });
                    });
                }
            }, $scope.errorHandlerFunction(genericError_CONSTANT));
        }
    };
        
    /********** Appwide Pause + Resume logic ************/
    document.addEventListener("pause", function () {
        if (!$scope.user.broadcasting)
            CentralHub.disconnect();
    }, false);

    document.addEventListener("resume", function () {
        CentralHub.initialize('centralHub', function (proxy) {
            $scope.proxyCentralHub = proxy;
            var currentMapOpen = UserViewMap.CurrentConnection();
            if (currentMapOpen) {
                $ionicLoading.show({
                    template: '<ion-spinner></ion-spinner> Connecting to ' + currentMapOpen
                });
                CentralHub.joinbroadcast(proxy, currentMapOpen).then(function () {
                    $ionicLoading.hide();
                    CentralHub.streamBroadcast(proxy);
                }, function (err) {
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title: maps_CONSTANT.Errortitle
                    }).then(function (res) {
                    });
                });
            }                
        });



    }, false);
    /***********************      *****************************/

    function NotificationAction(notify) {
        var title;
        var text;
        var state;
        var icon;
        var parameters;
        var foreground = notify.foreground;
        var coldstart = notify.coldstart;

        var type = parseInt(notify.type);
        switch (type) {
            case 0:
                var exists = ControllerChecker.exists("TrafficController");
                if (exists)
                    $scope.$emit('emit_Chasers', { action: "chasers" });
                else
                    Traffic.chasers(0);
                title = newChaserTitle_CONSTANT;
                text = newChasing_CONSTANT;
                state = "main.traffic";
                icon = "is-icon-avatar";
                if ($state.current.name != state)
                    $scope.badge.Traffic = 1;
                break;
            case 1:
                var exists = ControllerChecker.exists("ActivityController");
                if (exists)
                    $scope.$emit('emit_Activity', { action: "requests" });
                else
                    Activity.requests(0);
                title = newRequestTitle_CONSTANT;
                text = newRequest_CONSTANT;
                state = "main.activity";
                icon = "ion-paper-airplane";
                if ($state.current.name != state)
                    $scope.badge.Activity = 1;
                $scope.$apply(function () {
                    $scope.loadRequestState = true;
                });
                break;
            case 2:
                var exists = ControllerChecker.exists("TrafficController");
                if (exists)
                    $scope.$emit('emit_Chasers', { action: "chasing" });
                else
                    Traffic.chasing(0)
                title = newChasingTitle_CONSTANT;
                text = newChasing_CONSTANT;
                state = "main.traffic";
                icon = "is-icon-avatar";
                if ($state.current.name != state)
                    $scope.badge.Traffic = 1;
                $scope.$apply(function () {
                    $scope.loadChasingState = true;
                });
                break;
            case 3:
                var exists = ControllerChecker.exists("ActivityController");
                if (exists)
                    $scope.$emit('emit_Activity', { action: "broadcasts" });
                else
                    Activity.broadcasting(0);
                title = newBroadcastingTitle_CONSTANT;
                text = newBroadcasting_CONSTANT;
                state = "main.activity-detail";
                icon = "ion-radio-waves";
                parameters = { username: notify.username }
                break;
            case 4:
                Messages.inbox(0);
                title = newMesssageTitle_CONSTANT;
                text = newMesssage_CONSTANT;
                state = "messages";
                icon = "ion-chatbox";
                if ($state.current.name != state && $state.current.name != "messages-thread")
                    $scope.badge.Messages = 1;
                break;
            case 5:
                title = newViewing_CONSTANT.replace("{0}", notify.viewing).replace("{1}", notify.views);
                $scope.user.broadcast.views = notify.views;
                $scope.user.broadcast.viewing = notify.viewing;
                state = "main.dash";
                icon = "ion-radio-waves";
                break;
        }

        if (foreground) {
            $scope.$apply(function () {
                if (!($state.current.name == "messages-thread" && $stateParams.username == notify.username)) {
                    var user_data = {
                        url: $scope.imageURL,
                        id: notify.Id,
                        photo: notify.photo,
                        icon: icon,
                        type: type
                    };
                    $toaster.info(title, notify.username, {
                        extraData: user_data,
                        onTap: function (toast) {
                            $state.go(state, parameters);
                        },
                    });

                }
            });
        }
        else
            $state.go(state, parameters);
    };
    /********** photo upload & download ****************/
    

    function photoUpdate() {
        if ($scope.user.photo) {
            var rando = _.random(1, 999);
            mc.profilePhoto = $scope.imageURL + $scope.user.id + '.png?rando=' + rando;
        }
        else
            mc.profilePhoto = "img/default_avatar.png";
        mc.profileloading = false
    };

    $ionicModal.fromTemplateUrl('photo-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        mc.photomodal = modal;
    });

    $ionicModal.fromTemplateUrl('crop-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        mc.cropmodal = modal;
    });

    mc.openPhotoModal = function () {
        mc.photomodal.show();
    };

    mc.closeModal = function () {
        mc.openPhotoModal.hide();
    };

    mc.closecropModal = function () {
        mc.cropmodal.hide();
        mc.photomodal.hide();
    };

    $scope.$on('cropmodal.hidden', function () {
        $scope.resImageDataURI = {};
    });

    $scope.type = 'circle';
    $scope.imageURI = '';
    $scope.resImageDataURI = '';
    $scope.resImgFormat = 'image/png';
    $scope.resImgQuality = 1;
    $scope.selMinSize = 200;
    $scope.resImgSize = 200;
        //$scope.aspectRatio=1.2;
    $scope.onChange = function ($dataURI) {
        $scope.resImageDataURI = $dataURI;
    };
    $scope.onLoadError = function () {
        //console.log('onLoadError fired');
    };

    mc.takePicture = function () {
        var fitwidth = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth) + 15;
        var fitheight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        var options = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: fitwidth,
            targetHeight: fitheight,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation: true
        };

        $ionicPlatform.ready(function () {
            $cordovaCamera.getPicture(options).then(function (imageData) {
                $scope.imgURI = "data:image/jpeg;base64," + imageData;
                mc.cropmodal.show();
            }, function (err) {
                //console.log('Failed because: ');
                //console.log(err);
            });
        });
    };

    mc.selectPicture = function () {
        var fitwidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
        var fitheight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

        var options = {
            quality: 75,
            targetWidth: fitwidth,
            targetHeight: fitheight,
            encodingType: Camera.EncodingType.JPEG,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            correctOrientation: true
        };
        $ionicPlatform.ready(function () {
            $cordovaCamera.getPicture(options).then(
              function (imageData) {
                  mc.cropmodal.show();
                  $scope.imgURI = "data:image/jpeg;base64," + imageData;
              },
              function (err) {
                  //console.log('Failed because: ');
                  //console.log(err);
              });
        });
    };

    mc.uploadPicture = function () {
        mc.profileloading = true;
        $ionicLoading.show();
        var options = {
            chunkedMode: false,
            mimeType: "image/png"
        };

        var params = new Object();
        params.headers = { Authorization: "Bearer " + authdata.token };
        options.params = params;
        $ionicPlatform.ready(function () {
            $cordovaFileTransfer.upload(baseURL_CONSTANT + "api/accounts/user/photoupload", $scope.resImageDataURI, options)
            .then(function (result) {
                var response = result;
                mc.cropmodal.hide();
                mc.photomodal.hide();
                $scope.user.photo = true;
                photoUpdate();
                $ionicLoading.hide();
            }, function (err) {
                //console.log("Whoops! Upload failed");
                mc.cropmodal.hide();
                mc.photomodal.hide();
                $ionicLoading.hide();
                mc.profileloading = false;
            }/*,function (progress) {
                console.log("Progress: " + (progress.loaded / progress.total) * 100)
                $timeout(function () {
                    $scope.downloadProgress = (progress.loaded / progress.total) * 100;
                });
               
            } */);
        });
    };
   /******* end photo upload & download ******************/

    mc.logout = function () {
        //backgroundGeoLocation.stop();        
        AuthService.logOut(function () {
            $state.go('login');
            //Device.deleteDevice(token);
        });
        
    };

}]);
