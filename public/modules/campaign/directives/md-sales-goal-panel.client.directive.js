'use strict';

angular.module('campaign').directive('mdSalesGoalPanel', [
  '$timeout', 'mdCampaignInfoAccumulatorService',
  function($timeout, mdCampaignInfoAccumulatorService){
    return {
      restrict: 'E',
      templateUrl: 'modules/campaign/views/sales-goal-panel.client.view.html',
      link: function(scope, element, attrs) {
        $timeout(function() {
          var sliderElem = element.find('#numOfTshirtSlider'),
              numInputElem = element.find('#numOfTshirtInput'),
              slider = sliderElem.slider({});

          scope.$apply(function() {
            scope.baseCost = mdCampaignInfoAccumulatorService.getBaseCost();
          });

          // init the input value
          numInputElem.val(slider.slider('getValue'));

          sliderElem.on('slideStop', function(e) {
            scope.$apply(function() { scope.tshirtsSalesGoal = e.value; });
          });
        }, 0);
      }
    };
  }
]);
