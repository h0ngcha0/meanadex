'use strict';

//Setting up route
angular.module('orders').config([
  '$stateProvider',
  function($stateProvider) {
    // Orders state routing
    $stateProvider.
      state('listOrders', {
        url: '/orders',
        templateUrl: 'modules/orders/views/list-orders.client.view.html',
        controller: 'OrdersController'
      }).
      state('createOrder', {
        url: '/orders/create?campaign',
        templateUrl: 'modules/orders/views/create-order.client.view.html',
        controller: 'CreateOrderController'
      }).
      state('viewOrder', {
        url: '/orders/:orderId',
        templateUrl: 'modules/orders/views/view-order.client.view.html',
        controller: 'OrdersController'
      }).
      state('editOrder', {
        url: '/orders/:orderId/edit',
        templateUrl: 'modules/orders/views/edit-order.client.view.html',
        controller: 'OrdersController'
      });
  }
]);
