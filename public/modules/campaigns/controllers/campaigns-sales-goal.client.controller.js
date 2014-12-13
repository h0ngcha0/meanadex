'use strict';

angular.module('campaigns').controller('CampaignsSalesGoalController', [
  '$scope', 'CampaignCache',
  function($scope, CampaignCache) {
    var tshirt = CampaignCache.getTshirt();
    $scope.cost = tshirt.currentVariant.baseCost;
    $scope.currency = tshirt.currentVariant.currency;

    $scope.tshirtsSalesGoal = CampaignCache.getGoal() || 50;
    CampaignCache.bindGoal($scope);

    $scope.tshirtPrice = CampaignCache.getPrice() || 70;
    CampaignCache.bindPrice($scope);

    $scope.estimatedProfitFun = function() {
      var profit = ($scope.tshirtPrice - $scope.cost) * $scope.tshirtsSalesGoal;
      return profit > 0 ? profit : 0;
    };
  }
]);
