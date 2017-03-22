; (function () {
    var app = angular.module('App');
    app.controller('ThreadController', ['$scope', '$q', '$state', '$stateParams', '$ionicScrollDelegate', 'Thread', 'Messages', 'Encryption', function ($scope, $q, $state, $stateParams, $ionicScrollDelegate, Thread, Messages, Encryption) {
        //$templateCache.removeAll();

        $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
            viewData.enableBack = true;            
        });

        var vm = this;
        var activeMessage = Messages.active();
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
                vm.MessageThread = _.reverse(response.results);
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
                vm.MessageThread.push(msgObject);
                _scrollBottom();
            });

            activeMessage = Messages.active();
            var recipients = [[activeMessage.corresponder, activeMessage.publickey]];
            recipients.unshift([vm.user.id, vm.user.publicKey]);
            
            Thread.sendMessage(recipients, userMsgObject.msg, activeMessage.messageID).then(function (response) {
                if (response) {
                    Thread.sendNotification(response.messageID);
                    Messages.updateActive(response)
                    Messages.updateThread(response, false);
             }
            }, function (error) {
                console.log("message didn't send");
            });
        };

        vm.loadMoreMessages = function () {
            var deffered = $q.defer();
            var pagingMessageMax = Math.ceil(vm.messagesNo / msgCountSet_CONSTANT, 1);
            if (vm.threadIndex < pagingMessageMax && vm.threadIndex > 0) {
                Thread.thread(vm.threadIndex, vm.userID).then(function (data) {
                    var results = _.reverse(data.results);
                    var messagesMerged = vm.MessageThread.concat(results);
                    var messagedMerged2 = _.concat(vm.MessageThread, results);

                    var pushedOpp = vm.MessageThread.unshift(results);
                    var pushedOpp2 = vm.MessageThread.push(results);


                    vm.messagesNo = data.total;
                    vm.MessageThread = messagesMerged;
                    vm.threadIndex++;
                    vm.moMessages = (vm.messagesNo > msgCountSet_CONSTANT * vm.threadIndex);
                    $scope.$broadcast('scroll.infiniteScrollComplete');
                    deffered.resolve();
                });
            }
            else if (vm.threadIndex >= pagingMessageMax)
                vm.moMessages = false;

            return deffered.promise;
        };


    }]);
})();