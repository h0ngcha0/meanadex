'use strict';

angular.module('campaigns').factory('FeaturedCampaigns', [
  '$resource',
  function($resource) {
    return $resource('featured_campaigns',
      {},
      {
        query:
        {
          method: 'GET'
        }
      }
    );
  }
]);
