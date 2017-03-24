; (function () {
   
    angular.module('App').filter('messageDate', function () {
        return function (dateValue, detail) {
            var updated = {};
            var currentDate = new Date();

            var hourAgo = currentDate.setHours(currentDate.getHours() - 1);
            var dayAgo = currentDate.setHours(currentDate.getHours() - 24);
            var weekAgo = currentDate.setHours(currentDate.getHours() - 168);
            var yearAgo = currentDate.setHours(currentDate.getHours() - 8760);

            var UTCdate = moment.utc(dateValue);
            var date = UTCdate.local();

            var lessthanHourAgo = moment(hourAgo).isBefore(date);
            var lessthanDayAgo = moment(dayAgo).isBefore(date);
            var lessthanWeekAgo = moment(weekAgo).isBefore(date);
            var lessthanYearAgo = moment(yearAgo).isBefore(date);
            
            if (lessthanHourAgo)
                    updated = moment(date).startOf('minute').fromNow();

            else if (lessthanDayAgo)
                updated = moment(date).format("h:mm A");

            else if (lessthanWeekAgo)
                if (!detail)
                    updated = moment(date).format('dddd');
                else
                    updated = moment(date).format('dddd h:mm A');

            else if (lessthanYearAgo)
                if (!detail)
                    updated = moment(date).format('MMM D');
                else
                    updated = moment(date).format('MMM D h:mm A');
            else
                if (!detail)
                    updated = moment(date).format("MMMM D YYYY");
                else
                    updated = moment(date).format("MMMM D YYYY h:mm A");
            /*
            else if (lessthanDayAgo)
                updated = moment(date).startOf('hour').fromNow();

            else if (lessthanWeekAgo)
                updated = moment(date).format('dddd');

            else if (lessthanYearAgo)
                updated = moment(date).format("MMM Do");

            else
                updated = moment(date).format("MMMM Do YYYY");
            */
            return updated;
        }

    })
    .filter('messageDecrypt', ['Encryption', function (Encryption) {
        return function (message) {
            var updated = {};
            updated = Encryption.Decrypt(message);
            return updated.$$state.value;
        }
    }])
    .filter('nl2br', ['$filter',
        function ($filter) {
            return function (data) {
                if (!data) return data;
                return data.replace(/\n\r?/g, '<br />');
            };
     }]);
})();