'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', [
  '$scope', '$stateParams', '$location', 'Authentication', 'Orders',
  '$filter', 'DashboardUtils',
  function($scope, $stateParams, $location, Authentication, Orders,
           $filter, DashboardUtils) {

    $scope.authentication = Authentication;

    // Remove existing Order
    $scope.remove = function( order ) {
      if ( order ) {
        order.$remove();

        for (var i in $scope.orders ) {
          if ($scope.orders [i] === order ) {
            $scope.orders.splice(i, 1);
          }
        }
      } else {
        $scope.order.$remove(function() {
          $location.path('orders');
        });
      }
    };

    // Update existing Order
    $scope.update = function() {
      var order = $scope.order ;

      order.$update(function() {
        $location.path('orders/' + order._id);
      }, function(errorResponse) {
           $scope.error = errorResponse.data.message;
         });
    };

    // Find a list of Orders
    $scope.find = function() {
      $scope.orders = Orders.query();
    };

    // Find existing Order
    $scope.findOne = function() {
      $scope.order = Orders.get({
        orderId: $stateParams.orderId
      });
    };

    $scope.onRemove = function(order) {
      $scope.remove(order);
      $scope.tableParams.reload();
    };

    $scope.tableParams = DashboardUtils.newTableParams(
      function($defer, params) {
        var orderedData = params.filter() ?
          $filter('filter')($scope.orders, params.filter()) :
          $scope.orders;

        params.total(orderedData.length);
        $defer.resolve(orderedData);
      }
    );

    // Find a list of Orders and load them into order table
    $scope.loadAllOrdersInTableData = function() {
      $scope.orders = Orders.query(
        function(data) {
          $scope.tableParams.reload();
        });
    };

  }
]);
