'use strict';

//Setting up route
angular.module('campaign').config([
  '$stateProvider',
  function($stateProvider) {
    // Designer state routing
    $stateProvider.
      state('campaign_sales_goal', {
        url: '/campaign_sales_goal',
        templateUrl: 'modules/campaign/views/campaign-sales-goal.client.view.html',
        controller: 'CampaignController'
      }).
      state('campaign_details', {
        url: '/campaign_details',
        templateUrl: 'modules/campaign/views/campaign-details.client.view.html',
        controller: 'CampaignController'
      }).
      state('campaign_summary', {
        url: '/campaign_summary',
        templateUrl: 'modules/campaign/views/campaign-summary.client.view.html',
        controller: 'CampaignController'
      });
  }
]);
