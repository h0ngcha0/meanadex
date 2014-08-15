'use strict';

//Setting up route
angular.module('designer').config([
  '$stateProvider',
  function($stateProvider) {
    // Designer state routing
    $stateProvider.
      state('designer', {
        url: '/designer',
        templateUrl: 'modules/designer/views/designer.client.view.html'
      });
  }
]);
