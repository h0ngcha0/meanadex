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
      views: {
        'tshirtView': {
          templateUrl: 'modules/tshirts/views/list-tshirts.client.view.html',
          controller: 'TshirtsController'
        }
      }
    })
    .state('admin.tshirtCreate', {
      url: '/tshirts/create',
      views: {
        'tshirtView': {
          templateUrl: 'modules/tshirts/views/create-tshirt.client.view.html',
          controller: 'TshirtsController'
        }
      }
    })
    .state('admin.tshirtDetail', {
      url: '/tshirts/:tshirtId',
      views: {
        'tshirtView': {
          templateUrl: 'modules/tshirts/views/view-tshirt.client.view.html',
          controller: 'TshirtsController'
        }
      }
    })
    .state('admin.campaigns', {
      abstract: true,
      url: '/campaigns'
    })
    ;
  }
]);
