'use strict';

//Images service used to communicate Images REST endpoints
angular.module('images').factory('Tags', [
  '$resource',
  function($resource) {
    return $resource(
      'tags/:tagId',
      {
        imageId: '@_id'
      }
    );
  }
]);
