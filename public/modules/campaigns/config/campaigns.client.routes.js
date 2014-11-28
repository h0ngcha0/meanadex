'use strict';

//Setting up route
angular.module('campaigns').config([
  '$stateProvider',
  function($stateProvider) {
    // Campaigns state routing
    $stateProvider.
    state('campaignSalesGoal', {
      url: '/campaign_sales_goal',
      templateUrl: 'modules/campaigns/views/campaign-sales-goal.client.view.html',
      controller: 'CampaignsSalesGoalController'
    }).
    state('campaignDetails', {
      url: '/campaign_details',
      templateUrl: 'modules/campaigns/views/campaign-details.client.view.html',
      controller: 'CampaignsSalesDetailsController'
    }).
    state('campaignSummary', {
      url: '/campaign_summary',
      templateUrl: 'modules/campaigns/views/campaign-summary.client.view.html',
      controller: 'CampaignsSummaryController'
    }).
    state('listCampaigns', {
      url: '/campaigns',
      templateUrl: 'modules/campaigns/views/list-campaigns.client.view.html',
      controller: 'CampaignsController'
    }).
    state('campaignNotFound', {
      url: '/campaign_not_found',
      templateUrl: 'modules/campaigns/views/campaign-not-found.client.view.html',
      controller: 'CampaignsController'
    }).
    state('viewCampaign', {
      url: '/campaigns/:campaignId',
      templateUrl: 'modules/campaigns/views/view-campaign.client.view.html',
      controller: 'CampaignsController'
    });
  }
]);
