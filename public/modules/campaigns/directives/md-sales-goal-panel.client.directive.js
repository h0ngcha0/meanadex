'use strict';

angular.module('campaigns').directive('mdSalesGoalPanel', [
  '$timeout', 'mdCampaignInfoAccumulatorService',
  function($timeout, mdCampaignInfoAccumulatorService){
    return {
      restrict: 'E',
      templateUrl: 'modules/campaigns/views/sales-goal-panel.client.view.html',
      link: function(scope, element, attrs) {
        $timeout(function() {
          scope.$apply(function() {
            scope.baseCost = mdCampaignInfoAccumulatorService.getBaseCost();
          });
        }, 0);
      }
    };
  }
]);
