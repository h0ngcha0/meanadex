'use strict';

// Campaigns controller
angular.module('campaigns').controller('CampaignsController', [
  '$scope', '$stateParams', '$location', 'Authentication',
  'Campaigns', '$cookies', 'localStorageService',
  function( $scope, $stateParams, $location, Authentication, Campaigns
          , $cookies, localStorageService ) {
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
  }
]);

angular.module('campaigns').controller('CampaignsSalesGoalController', [
  '$scope', 'localStorageService',
  function($scope, localStorageService ) {
    $scope.currentVariant = localStorageService.get('currentVariant');
    // variables
    $scope.tshirtsSalesGoalMin = 20;
    $scope.tshirtsSalesGoalMax = 400;

    $scope.tshirtsSalesGoal = localStorageService.get('tshirtsSalesGoal') || 50;
    localStorageService.bind($scope, 'tshirtsSalesGoal', $scope.tshirtsSalesGoal);

    $scope.tshirtPrice = localStorageService.get('tshirtPrice') || 70;
    localStorageService.bind($scope, 'tshirtPrice', $scope.tshirtPrice);

    $scope.estimatedProfitFun = function() {
      var profit = ($scope.tshirtPrice - $scope.currentVariant.baseCost) * $scope.tshirtsSalesGoal;
      return profit > 0 ? profit : 0;
    };
  }
]);

angular.module('campaigns').controller('CampaignsSalesDetailsController', [
  '$scope', 'localStorageService',
  function($scope, localStorageService) {
    $scope.campaignTitle = localStorageService.get('campaignTitle') || "";
    localStorageService.bind($scope, 'campaignTitle', $scope.campaignTitle);

    $scope.campaignDescription = localStorageService.get('campaignDescription') || "";
    localStorageService.bind($scope, 'campaignDescription', $scope.campaignDescription);

    $scope.campaignUrl = localStorageService.get('campaignUrl') || "";
    localStorageService.bind($scope, 'campaignUrl', $scope.campaignUrl);

    $scope.currentCampaignLength = localStorageService.get('currentCampaignLength') || 7;
    localStorageService.bind($scope, 'currentCampaignLength', $scope.currentCampaignLength);
    var dateAfterDaysFromNow = function(days) {
      return Date.today().addDays(days).toString().split(' ').slice(0, 3).join(' ');
    };

    $scope.campaignLengths = [3, 5, 7, 10, 14, 21].map(
      function(days) {
        return days.toString() + ' days ' + '(Ending ' + dateAfterDaysFromNow(days) + ')';
      }
    );

    $scope.slider = {
      'options': {
        animate: true
      }
    };
  }
]);

angular.module('campaigns').controller('CampaignsSummaryController', [
  '$scope', 'localStorageService',
  function($scope, localStorageService) {
    $scope.campaignTitle = localStorageService.get('campaignTitle');
    $scope.campaignDescription = localStorageService.get('campaignDescription');
    $scope.campaignUrl = localStorageService.get('campaignUrl');
    $scope.currentCampaignLength = localStorageService.get('currentCampaignLength');
    $scope.tshirtsSalesGoal = localStorageService.get('tshirtsSalesGoal');
    $scope.tshirtPrice = localStorageService.get('tshirtPrice');

    $scope.tshirtType = localStorageService.get('currentTshirtType');
    $scope.tshirtTypeName = $scope.tshirtType.name;

    $scope.currentVariant = localStorageService.get('currentVariant');

    $scope.tshirtVariantName = $scope.currentVariant.name;
    $scope.baseCost = $scope.currentVariant.baseCost;

  }
]);
