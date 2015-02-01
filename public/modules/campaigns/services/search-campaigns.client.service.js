'use strict';

angular.module('campaigns').factory('SearchCampaigns', [
  '$resource',
  function($resource) {
    return $resource('search_campaigns',
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
