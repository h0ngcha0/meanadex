'use strict';

//Setting up route
angular.module('admin').config([
  '$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
      .when('/admin', '/admin/tshirts')

    // Admin state routing
    $stateProvider.
      state('admin', {
        url: '/admin',
        templateUrl: 'modules/admin/views/admin.client.view.html',
        controller: 'AdminController'
      })
    .state('admin.tshirts', {
      url: '/tshirts',
      templateUrl: 'modules/tshirts/views/list-tshirts.client.view.html',
      controller: 'TshirtsController'
    })
    .state('admin.tshirts.detail', {
      url: '/:tshirtId',
      template: '<bla>xx<bla>',
      controller: 'TshirtsController'
    })
    .state('admin.campaigns', {
      abstract: true,
      url: '/campaigns'
    })
    ;
  }
]);
