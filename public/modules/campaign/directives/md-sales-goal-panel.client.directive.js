'use strict';

angular.module('campaign').directive('mdSalesGoalPanel', [
  '$timeout', 'mdCampaignInfoAccumulatorService',
  function($timeout, mdCampaignInfoAccumulatorService){
    return {
      restrict: 'E',
      templateUrl: 'modules/campaign/views/sales-goal-panel.client.view.html',
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
