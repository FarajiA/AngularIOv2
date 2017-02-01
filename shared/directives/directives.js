; (function () {
    'use strict';
    /*
    angular.module('App')
        .directive('hideTabs', function ($rootScope, $ionicTabsDelegate) {
        return {
            restrict: 'A',
            link: function ($scope, $el) {
                $scope.$on("$ionicView.beforeEnter", function () {
                    $ionicTabsDelegate.showBar(false);
                });
                $scope.$on("$ionicView.beforeLeave", function () {
                    $ionicTabsDelegate.showBar(true);
                });
            }
        };
    });

 
    angular.module('App')
       .directive('mdChips', function ($rootScope) {
           return {
               restrict: 'E',
               priority: 1, // give it higher priority than built-in ng-click
               link: function (scope, element, attr) {
                   element.bind('input', function (event) {
                       // do something with $rootScope here, as your question asks for that
                      console.log('overridden');
                   })
               }
           }
       })
   */



    angular.module('irontec.simpleChat', []);
    angular.module('irontec.simpleChat').directive('irontecSimpleChat', ['$timeout', SimpleChat]);

    function SimpleChat($timeout) {
        var directive = {
            restrict: 'EA',
            templateUrl: 'threadTemplate.html',
            replace: true,
            scope: {
                messages: '=',
                myUserId: '=',
                inputPlaceholderText: '@',
                corresponder: '=',
                user: '=',
                submitButtonText: '@',
                title: '@',
                theme: '@',
                submitFunction: '&',
                visible: '=',
                infiniteScroll: '&',
                expandOnNew: '=',
                username: '='
            },
            link: link,
            controller: ChatCtrl,
            controllerAs: 'vm'
        };

        function link(scope, element) {
            if (!scope.inputPlaceholderText) {
                scope.inputPlaceholderText = 'Write message here...';
            }

            if (!scope.submitButtonText || scope.submitButtonText === '') {
                scope.submitButtonText = 'Send';
            }

            if (!scope.title) {
                scope.title = 'Chat';
            }

            scope.$msgContainer = $('.msg-container-base'); // BS angular $el jQuery lite won't work for scrolling
            scope.$chatInput = $(element).find('.chat-input');

            var elWindow = scope.$msgContainer[0];
            scope.$msgContainer.bind('scroll', _.throttle(function () {
                var scrollHeight = elWindow.scrollHeight;
                if (elWindow.scrollTop <= 10) {
                    scope.historyLoading = true; // disable jump to bottom
                    scope.$apply(scope.infiniteScroll);
                    $timeout(function () {
                        scope.historyLoading = false;
                        if (scrollHeight !== elWindow.scrollHeight) // don't scroll down if nothing new added
                            scope.$msgContainer.scrollTop(360); // scroll down for loading 4 messages
                    }, 150);
                }
            }, 300));
        }

        return directive;
    }

    ChatCtrl.$inject = ['$scope', '$timeout'];

    function ChatCtrl($scope, $timeout) {
        var vm = this;

        vm.isHidden = false;
        vm.messages = $scope.messages;
        vm.username = "whatever";
        vm.myUserId = $scope.myUserId;
        vm.inputPlaceholderText = $scope.inputPlaceholderText;
        vm.submitButtonText = $scope.submitButtonText;
        vm.title = $scope.title;
        vm.theme = 'chat-th-' + $scope.theme;
        vm.writingMessage = '';
        vm.panelStyle = { 'display': 'block' };
        vm.chatButtonClass = 'fa-angle-double-down icon_minim';

        vm.corresponder = $scope.corresponder;
        vm.user = $scope.user;

        vm.toggle = toggle;
        vm.close = close;
        vm.submitFunction = submitFunction;

        function submitFunction() {
            if (vm.writingMessage.length > 0) {
                $scope.submitFunction()(vm.writingMessage);
                vm.writingMessage = '';
                scrollToBottom();
            }
        }

        $scope.$watch('visible', function () { // make sure scroll to bottom on visibility change w/ history items
            scrollToBottom();
            $timeout(function () {
                $scope.$chatInput.focus();
            }, 250);
        });
        $scope.$watch('messages.length', function () {
            vm.messages = $scope.messages;
            if (!$scope.historyLoading) scrollToBottom(); // don't scrollToBottom if just loading history
            if ($scope.expandOnNew && vm.isHidden) {
                toggle();
            }
        });

        function scrollToBottom() {
            $timeout(function () { // use $timeout so it runs after digest so new height will be included
                $scope.$msgContainer.scrollTop($scope.$msgContainer[0].scrollHeight);
            }, 200, false);
        }

        function close() {
            $scope.visible = false;
        }

        function toggle() {
            if (vm.isHidden) {
                vm.chatButtonClass = 'fa-angle-double-down icon_minim';
                vm.panelStyle = { 'display': 'block' };
                vm.isHidden = false;
                scrollToBottom();
            } else {
                vm.chatButtonClass = 'fa-expand icon_minim';
                vm.panelStyle = { 'display': 'none' };
                vm.isHidden = true;
            }
        }
    }

    angular.module("irontec.simpleChat").run(["$templateCache", function ($templateCache) { $templateCache.put("threadTemplate.html", "<div id=\"thread stuff\" class=\"msg-container-base\"><div class=\"row\" ng-repeat=\"message in vm.messages\"><div class=\"col\" ng-if=\"message.username == vm.corresponder\">xxxxxx</div><div class=\"col\" ng-class=\"message.username == vm.corresponder ? 'col-75' : 'solo'\"><div class=\"talk-bubble tri-right chatRound\" ng-class=\"message.username == vm.corresponder ? 'left-in' : 'right-in'\"><div class=\"talktext\"><p>{{message.body | messageDecrypt}}</p></div></div><p class=\"date\">{{message.date | messageDate }}</p></div></div><div class=\"panel-footer chat-bottom-bar\"><form style=\"display:flex\" ng-submit=\"vm.submitFunction()\"><div class=\"input-group\"><textarea class=\"form-control input-sm chat-input\" placeholder=\"{{vm.inputPlaceholderText}}\" ng-model=\"vm.writingMessage\" maxlength=\"300\"></textarea><button class=\"button button-stable button-small\">{{vm.submitButtonText}}</button></div></form></div></div>"); }]);
})();