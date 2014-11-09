'use strict';

// Campaigns controller
angular.module('campaigns').controller('CampaignsController', [
  '$scope', '$stateParams', '$state', '$location', 'Authentication',
  'Campaigns', '$cookies', '$filter', 'AdminUtils', '$timeout', '$http',
  function($scope, $stateParams, $state, $location, Authentication,
           Campaigns, $cookies, $filter, AdminUtils, $timeout, $http) {
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

    $scope.reserveCampaign = function(campaign) {
      var campaignJson = JSON.stringify(campaign);
      $state.go('createOrder', {
        campaign: campaignJson
      }, {location: false, inherit: false});
    };
  }
]);
