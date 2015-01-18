/**
 * A collection of date utilities.
 *
 */
angular.module('util').factory('DateUtil',
  function () {
    'use strict';

    return {

      /**
       * Helper to check if a date needs to be formatted using
       * TimeAgo plugion, or displaying UTC date
       *
       * @param date The date to be checked.
       * @returns {boolean} True if time ago needs to be used.
       */
      needsTimeAgo: function (targetDate) {
        if (targetDate)
        {
          var currentDate = new Date().getTime();
          var daydiff = (currentDate - Date.parse(targetDate))/
                        (1000*60*60*24);
          return (daydiff < 1);
        }
        else
        {
          return true;
        }
      }
    };
  }
);
