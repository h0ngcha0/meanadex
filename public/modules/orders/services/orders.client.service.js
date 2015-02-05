/**
 * The angular resource abstraction that allows us to search, access, and
 * modify orders.
 *
 * @see ResourceFactory
 */
angular.module('services').factory('Orders', ['ResourceFactory',
  function (ResourceFactory) {
    'use strict';

    var resource = ResourceFactory.build(
      '/orders/:id',
      '/orders/search',
      {id: '@id'},
      true
    );

    ResourceFactory.applySearch(
      'Orders',
      resource,
      'full_name',
      {Text: 'q'}
    );

    return resource;
  }
]);
