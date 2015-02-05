/**
 * The angular resource abstraction that allows us to search, access, and
 * modify tshirts.
 *
 * @see ResourceFactory
 */
angular.module('services').factory('Tshirts', ['ResourceFactory',
  function (ResourceFactory) {
    'use strict';

    var resource = ResourceFactory.build(
      '/tshirts/:id',
      '/tshirts/search',
      {id: '@_id'}
    );

    ResourceFactory.applySearch(
      'Tshirts',
      resource,
      'full_name',
      {Text: 'q'}
    );

    return resource;
  }
]);
