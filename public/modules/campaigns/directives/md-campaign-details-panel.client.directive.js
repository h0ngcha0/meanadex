'use strict';

angular.module('campaigns').directive('mdCampaignDetailsPanel', [
  '$timeout',
  function($timeout){
    return {
      restrict: 'E',
      templateUrl: 'modules/campaigns/views/campaign-details-panel.client.view.html',
      link: function(scope, element, attrs) {
        scope.hideWarning = {
          campaignTitle: true,
          campaignDescription: true,
          campaignUrl: true,
          tosChecked: true
        };

        scope.saveDetails = function() {
          var status = 'ok';

          var verifyEmptyFun = function(field, hideErrVar) {
            if(!scope[field]) {
              scope.hideWarning[field] = false;
              status = 'not_ok';
            } else {
              scope.hideWarning[field] = true;
            }
          };

          [
            'campaignTitle',
            'campaignDescription',
            'campaignUrl',
            'tosChecked'
          ].forEach(function(obj) {
            verifyEmptyFun(obj);
          });

          console.log(scope.hideWarning);

          if(status === 'not_ok') {
          } else {
            scope.launchCampaign();
          }
        };
      }
    };
  }
]);
