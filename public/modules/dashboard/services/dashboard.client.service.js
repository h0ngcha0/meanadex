'use strict';

// Dashboard service used for communicating with the dashboard REST endpoint
angular.module('dashboard').factory('Dashboard', ['$resource', 'theApiBase',
  function($resource, theApiBase) {
    return {
      totalIncome: $resource(
        theApiBase + '/dashboard/totalIncome',
        {},
        {
          query: {method: 'GET', params: {}, isArray: false}
        }
      ),
      totalOrders: $resource(
        theApiBase + '/dashboard/totalOrders',
        {},
        {
          query: {method: 'GET', params: {}, isArray: false}
        }
      ),
      totalCampaigns: $resource(
        theApiBase + '/dashboard/totalCampaigns',
        {},
        {
          query: {method: 'GET', params: {}, isArray: false}
        }
      ),
      activeCampaigns: $resource(
        theApiBase + '/dashboard/activeCampaigns',
        {},
        {
          query: {method: 'GET', params: {}, isArray: false}
        }
      ),
      incomeCreated: $resource(
        theApiBase + '/dashboard/incomeCreated',
        {},
        {
          query: {method: 'GET', params: {}, isArray: false}
        }
      ),
      campaignsCreated: $resource(
        theApiBase + '/dashboard/campaignsCreated',
        {},
        {
          query: {method: 'GET', params: {}, isArray: false}
        }
      ),
      ordersCreated: $resource(
        theApiBase + '/dashboard/ordersCreated',
        {},
        {
          query: {method: 'GET', params: {}, isArray: false}
        }
      )
    };
  }
]);
