/**
 * The angular resource abstraction that allows us to search, access, and
 * modify featuredCampaigns.
 *
 * @see ResourceFactory
 */
angular.module('services').factory('FeaturedCampaigns', ['ResourceFactory',
  function (ResourceFactory) {
    'use strict';

    var resource = ResourceFactory.build(
      '/featuredCampaigns/:id',
      '/featuredCampaigns/search',
      {id: '@_id'},
      true
    );

    ResourceFactory.applySearch(
      'FeaturedCampaigns',
      resource,
      'full_name',
      {Text: 'q'}
    );

    return resource;
  }
]);
