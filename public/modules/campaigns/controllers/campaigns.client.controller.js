'use strict';

// Campaigns controller
angular.module('campaigns').controller('CampaignsController', [
  '$scope', '$stateParams', '$location', 'Authentication',
  'Campaigns', '$cookies', '$filter', 'AdminUtils', '$timeout', '$http',
  function( $scope, $stateParams, $location, Authentication, Campaigns,
    $cookies, $filter, AdminUtils, $timeout, $http) {
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
      $scope.campaign = Campaigns.get(
        {
          campaignId: $stateParams.campaignId
        }
      );
    };

    $scope.tableParams = AdminUtils.newTableParams(
      function($defer, params) {
        var orderedData = params.filter() ?
          $filter('filter')($scope.campaigns, params.filter()) :
          $scope.campaigns;

        params.total(orderedData.length);
        $defer.resolve(orderedData);
      }
    );

    // Find a list of Campaigns and load them into campaign table
    $scope.loadAllCampaignsInTableData = function() {
      $scope.campaigns = Campaigns.query(
        function(data) {
          $scope.tableParams.reload();
        });
    };

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
  '$scope', 'CampaignCache',
  function($scope, CampaignCache) {
    $scope.cost = CampaignCache.getCost();

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

angular.module('campaigns').controller('CampaignsSalesDetailsController', [
  '$scope', 'Campaigns', 'CampaignCache', 'mdCanvasService', '$location', '$http',
  function($scope, Campaigns, CampaignCache, mdCanvasService, $location, $http) {
    $scope.campaignTitle = CampaignCache.getTitle() || '';
    CampaignCache.bindTitle($scope);

    $scope.campaignDescription = CampaignCache.getDescription() || '';
    CampaignCache.bindDescription($scope);

    var url = CampaignCache.getUrl() || '';
    if (url) {
      $scope.campaignUrl = url;
    }
    else {
      $http.get('/campaign/url').success(function(response) {
        $scope.campaignUrl = JSON.parse(response);

      }).error(function(response) {
        $scope.error = response.message;
      });
    }
    CampaignCache.bindUrl($scope);

    $scope.currentCampaignLength = CampaignCache.getLength() || 7;
    CampaignCache.bindLength($scope);

    var dateAfterDaysFromNow = function(days) {
      return Date.today().addDays(days).toString().split(' ').slice(0, 3).join(' ');
    };

    $scope.campaignLengths = [3, 5, 7, 10, 14, 21];
    $scope.displayCampaignLength = function(days) {
      return days.toString() + ' days ' + '(Ending ' + dateAfterDaysFromNow(days) + ')';
    };

    $scope.launchCampaign = function() {
      var campaign = new Campaigns ({
        name: $scope.campaignTitle,
        created_at: Date.today(),
        ended_at: Date.today().addDays($scope.currentCampaignLength),
        description: CampaignCache.getDescription(),
        length: CampaignCache.getLength(),
        url: CampaignCache.getUrl(),
        goal: parseInt(CampaignCache.getGoal()),
        sold: 0,
        price: CampaignCache.getPrice(),
        color: CampaignCache.getColor(),
        cost: CampaignCache.getCost(),
        design: JSON.stringify({
          front: mdCanvasService.getFrontCanvas(),
          back: mdCanvasService.getBackCanvas()
        })
      });

      // Redirect after save
      campaign.$save(
        function(response) {
          CampaignCache.clear();
          $location.path('campaigns/' + response._id);
        },
        function(errorResponse) {
          $scope.error = errorResponse.data.message;
        }
      );
    };
  }
]);
