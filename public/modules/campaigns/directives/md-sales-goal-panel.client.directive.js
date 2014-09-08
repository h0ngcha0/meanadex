'use strict';

angular.module('campaigns').directive('mdSalesGoalPanel', [
  function($timeout){
    return {
      restrict: 'E',
      templateUrl: 'modules/campaigns/views/sales-goal-panel.client.view.html',
      link: function(scope, element, attrs) {
      }
    };
  }
]);
