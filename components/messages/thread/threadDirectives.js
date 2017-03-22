; (function () {
    angular.module('App').requires.push('monospaced.elastic');
    angular.module('App')
        .directive('elastic', function () {
        return {
            restric: 'A',
            link: function (scope, el, attr) {
                scope.$on('elastic:resize', function (event, element, oldHeight, newHeight) {
                    newHeight = Math.max(44, newHeight);
                    el[0].style.height = newHeight + 'px';
                });
            }
        }
        });
    angular.module('ionic')
.controller('$ionInfiniteScrollReverse', [
  '$scope',
  '$attrs',
  '$element',
  '$timeout',
function ($scope, $attrs, $element, $timeout) {
    var self = this;
    self.isLoading = false;

    $scope.icon = function () {
        return angular.isDefined($attrs.icon) ? $attrs.icon : 'ion-load-d';
    };

    $scope.spinner = function () {
        return angular.isDefined($attrs.spinner) ? $attrs.spinner : '';
    };

    $scope.$on('scroll.infiniteScrollComplete', function () {
        finishInfiniteScroll();
    });

    $scope.$on('$destroy', function () {
        if (self.scrollCtrl && self.scrollCtrl.$element) self.scrollCtrl.$element.off('scroll', self.checkBounds);
        if (self.scrollEl && self.scrollEl.removeEventListener) {
            self.scrollEl.removeEventListener('scroll', self.checkBounds);
        }
    });

    // debounce checking infinite scroll events
    self.checkBounds = ionic.Utils.throttle(checkInfiniteBounds, 300);

    function onInfinite() {
        ionic.requestAnimationFrame(function () {
            $element[0].classList.add('active');
        });
        self.isLoading = true;
        $scope.$parent && $scope.$parent.$apply($attrs.onInfinite || '');
    }

    function finishInfiniteScroll() {
        ionic.requestAnimationFrame(function () {
            $element[0].classList.remove('active');
        });
        $timeout(function () {
            if (self.jsScrolling) self.scrollView.resize();
            // only check bounds again immediately if the page isn't cached (scroll el has height)
            if ((self.jsScrolling && self.scrollView.__container && self.scrollView.__container.offsetHeight > 0) ||
            !self.jsScrolling) {
                self.checkBounds();
            }
        }, 30, false);
        self.isLoading = false;
    }

    // check if we've scrolled far enough to trigger an infinite scroll
    function checkInfiniteBounds() {
        if (self.isLoading) return;
        var maxScroll = {};

        if (self.jsScrolling) {
            maxScroll = self.getJSMaxScroll();
            var scrollValues = self.scrollView.getValues();
            if ($attrs.reverse) {
                if ((maxScroll.left !== -1 && scrollValues.left <= maxScroll.left) ||
                  (maxScroll.top !== -1 && scrollValues.top <= maxScroll.top)) {
                    onInfinite();
                }
            } else {
                if ((maxScroll.left !== -1 && scrollValues.left >= maxScroll.left) ||
                  (maxScroll.top !== -1 && scrollValues.top >= maxScroll.top)) {
                    onInfinite();
                }
            }
        } else {
            maxScroll = self.getNativeMaxScroll();
            if ($attrs.reverse) {
                if ((
                  maxScroll.left !== -1 &&
                  self.scrollEl.scrollLeft <= maxScroll.left
                  ) || (
                  maxScroll.top !== -1 &&
                  self.scrollEl.scrollTop <= maxScroll.top
                  )) {
                    onInfinite();
                }
            } else {
                if ((
                  maxScroll.left !== -1 &&
                  self.scrollEl.scrollLeft >= maxScroll.left - self.scrollEl.clientWidth
                  ) || (
                  maxScroll.top !== -1 &&
                  self.scrollEl.scrollTop >= maxScroll.top - self.scrollEl.clientHeight
                  )) {
                    onInfinite();
                }
            }
        }
    }

    // determine the threshold at which we should fire an infinite scroll
    // note: this gets processed every scroll event, can it be cached?
    self.getJSMaxScroll = function () {
        var maxValues = self.scrollView.getScrollMax();
        return {
            left: self.scrollView.options.scrollingX ?
              calculateMaxValue(maxValues.left) :
              -1,
            top: self.scrollView.options.scrollingY ?
              calculateMaxValue(maxValues.top) :
              -1
        };
    };

    self.getNativeMaxScroll = function () {
        var maxValues = {
            left: self.scrollEl.scrollWidth,
            top: self.scrollEl.scrollHeight
        };
        var computedStyle = window.getComputedStyle(self.scrollEl) || {};
        return {
            left: maxValues.left &&
            (computedStyle.overflowX === 'scroll' ||
            computedStyle.overflowX === 'auto' ||
            self.scrollEl.style['overflow-x'] === 'scroll') ?
              calculateMaxValue(maxValues.left) : -1,
            top: maxValues.top &&
            (computedStyle.overflowY === 'scroll' ||
            computedStyle.overflowY === 'auto' ||
            self.scrollEl.style['overflow-y'] === 'scroll') ?
              calculateMaxValue(maxValues.top) : -1
        };
    };

    // determine pixel refresh distance based on % or value
    function calculateMaxValue(maximum) {
        var distance = ($attrs.distance || '2.5%').trim();
        var isPercent = distance.indexOf('%') !== -1;
        if ($attrs.reverse) {
            return isPercent ?
            maximum - (maximum * (1 - parseFloat(distance) / 100)) :
            parseFloat(distance);
        } else {
            return isPercent ?
            maximum * (1 - parseFloat(distance) / 100) :
            maximum - parseFloat(distance);
        }
    }

    //for testing
    self.__finishInfiniteScroll = finishInfiniteScroll;

}]);
    angular.module('ionic')
    .directive('ionInfiniteScrollReverse', ['$timeout', function ($timeout) {
    return {
        restrict: 'E',
        require: ['?^$ionicScroll', 'ionInfiniteScrollReverse'],
        template: function ($element, $attrs) {
            if ($attrs.icon) return '<i class="icon {{icon()}} icon-refreshing {{scrollingType}}"></i>';
            return '<ion-spinner icon="{{spinner()}}"></ion-spinner>';
        },
        scope: true,
        controller: '$ionInfiniteScrollReverse',
        link: function ($scope, $element, $attrs, ctrls) {
            var infiniteScrollCtrl = ctrls[1];
            var scrollCtrl = infiniteScrollCtrl.scrollCtrl = ctrls[0];
            var jsScrolling = infiniteScrollCtrl.jsScrolling = !scrollCtrl.isNative();

            // if this view is not beneath a scrollCtrl, it can't be injected, proceed w/ native scrolling
            if (jsScrolling) {
                infiniteScrollCtrl.scrollView = scrollCtrl.scrollView;
                $scope.scrollingType = 'js-scrolling';
                //bind to JS scroll events
                scrollCtrl.$element.on('scroll', infiniteScrollCtrl.checkBounds);
            } else {
                // grabbing the scrollable element, to determine dimensions, and current scroll pos
                var scrollEl = ionic.DomUtil.getParentOrSelfWithClass($element[0].parentNode, 'overflow-scroll');
                infiniteScrollCtrl.scrollEl = scrollEl;
                // if there's no scroll controller, and no overflow scroll div, infinite scroll wont work
                if (!scrollEl) {
                    throw 'Infinite scroll must be used inside a scrollable div';
                }
                //bind to native scroll events
                infiniteScrollCtrl.scrollEl.addEventListener('scroll', infiniteScrollCtrl.checkBounds);
            }

            // Optionally check bounds on start after scrollView is fully rendered
            var doImmediateCheck = angular.isDefined($attrs.immediateCheck) ? $scope.$eval($attrs.immediateCheck) : true;
            if (doImmediateCheck) {
                $timeout(function () { infiniteScrollCtrl.checkBounds(); });
            }
        }
    };
}]);

})();