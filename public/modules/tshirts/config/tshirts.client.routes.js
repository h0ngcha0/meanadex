'use strict';

//Setting up route
angular.module('tshirts').config([
  '$stateProvider',
  function($stateProvider) {
    // Tshirts state routing
    $stateProvider.
      state('listTshirts', {
        url: '/tshirts',
        templateUrl: 'modules/tshirts/views/list-tshirts.client.view.html'
      }).
      state('createTshirt', {
        url: '/tshirts/create',
        templateUrl: 'modules/tshirts/views/create-tshirt.client.view.html'
      }).
      state('viewTshirt', {
        url: '/tshirts/:tshirtId',
        templateUrl: 'modules/tshirts/views/view-tshirt.client.view.html'
      }).
      state('editTshirt', {
        url: '/tshirts/:tshirtId/edit',
        templateUrl: 'modules/tshirts/views/edit-tshirt.client.view.html'
      });
  }
]);
