'use strict';

//Images service used to communicate Images REST endpoints
angular.module('images').factory('Images', [
  '$resource',
  function($resource) {
    return $resource(
      'images/:imageId',
      {
        imageId: '@_id'
      },
      {
        update: {
          method: 'PUT'
        }
      });
  }
]);
