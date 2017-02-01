; (function () {
    angular.module('App').factory("Groups", ['$http', '$q', 'UserStore', function ($http, $q, UserStore) {
       
        var groupsList = [];
        var Groups = {};

        return Groups;

    }]);

})();