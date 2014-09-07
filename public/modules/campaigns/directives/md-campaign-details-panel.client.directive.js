'use strict';

angular.module('campaigns').directive('mdCampaignDetailsPanel', [
  '$timeout',
  function($timeout){
    return {
      restrict: 'E',
      templateUrl: 'modules/campaigns/views/campaign-details-panel.client.view.html',
      link: function(scope, element, attrs) {
        $timeout(function() {
          element.find('#campaignDetailNextStep').click(function(e) {
            var status = 'ok';

            var verifyEmptyFun = function(field, warningId) {
              if(!field) {
                element.find(warningId).removeClass('hide');
                status = 'not_ok';
              } else {
                element.find(warningId).addClass('hide');
              }
            };

            [
              {
                field: scope.campaignTitle,
                warningId: '#titleWarning'
              },
              {
                field: scope.campaignDescription ,
                warningId: '#descriptionWarning'
              },
              {
                field: scope.campaignUrl ,
                warningId: '#urlWarning'
              },
              {
                field: element.find('#tosCheckbox').prop('checked'),
                warningId: '#tosWarning'
              }
            ].forEach(function(obj) {
              verifyEmptyFun(obj.field, obj.warningId);
            });

            if(status === 'not_ok') {
              e.preventDefault();
            } else {
              scope.launchCampaign();
            }
          });
        }, 0);
      }
    };
  }
]);
