; (function () {
    var app = angular.module('App');
    app.controller('ComposeController', ['$scope', '$timeout', '$state', '$ionicPopup', 'Search', 'Thread', 'Encryption', 'Messages', function ($scope, $timeout, $state, $ionicPopup, Search, Thread, Encryption, Messages) {

        $scope.$on("$ionicView.beforeEnter", function () {
            $scope.showTabs.show = false;
        });
        $scope.$on("$ionicView.beforeLeave", function () {
            $scope.showTabs.show = true;
        });

        var vm = this;
        vm.composeIndex = 0;
        vm.searchIndex = 0;
        vm.SearchService = Search;
        vm.searchTotal = 0;
        vm.writingMessage = "";
        vm.listRecipients = [];
        vm.keys = [];
        vm.imageURL = imgURL_CONSTANT;

        vm.inputPlaceholderText = composeNewMsg_CONSTANT;
        Thread.composeList(vm.composeIndex).then(function (response) {
            vm.listRecipients = response.results;
            vm.composeIndex++
        });

        vm.updateRecipients = function (user) {
            if (vm.selectedUsers.length <= 9) {
                var present = _.some(vm.selectedUsers, ['id', user.id]);

                if (present) {
                    _.remove(vm.selectedUsers, function (n) {
                        return n.id === user.id;
                    });
                }
                else {
                    var item = {};
                    item.thumbnailUrl = user.photo ? vm.imageURL + user.id +'.png' : '././img/default_avatar.png';
                    item.title = user.username;
                    item.subtitle = user.firstName + ' ' + user.lastName;
                    item.id = user.id;
                    item.checked = user.checked;
                    item.publickey = user.publicKey
                    vm.keys = vm.keys.concat(item.publickey);
                    vm.selectedUsers.push(item);
                }
            }
            else {
                var alertPopup = $ionicPopup.alert({
                    title: "10 maximum allowed"
                });
            }
        };
        
        /*
        vm.itemsCollection = [{
            thumbnailUrl: '././img/sansa.jpg',
            title: 'Sansa Stark',
            subtitle: 'test@text.com',
            id: '45568fs44797879'
        },{
            thumbnailUrl: '././img/tyrion.jpg',
            title: 'Tyrion Lanister',
            subtitle: 'test@text.com',
            id: 'Bhmrr556lmd879'
        }];
        */
        vm.selectedUsers = [];

        $scope.$watch('vm.SearchService.data()', function (newVal, oldVal) {
            if (_.has(newVal, 'index')) {
                vm.listRecipients = newVal.results;
                vm.searchTotal = newVal.total;
                vm.moRecipients = (vm.searchTotal > countSet_CONSTANT);
                vm.searchIndex++;

                _.forEach(vm.selectedUsers, function (parentValue, parentKey) {
                    var user = _.find(vm.listRecipients, { 'id': parentValue.id });
                    if (user)
                        user.checked = true;
                });
            }
        });

        vm.mdOnDelete = function (id) {
            var user = _.find(vm.listRecipients, { 'id': id });
            user.checked = false;
        };

        vm.submitFunction = function () {
            //Encryption.clearKeys();
            //_.split(response.publickey, ',') 
            //Encryption.addKey(vm.keys).then(function (response) {
            $ionicLoading.show({
                template: 'Sending...'
            });
            var selected = _.zip(_.map(vm.selectedUsers, 'id'), _.map(vm.selectedUsers, 'publickey'));
            var userKey = [$scope.user.id, $scope.user.publicKey];
            selected.unshift(userKey);
            Thread.sendMessage(selected, vm.writingMessage, 0).then(function (response) {               
                Messages.updateThread(response, false).then(function(response){
                    $ionicLoading.hide();
                    $state.go("main.messages");
                });
                Thread.sendNotification(response.messageID);
            }, function () {
                $ionicLoading.hide();
            });
              
            //});
        };


    }]);
})();