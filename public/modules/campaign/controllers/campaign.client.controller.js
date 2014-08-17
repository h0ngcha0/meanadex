'use strict';

angular.module('campaign').controller('CampaignController', [
  '$scope',
  function($scope) {
    $scope.tshirtsSalesGoalMin = 10;
    $scope.tshirtsSalesGoalMax = 400;
    $scope.tshirtsSalesGoal = 50;

    $scope.tshirtPrice = 70;

    $scope.campaignTitle = null;
    $scope.campaignDescription = null;
    $scope.campaignUrl = null;

    var dateAfterDaysFromNow = function(days) {
      return Date.today().addDays(days).toString().split(" ").slice(0, 3).join(" ");
    };

    $scope.currentCampaignLength = 7;
    $scope.campaignLengths = [3, 5, 7, 10, 14, 21].map(
      function(days) {
        return days.toString() + " days " + "(Ending " + dateAfterDaysFromNow(days) + ")";
      }
    );
  }
]);
