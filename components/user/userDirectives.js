; (function () {
    angular.module('App').directive('userChoice', ['$ionicPopup', '$timeout', 'User', 'Block', function ($ionicPopup, $timeout, User, Block) {
        return {
            restrict: 'A',
            require: '?ngModel',
            link: function (scope, elem, attrs, ctrl) {

                var UserRequest = function () {
                    scope.$apply(function () {
                        /*
                        Decision.request(UserObject.details().GUID).then(function (response) {
                            if (response === 1) {
                                elem.attr('data-chasing', "requested").attr("disabled", "disabled");
                                scope.symbol = 2;
                            }
                            else {
                                scope.symbol = 0;
                            }
                        });
                        */
                    });
                };

                var UserFollow = function () {
                    scope.$apply(function () {
                        /*
                        Decision.follow(UserObject.details().GUID).then(function (response) {
                            if (response === 1) {
                                elem.attr('data-chasing', true);
                                UserObject.details().isChasing = true;
                                scope.noChasers++;
                                scope.symbol = 1;
                                scope.$emit('emit_Chasers', { action: "chasing" });
                            }
                            else {
                                scope.symbol = 0;
                            }
                        });
                        */
                    });
                };

                var UserUnfollow = function () {
                    scope.$apply(function () {
                        /*
                        Decision.unfollow(UserObject.details().GUID).then(function (response) {
                            if (response === 1) {
                                elem.attr('data-chasing', false);
                                UserObject.details().isChasing = false;
                                scope.noChasers--;
                                scope.symbol = 0;
                                scope.$emit('emit_Chasers', { action: "chasing" });
                            }
                            else {
                                scope.symbol = 1;
                            }
                        });
                        */
                    });
                };

                var UserUnblock = function () {
                    scope.$apply(function () {
                        /*
                        var unblockPopup = $ionicPopup.show({
                            title: BlockConst.blockedConfirmTitle,
                            buttons: [
                                {
                                    text: 'Cancel',
                                    onTap: function (e) {
                                        scope.symbol = 3;
                                    }
                                },
                                {
                                    text: '<b>Sure</b>',
                                    type: 'button-positive',
                                    onTap: function (e) {
                                        Block.DeleteBlock(Block.data().ID).then(function (response) {
                                            unblockPopup.close();
                                            if (response === 1) {
                                                scope.symbol = 0;
                                                elem.attr('data-chasing', false);
                                            } else {
                                                var alertPopup = $ionicPopup.alert({
                                                    title: 'Whoops!',
                                                    template: updatedUserConst.unsuccessfulUpdate
                                                });
                                            }
                                        });

                                    }
                                }
                            ]
                        });
                        */
                    });
                };

                scope.$watch(attrs.ngModel, function (newValue, oldValue) {
                    /*
                    if (newValue >= 0 && newValue < 4) {
                        scope.loadingFollow = false;
                    }
                    switch (newValue) {
                        case 0:
                            elem.attr('data-chasing', false);
                            scope.isFollowing = activityConst.follow;
                            break;
                        case 1:
                            elem.attr('data-chasing', true);
                            scope.isFollowing = activityConst.following;
                            break;
                        case 2:
                            elem.attr('data-chasing', "requested").attr("disabled", "disabled");
                            scope.isFollowing = activityConst.requested;
                            break;
                        case 3:
                            elem.attr('data-chasing', "unblock");
                            scope.isFollowing = activityConst.unblock;
                            break;
                    }
                    */
                });

                elem.on('click', function (e) {
                    /*
                    scope.$apply(function () {
                        scope.symbol = 4;
                        scope.loadingFollow = true;
                    });
                    if (UserObject.getBlocked())
                        UserUnblock();
                    else if (UserObject.details().isprivate && UserObject.details().isChasing == 0)
                        UserRequest();
                    else if (!UserObject.details().isprivate && UserObject.details().isChasing == 1)
                        UserUnfollow();
                    else
                        UserFollow();
                    */
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
                    /*
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
                    */
                });
            }
        }
    }]);

})();