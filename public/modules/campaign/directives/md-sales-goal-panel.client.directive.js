'use strict';

angular.module('campaign').directive('mdSalesGoalPanel', [
  '$timeout', 'mdCampaignInfoAccumulatorService',
  function($timeout, mdCampaignInfoAccumulatorService){
    return {
      restrict: 'E',
      scope: {
        tshirtsSalesGoal: '=',
        tshirtsSalesGoalMin: '=',
        tshirtsSalesGoalMax: '=',
        tshirtPrice: '='
      },
      templateUrl: 'modules/campaign/views/sales-goal-panel.client.view.html',
      link: function(scope, element, attrs) {
        $timeout(function() {
          var sliderElem = element.find('#numOfTshirtSlider'),
              numInputElem = element.find('#numOfTshirtInput'),
              priceInputElem = element.find('#priceOfTshirtInput'),
              slider = sliderElem.slider({}),
              NotAvailable = 'N/A',
              baseCost = mdCampaignInfoAccumulatorService.getBaseCost();

          var displayProfitFun = function(price, goal) {
            element.find('#estimatedProfitTag').text(profitFun(price) * goal);
          };

          var profitFun = function(price) {
            var profit = price - parseInt(baseCost);
            if (profit > 0) {
              return profit;
            } else {
              return 0;
            }
          };

          // init the input value
          numInputElem.val(slider.slider('getValue'));

          sliderElem.on('slideStop', function(e) {
            scope.$apply(function() { scope.tshirtsSalesGoal = e.value; });

            displayProfitFun(scope.tshirtPrice, scope.tshirtsSalesGoal);
          });

          numInputElem.keyup(function(e) {
            var val = Number($(this)[0].value);
            if (isNaN(val)) {
              slider.slider('setValue', scope.tshirtsSalesGoalMin);
              displayProfitFun(scope.tshirtPrice, scope.tshirtsSalesGoalMin);
            } else {
              slider.slider('setValue', val);
              displayProfitFun(scope.tshirtPrice, val);
            }
          });

          // Display the base cost, the initial profit per tshirt
          // and the total estimated profit.
          element.find('#baseCostTag').text(baseCost === null ? NotAvailable : baseCost);
          element.find('#profitPerTshirt').text(profitFun(scope.tshirtPrice));
          displayProfitFun(scope.tshirtPrice, scope.tshirtsSalesGoal);

          priceInputElem.keyup(function(e) {
            var val = Number($(this)[0].value);
            if (isNaN(val)) {
              element.find('#profitPerTshirt').text(NotAvailable);
              element.find('#estimatedProfitTag').text(NotAvailable);
            } else {
              var profit = profitFun(val);
              element.find('#profitPerTshirt').text(profit);
              element.find('#estimatedProfitTag').text(profit * scope.tshirtsSalesGoal);

            }
          });

          element.find('#salesGoalNextStep').click(function(e) {
            mdCampaignInfoAccumulatorService.setSalesGoal(scope.tshirtsSalesGoal);
            mdCampaignInfoAccumulatorService.setPrice(scope.tshirtPrice);
          });
        }, 0);
      }
    };
  }
]);
