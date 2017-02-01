; (function () {
   
    angular.module('App').filter('messageDate', function () {

        return function (date) {
            var updated = {};
            var currentDate = new Date();

            var hourAgo = currentDate.setHours(currentDate.getHours() - 1);
            var dayAgo = currentDate.setHours(currentDate.getHours() - 24);
            var weekAgo = currentDate.setHours(currentDate.getHours() - 168);
            var yearAgo = currentDate.setHours(currentDate.getHours() - 8760);

            var lessthanHourAgo = moment(hourAgo).isBefore(date);
            var lessthanDayAgo = moment(dayAgo).isBefore(date);
            var lessthanWeekAgo = moment(weekAgo).isBefore(date);
            var lessthanYearAgo = moment(yearAgo).isBefore(date);
            
            if (lessthanHourAgo)
                updated = moment(date).startOf('minute').fromNow();

            else if (lessthanDayAgo)
                updated = moment(date).startOf('hour').fromNow();

            else if (lessthanWeekAgo)
                updated = moment(date).format('dddd');

            else if (lessthanYearAgo)
                updated = moment(date).format("MMM Do");

            else
                updated = moment(date).format("MMMM Do YYYY");

            return updated;
        }

    })
    .filter('messageUsername', function () {

        return function (username) {

            var updated = {};
            var users = _.split(username, ',');

            if (users.length === 1)
                updated = username;
            else if (users.length === 2)
                updated = users[0] + ", " + users[1];
            else
                updated = users[0] + "+" + (users.length - 1) + " others";

            return updated;
        }
    })
    .filter('messageCorrespond', ['UserStore', function (UserStore) {

        return function (blast, ID, corresponder) {

            var updated = {};
            var user = UserStore.data();

            if (blast && user.id === ID)
                updated = "blast";
            else
                updated = corresponder;

            return updated;
        }
    }])
    .filter('messageDecrypt', ['Encryption', function (Encryption) {
        return function (message) {
            var updated = {};
            updated = Encryption.Decrypt(message);
            return updated.$$state.value;
        }
    }]);
        


})();