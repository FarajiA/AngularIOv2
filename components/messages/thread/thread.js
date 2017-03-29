; (function () {
    var app = angular.module('App');
    app.controller('ThreadController', ['$scope', '$q', '$state', '$timeout', '$stateParams', '$ionicScrollDelegate', 'Thread', 'Messages', 'Encryption', function ($scope, $q, $state,$timeout, $stateParams, $ionicScrollDelegate, Thread, Messages, Encryption) {
        
        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;            
        });

        var vm = this;
        var activeMessage = Messages.active();
        var sending_constant = 1;
        var sent_constant = 2;
        var failed_constant = 3;
        vm.initialLoadCompleted = false;

        var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');
        vm.imageURL = imgURL_CONSTANT;
        vm.inputPlaceholderText = composeNewMsg_CONSTANT;

        vm.corresponder = activeMessage.username;
        vm.userID = $stateParams.userID;
        vm.threadIndex = 0;
        vm.user = $scope.$parent.user;
        var _scrollBottom = function (target) {
            target = target || '#type-area';
            viewScroll.scrollBottom(true);
            //_keepKeyboardOpen(target);
            //if ($scope.isNew) $scope.isNew = false;
        }

        /*
        var _keepKeyboardOpen = function (target) {
            target = target || '#type-area';

            txtInput = angular.element(document.body.querySelector(target));
            console.log('keepKeyboardOpen ' + target);
            txtInput.one('blur', function () {
                console.log('textarea blur, focus back on it');
                txtInput[0].focus();
            });
        }
        */
        
        var extra = $state.current.name;
        
        var getUserThread = function () {
            Thread.thread(vm.threadIndex, vm.userID).then(function(response) {
                vm.MessageThread = _.reverse(response.results);;
                vm.initialLoadCompleted = true;
                vm.messagesNo = response.total;
                vm.threadIndex++;
                vm.moMessages = (vm.messagesNo > msgCountSet_CONSTANT * vm.threadIndex);
                viewScroll.scrollBottom(false);
                if (_.some(vm.MessageThread, ['viewed', false]))
                    Thread.viewed(vm.userID);
            });
        };

        getUserThread();

        $scope.$watch('$parent.activeThread', function (newVal, oldVal) {
            if (!_.isEmpty(newVal) && !_.isEmpty(vm.MessageThread)) {
                vm.MessageThread.push(newVal);
            }
        });

        vm.sendMessage = function () {
            var msgObject = { 'username': vm.user.userName, 'date': new Date() };
            var userMsgObject = {
                'id': vm.user.id,
                'key': vm.user.publicKey,
                'msg': vm.writingMessage
            }
            Encryption.Encrypt(userMsgObject).then(function (response) {
                msgObject.body = response.msg;
                vm.writingMessage = "";
                msgObject.status = sending_constant;
                vm.MessageThread.push(msgObject);
                _scrollBottom();
            });

            activeMessage = Messages.active();
            var recipients = [[vm.userID, activeMessage.publickey]];
            recipients.unshift([vm.user.id, vm.user.publicKey]);
            
            Thread.sendMessage(recipients, userMsgObject.msg, activeMessage.messageID).then(function (response) {
                if (response) {
                    msgObject.status = sent_constant;
                    Thread.sendNotification(response.messageID);
                    Messages.updateActive(response)
                    Messages.updateThread(response, false);
             }
            }, function (error) {
                msgObject.status = failed_constant;
            });
        };

        vm.loadMoreMessages = function () {
            var deffered = $q.defer();
            var pagingMessageMax = Math.ceil(vm.messagesNo / msgCountSet_CONSTANT, 1);
            if (vm.threadIndex < pagingMessageMax && vm.threadIndex > 0) {
                Thread.thread(vm.threadIndex, vm.userID).then(function (data) {
                    _.reverse(data.results);
                    var messagesMerged = data.results.concat(vm.MessageThread);
                    vm.messagesNo = data.total;
                    vm.MessageThread = messagesMerged;
                    vm.threadIndex++;
                    vm.moMessages = (vm.messagesNo > msgCountSet_CONSTANT * vm.threadIndex);
                    $timeout(function () {
                        $scope.$broadcast('scroll.infiniteScrollComplete');
                    });                
                    deffered.resolve();
                });
            }
            else if (vm.threadIndex >= pagingMessageMax)
                vm.moMessages = false;

            return deffered.promise;
        };


        $scope.$on("update_thread", function (e, message) {
                if (vm.corresponder == message.username) {
                    Messages.updateActive(message).then(function (){
                        $scope.activeThread = message;
                    });
                    vm.messagesNo++;
                    message.viewed = true;
                    vm.MessageThread.push(message);
                    viewScroll.scrollBottom(true);
                    Messages.viewed(message.corresponder).then(function (response){
                        Messages.updateThread(message, false);
                    });
                }
                else {
                    $scope.$parent.badge.Messages = 1;
                }
            });        
    }]);
})();