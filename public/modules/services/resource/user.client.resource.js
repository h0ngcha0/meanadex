/**
 * The angular resource abstraction that allows us to search, access, and
 * modify users.
 *
 * @see ResourceFactory
 */
angular.module('services').factory('Users', ['ResourceFactory',
  function (ResourceFactory) {
    'use strict';

    var resource = ResourceFactory.build(
      '/users/:id',
      '/users/search',
      {id: '@id'}
    );

    ResourceFactory.applySearch(
      'Users',
      resource,
      'full_name',
      {Text: 'q'}
    );

    return resource;
  }
]);
