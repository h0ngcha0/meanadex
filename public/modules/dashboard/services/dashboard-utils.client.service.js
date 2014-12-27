'use strict';

/* global moment */

angular.module('dashboard').factory('DashboardUtils', [
  'ngTableParams', 'Authentication',
  function(NgTableParams, Authentication) {
    var tableOptions = {
      page: 1,
      count: 10,
      dataLength: 0,
      filter: undefined
    };

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
        var user = Authentication.user;
        var today = new Date(),
            weekAgo = moment(today).subtract(6, 'd').startOf('day').toDate(),
            fromMinDate = moment(user.created).startOf('day').toDate(),
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
