/**
 * The angular resource abstraction that allows us to search, access, and
 * modify images.
 *
 * @see ResourceFactory
 */
angular.module('services').factory('Images', ['ResourceFactory',
  function (ResourceFactory) {
    'use strict';

    var resource = ResourceFactory.build(
      '/images/:id',
      '/images/search',
      {id: '@id'}
    );

    ResourceFactory.applySearch(
      'Images',
      resource,
      'full_name',
      {Text: 'q'}
    );

    return resource;
  }
]);
