'use strict';

angular.module('campaign').directive('mdCampaignSummaryPanel', [
  '$timeout', 'mdCampaignInfoAccumulatorService',
  function($timeout, mdCampaignInfoAccumulatorService){
    return {
      restrict: 'E',
      scope: {
        campaignTitle: '=',
        campaignDescription: '=',
        campaignSalesGoal: '=',
        campaignUrl: '=',
        currentCampaignLength: '=',
        tshirtVariant: '=',
        tshirtType: '=',
        tshirtBaseCost: '=',
        tshirtPrice: '='
      },
      templateUrl: 'modules/campaign/views/campaign-summary-panel.client.view.html',
      link: function(scope, element, attrs) {
        $timeout(function() {
          scope.$apply(function() {
            var cs = mdCampaignInfoAccumulatorService;

            scope.campaignTitle = cs.getTitle();
            scope.campaignDescription = cs.getDescription();
            scope.campaignSalesGoal = cs.getSalesGoal();
            scope.campaignUrl = cs.getUrl();
            scope.currentCampaignLength = cs.getLength();
            scope.tshirtVariant = cs.getTshirtVariant();
            scope.tshirtType = cs.getTshirtType() === null ? null : cs.getTshirtType().id;
            scope.tshirtBaseCost = cs.getBaseCost();
            scope.tshirtPrice = cs.getPrice();
          });
        }, 0);
      }
    };
  }
]);
