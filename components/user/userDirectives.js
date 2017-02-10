; (function () {
    angular.module('App').directive('userChoice', ['$ionicPopup', '$timeout', 'User', 'Decision', 'Block', function ($ionicPopup, $timeout, User, Decision, Block) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, elem, attrs, ctrl) {

                var UserRequest = function () {
                    scope.$apply(function () {
                        Decision.request(User.data().id).then(function (response) {
                            if (response) {
                                elem.attr('data-chasing', "requested").attr("disabled", "disabled");
                                scope.relationship = 2;
                                User.data().relationship = 2;
                            }
                        });

                    });
                };

                var UserFollow = function () {
                    scope.$apply(function () {
                        Decision.follow(User.data().id).then(function (response) {
                            if (response) {
                                elem.attr('data-chasing', true);
                                scope.chasers++;
                                scope.relationship = 1;
                                User.data().relationship = 1;
                                scope.$emit('emit_Action', { action: "chasing" });
                            }
                        });

                    });
                };

                var UserUnfollow = function () {
                    scope.$apply(function () {
                        Decision.unfollow(User.data().id).then(function (response) {
                            if (response) {
                                elem.attr('data-chasing', false);
                                scope.chasers--;
                                scope.relationship = 0;
                                User.data().relationship = 0;
                                scope.$emit('emit_Action', { action: "chasing" });
                            }
                        });

                    });
                };

                var UserUnblock = function () {
                    scope.$apply(function () {
                        var unblockPopup = $ionicPopup.show({
                            title: block_CONSTANT.blockedConfirmTitle,
                            buttons: [
                                {
                                    text: 'Cancel',
                                    onTap: function (e) {
                                        scope.relationship = 3;
                                    }
                                },
                                {
                                    text: '<b>Sure</b>',
                                    type: 'button-positive',
                                    onTap: function (e) {
                                        Block.DeleteBlock(User.data().id).then(function (response) {
                                            unblockPopup.close();
                                            if (response) {
                                                scope.relationship = 0;
                                                User.data().relationship = 0;
                                                elem.attr('data-chasing', false);
                                            } else {
                                                var alertPopup = $ionicPopup.alert({
                                                    title: genericError_CONSTANT
                                                });
                                            }
                                        });

                                    }
                                }
                            ]
                        });

                    });
                };

                scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                    if (newValue >= 0 && newValue < 4) {
                        scope.loadingFollow = false;
                    }
                    switch (newValue) {
                        case 0:
                            elem.attr('data-chasing', false);
                            scope.isFollowing = decision_CONSTANT.follow;
                            break;
                        case 1:
                            elem.attr('data-chasing', true);
                            scope.isFollowing = decision_CONSTANT.following;
                            break;
                        case 2:
                            elem.attr('data-chasing', "requested").attr("disabled", "disabled");
                            scope.isFollowing = decision_CONSTANT.requested;
                            break;
                        case 3:
                            elem.attr('data-chasing', "unblock");
                            scope.isFollowing = decision_CONSTANT.unblock;
                            break;
                    }

                });

                elem.on('click', function (e) {
                    scope.$apply(function () {
                        scope.relationship = 4;
                        scope.loadingFollow = true;
                    });
                    if (User.data().relationship == 3)
                        UserUnblock();
                    else if (User.data().private && User.data().relationship == 0)
                        UserRequest();
                    else if (User.data().relationship == 1)
                        UserUnfollow();
                    else
                        UserFollow();
                });
            }
        }
    }]);

    angular.module('App').directive('userBroadcast', ['$interval', function ($interval) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, elem, attrs, ctrl) {
                scope.interval;
                var promise;
                scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                    if (newValue) {
                        if (UserObject.details().isChasing == 1 || !UserObject.details().isprivate) {
                            elem.removeAttr("disabled")
                            .attr("data-lat", UserObject.details().latitude)
                            .attr("data-long", UserObject.details().longitude)
                            .text(userDetails.viewlocation)
                            .removeClass("ion-locked");
                        }
                        else if (UserObject.details().isprivate) {
                            elem.attr("disabled", "disabled")
                            .text(userDetails.broadcasting)
                            .addClass("ion-locked");
                        }
                    }
                    else {
                        elem.attr("disabled", "disabled")
                        .text(userDetails.notBroadcasting);
                    }

                });
            }
        }
    }]);

})();