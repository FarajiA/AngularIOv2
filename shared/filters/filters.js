; (function () {
   /*
    angular.module('App').filter('messageDate', function () {

        return function (date) {
            var updated = {};
            var currentDate = new Date();

            var hourAgo = currentDate.setHours(currentDate.getHours() - 1);
            var dayAgo = currentDate.setHours(currentDate.getHours() - 24);
            var weekAgo = currentDate.setHours(currentDate.getHours() - 168);

            var lessthanHourAgo = moment(hourAgo).isBefore(date);
            var lessthanDayAgo = moment(dayAgo).isBefore(date);
            var lessthanWeekAgo = moment(weekAgo).isBefore(date);
            
            if (lessthanHourAgo)
                updated = moment(date).startOf('minute').fromNow();

            else if (lessthanDayAgo)
                updated = moment(date).startOf('hour').fromNow();

            else if (lessthanWeekAgo)
                updated = moment(date).startOf('day').fromNow();

            else
                updated = moment(date).format("MMM Do YYYY");

            return updated;
        }

    });
     */   


})();