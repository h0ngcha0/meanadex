/**
 * The angular resource abstraction that allows us to search images
 *
 * @see ResourceFactory
 */
angular.module('services').factory('SearchImages', ['ResourceFactory',
  function (ResourceFactory) {
    'use strict';

    var resource = ResourceFactory.build(
      '/searchImages/:id',
      '/searchImages/search',
      {id: '@_id'},
      true
    );

    ResourceFactory.applySearch(
      'SearchImages',
      resource,
      'full_name',
      {Text: 'q'}
    );

    return resource;
  }
]);
