'use strict';

/* global moment */
/* global d3 */

// Campaigns controller
angular.module('dashboard').controller('DashboardIncomeGraphController', [
  '$scope', 'Dashboard',
  function($scope, Dashboard) {
    $scope.loadIncomeData = function(fromDate, toDate, callback) {
      Dashboard.incomeCreated.query(
        {
          startDate: fromDate,
          endDate: toDate,
          offset: new Date().getTimezoneOffset()
        },
        function(data) {
          callback(null, data);
        },
        function(err) {
          callback(err);
        }
      );
    };
  }
]);
