'use strict';

// Setting up route
angular.module('core').config([
  '$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/landing');

    // Home state routing
    $stateProvider.
      state('index', {
        url: '/landing',
        templateUrl: 'modules/core/views/home.client.view.html',
        controller: 'HomeController'
      });
  }
]);
