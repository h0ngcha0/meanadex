'use strict';

// Campaigns controller
angular.module('campaigns').controller('CampaignsController', [
  '$scope', '$stateParams', '$location', 'Authentication',
  'Campaigns', '$cookies', 'localStorageService', '$filter',
  'ngTableParams', '$timeout', '$http',
  function( $scope, $stateParams, $location, Authentication, Campaigns,
    $cookies, localStorageService, $filter, NgTableParams, $timeout, $http) {
    $scope.authentication = Authentication;

    // Create new Campaign
    $scope.create = function(date) {
      // Create new Campaign object
      var campaign = new Campaigns ({
        name: this.name,
        created_at: date,
        ended_at: date.addDays(this.length), //Date.today()
        description: this.description,
        length: this.length,
        url: this.url,
        goal: this.goal,
        sold: this.sold,
        cost: this.cost,
        price: this.price,
        design: this.design
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
    $scope.update = function(campaign0) {
      var campaign = campaign0 || $scope.campaign;

      campaign.$update(
        function() {
          // perhaps show successfully updated message
        },
        function(errorResponse) {
          $scope.error = errorResponse.data.message;
        }
      );
    };

    // Find a list of Campaigns
    $scope.find = function() {
      $scope.campaigns = Campaigns.query();
    };

    // Find existing Campaign for a particular user
    $scope.findOne = function() {
      $scope.campaign = Campaigns.get({
        campaignId: $stateParams.campaignId
      });
    };

    $scope.tableParams = new NgTableParams(
      {
        page: 1,
        count: 10
      },
      {
        total: 0,
        getData: function($defer, params) {
          $timeout(function() {
            var orderedData = params.filter() ?
            $filter('filter')($scope.campaigns, params.filter()) :
            $scope.campaigns;

            $scope.presented_campaigns = orderedData;

            params.total($scope.presented_campaigns.length);
            $defer.resolve($scope.presented_campaigns);
          }, 500); // FIXME: this is ugly
        }
      }
    );

    $scope.onRemove = function(campaign) {
      $scope.remove(campaign);
      $scope.tableParams.reload();
    };

    $scope.onSave = function(campaign) {
      campaign.$edit = false;
      $scope.update(campaign);
    };

    $scope.onEdit = function(campaign) {
      campaign.$edit = true;
    };
  }
]);

angular.module('campaigns').controller('CampaignsSalesGoalController', [
  '$scope', 'localStorageService',
  function($scope, localStorageService) {
    $scope.currentVariant = localStorageService.get('currentVariant');

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
  '$scope', 'Campaigns', 'localStorageService', 'mdCanvasService', '$location',
  '$http',
  function($scope, Campaigns, localStorageService, mdCanvasService, $location, $http) {
    $scope.campaignTitle = localStorageService.get('campaignTitle') || '';
    localStorageService.bind($scope, 'campaignTitle', $scope.campaignTitle);

    $scope.campaignDescription = localStorageService.get('campaignDescription') || '';
    localStorageService.bind($scope, 'campaignDescription', $scope.campaignDescription);

    var campaignUrl = localStorageService.get('campaignUrl') || '';
    if (campaignUrl) {
      $scope.campaignUrl = campaignUrl;
    }
    else {
      $http.get('/campaign/url').success(function(response) {
        $scope.campaignUrl = JSON.parse(response);

      }).error(function(response) {
        $scope.error = response.message;
      });
    }
    localStorageService.bind($scope, 'campaignUrl', $scope.campaignUrl);

    $scope.currentCampaignLength = localStorageService.get('currentCampaignLength') || 7;
    localStorageService.bind($scope, 'currentCampaignLength', $scope.currentCampaignLength);
    var dateAfterDaysFromNow = function(days) {
      return Date.today().addDays(days).toString().split(' ').slice(0, 3).join(' ');
    };

    $scope.campaignLengths = [3, 5, 7, 10, 14, 21];
    $scope.displayCampaignLength = function(days) {
      return days.toString() + ' days ' + '(Ending ' + dateAfterDaysFromNow(days) + ')';
    };

    $scope.currentVariant = localStorageService.get('currentVariant');

    $scope.tshirtsSalesGoal = localStorageService.get('tshirtsSalesGoal');
    $scope.tshirtPrice = localStorageService.get('tshirtPrice');
    $scope.tshirtColor = localStorageService.get('tshirtColor');

    $scope.launchCampaign = function() {
      var campaign = new Campaigns ({
        name: $scope.campaignTitle,
        created_at: Date.today(),
        ended_at: Date.today().addDays($scope.currentCampaignLength),
        description: $scope.campaignDescription,
        length: $scope.currentCampaignLength,
        url: $scope.campaignUrl,
        goal: parseInt($scope.tshirtsSalesGoal),
        sold: 0,
        price: $scope.tshirtPrice,
        color: $scope.tshirtColor,
        cost: $scope.currentVariant.baseCost,
        design: JSON.stringify({
          front: mdCanvasService.getFrontCanvas(),
          back: mdCanvasService.getBackCanvas()
        })
      });

      // Redirect after save
      campaign.$save(
        function(response) {
          localStorageService.clearAll();
          $location.path('campaigns/' + response._id);
        },
        function(errorResponse) {
          $scope.error = errorResponse.data.message;
        }
      );
    };
  }
]);
