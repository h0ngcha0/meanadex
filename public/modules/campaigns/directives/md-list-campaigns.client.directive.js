'use strict';

angular.module('campaigns').directive('mdListCampaign', [
  function($timeout){
    return {
      restrict: 'E',
      templateUrl: 'modules/campaigns/views/campaigns-table.client.view.html',
      link: function(scope, element, attrs) {
      }
    };
  }
]);
