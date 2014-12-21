'use strict';

/* global moment */
/* global d3 */

// Campaigns controller
angular.module('orders').controller('OrdersGraphController', [
  '$scope', 'Orders',
  function($scope, Orders) {
    $scope.loadOrdersData = function(fromDate, toDate, callback) {
      Orders.query(
        {
          startDate: fromDate,
          endDate: toDate
        },
        function(data) {
          var ts = _.map(data, function(d) {
                     var dd = moment(Date.parse(d.created_at));
                     return dd;
                   });

          callback(null, ts);
        },
        function(err) {
          callback(err);
        }
      );
    };
  }
]);
