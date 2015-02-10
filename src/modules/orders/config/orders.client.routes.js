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
      state('finishOrder', {
        url: '/orders/:campaignId',
        templateUrl: 'modules/orders/views/finish-order.client.view.html',
        controller: 'OrdersController'
      });
  }
]);
