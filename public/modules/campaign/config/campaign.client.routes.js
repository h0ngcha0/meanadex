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
      });
  }
]);
