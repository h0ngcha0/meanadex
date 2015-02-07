'use strict';

/* global moment */

angular.module('dashboard').factory('DashboardUtils', [
  'ngTableParams', 'CurrentUser',
  function(NgTableParams, CurrentUser) {
    var tableOptions = {
      page: 1,
      count: 10,
      dataLength: 0,
      filter: undefined
    };

    /**
     * When we start, create a promise for the current user.
     */
    var cuPromise = CurrentUser.resolve();

    /**
     * The current user.
     *
     * @param currentUser
     */
    var currentUser = null;
    cuPromise.then(function (user) {
      currentUser = user;
    });

    return {
      newTableParams: function(getDataIn, pageIn, countIn, dataLengthIn) {
        return new NgTableParams(
          {
            page: pageIn || tableOptions.page,
            count: countIn || tableOptions.count
          },
          {
            total: dataLengthIn || tableOptions.dataLength,
            getData: getDataIn
          }
        );
      },
      initialCalendarDates: function() {

        var today = new Date(),
            weekAgo = moment(today).subtract(6, 'd').startOf('day').toDate(),
            fromMinDate = moment(currentUser.created).startOf('day').toDate(),
            fromDate = weekAgo.getTime() > fromMinDate.getTime() ? weekAgo : fromMinDate,
            toDate = moment(today).endOf('day').toDate();

        return {
          fromDate: fromDate,
          fromMinDate: fromMinDate,
          toDate: toDate,
          toMaxDate: toDate
        };
      }
    };
  }
]);
