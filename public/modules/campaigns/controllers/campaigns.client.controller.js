'use strict';

// Campaigns controller
angular.module('campaigns').controller('CampaignsController', [
  '$scope', '$stateParams', '$location', 'Authentication',
  'Campaigns', 'mdCampaignInfoAccumulatorService',
  function($scope, $stateParams, $location, Authentication, Campaigns ) {
    $scope.authentication = Authentication;

    // Create new Campaign
    $scope.create = function() {
      // Create new Campaign object
      var campaign = new Campaigns ({
        name: this.name
      });

      // Redirect after save
      campaign.$save(
        function(response) {
          $location.path('campaigns/' + response._id);

          // Clear form fields
          $scope.name = '';
        },
        function(errorResponse) {
          $scope.error = errorResponse.data.message;
        }
      );
    };

    // Remove existing Campaign
    $scope.remove = function( campaign ) {
      if ( campaign ) {
        campaign.$remove();

        for (var i in $scope.campaigns ) {
          if ($scope.campaigns [i] === campaign ) {
            $scope.campaigns.splice(i, 1);
          }
        }
      } else {
        $scope.campaign.$remove(function() {
          $location.path('campaigns');
        });
      }
    };

    // Update existing Campaign
    $scope.update = function() {
      var campaign = $scope.campaign ;

      campaign.$update(
        function() {
          $location.path('campaigns/' + campaign._id);
        },
        function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
    };

    // Find a list of Campaigns
    $scope.find = function() {
      $scope.campaigns = Campaigns.query();
    };

    // Find existing Campaign
    $scope.findOne = function() {
      $scope.campaign = Campaigns.get({
        campaignId: $stateParams.campaignId
      });
    };

    // experiment..
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
