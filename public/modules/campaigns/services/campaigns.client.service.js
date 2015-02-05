/**
 * The angular resource abstraction that allows us to search, access, and
 * modify campaigns.
 *
 * @see ResourceFactory
 */
angular.module('services').factory('Campaigns', ['ResourceFactory',
  function (ResourceFactory) {
    'use strict';

    var resource = ResourceFactory.build(
      '/campaigns/:id',
      '/campaigns/search',
      {id: '@id'},
      true
    );

    ResourceFactory.applySearch(
      'Campaigns',
      resource,
      'full_name',
      {Text: 'q'}
    );

    return resource;
  }
]);
