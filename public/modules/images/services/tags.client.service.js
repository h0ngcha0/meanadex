/**
 * The angular resource abstraction that allows us to search, access, and
 * modify tags.
 *
 * @see ResourceFactory
 */
angular.module('services').factory('Tags', ['ResourceFactory',
  function (ResourceFactory) {
    'use strict';

    var resource = ResourceFactory.build(
      '/tags/:id',
      '/tags/search',
      {id: '@id'}
    );

    ResourceFactory.applySearch(
      'Tags',
      resource,
      'full_name',
      {Text: 'q'}
    );

    return resource;
  }
]);
