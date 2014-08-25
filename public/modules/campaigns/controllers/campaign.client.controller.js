'use strict';

angular.module('campaigns').controller('CampaignController', [
  '$scope', 'mdCampaignInfoAccumulatorService',
  function($scope, mdCampaignInfoAccumulatorService) {
    $scope.tshirtsSalesGoalMin = 10;
    $scope.tshirtsSalesGoalMax = 400;
    $scope.tshirtsSalesGoal = 50;

    $scope.tshirtPrice = 70;
    $scope.baseCost = 0;

    $scope.campaignTitle = null;
    $scope.campaignDescription = null;
    $scope.campaignUrl = null;

    var dateAfterDaysFromNow = function(days) {
      return Date.today().addDays(days).toString().split(' ').slice(0, 3).join(' ');
    };

    $scope.currentCampaignLength = 7;
    $scope.campaignLengths = [3, 5, 7, 10, 14, 21].map(
      function(days) {
        return days.toString() + ' days ' + '(Ending ' + dateAfterDaysFromNow(days) + ')';
      }
    );

    $scope.estimatedProfitFun = function(price, goal) {
      var profit = $scope.tshirtPrice - parseInt($scope.baseCost);
      if (profit > 0) {
        return $scope.tshirtsSalesGoal * profit;
      } else {
        return 0;
      }
    };

    $scope.setSalesGoal = function() {
      mdCampaignInfoAccumulatorService.setSalesGoal($scope.tshirtsSalesGoal);
      mdCampaignInfoAccumulatorService.setPrice($scope.tshirtPrice);
    };

    $scope.slider = {
      'options': {
        animate: true
      }
    };
  }
]);
