'use strict';

//Tshirts service used to communicate Tshirts REST endpoints
angular.module('tshirts').factory('Tshirts', [
  '$resource',
  function($resource) {
    return $resource(
      'tshirts/:tshirtId',
      {
        tshirtId: '@_id'
      },
      {
        update: {
          method: 'PUT'
        },
        query:
        {
          method: 'GET',
          isArray: false
        }
      });
  }
]);
