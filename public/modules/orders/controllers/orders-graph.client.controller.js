'use strict';

/* global moment */
/* global d3 */

// Campaigns controller
angular.module('orders').controller('OrdersGraphController', [
  '$scope', 'Dashboard',
  function($scope, Dashboard) {
    $scope.loadOrdersData = function(fromDate, toDate, callback) {
      Dashboard.ordersCreated.query(
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
