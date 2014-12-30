'use strict';

// Campaigns controller
angular.module('campaigns').controller('CampaignsController', [
  '$scope', '$stateParams', '$state', '$location', 'Authentication',
  'Campaigns', '$cookies', '$filter', 'DashboardUtils', '$timeout', '$http',
  function($scope, $stateParams, $state, $location, Authentication,
           Campaigns, $cookies, $filter, DashboardUtils, $timeout, $http) {
    $scope.authentication = Authentication;
    // Remove existing Campaign
    $scope.remove = function( campaign ) {
      Campaigns.remove(
        {campaignId: campaign._id},
        function(data) {
          for (var i in $scope.campaigns.documents ) {
            if ($scope.campaigns.documents [i] === campaign ) {
              $scope.campaigns.documents.splice(i, 1);
            }
          }

          // reload table when the current page is empty
          if($scope.campaigns.documents.length === 0) {
            $scope.loadAllCampaignsInTableData();
          }
        },
        function(err) {
          $scope.error = err.data.message;
        }
      );
    };

    // Update existing Campaign
    $scope.update = function(campaign) {
      Campaigns.update(
        {campaignId: campaign._id},
        campaign,
        function(data) {
          // successfully updated.
        },
        function(err) {
          $scope.error = err.data.message;
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
        },
        function(data) {
        },
        function(err) {
          $location.path('/campaign_not_found');
        }
      );
    };

    $scope.tableParams = DashboardUtils.newTableParams(
      function($defer, params) {
        $defer.resolve($scope.campaigns);
      }
    );

    var fetchedFirstPage = true;
    $scope.disablePrev = function() {
      return fetchedFirstPage;
    };

    $scope.disableNext = function() {
      return !$scope.campaigns.nextAnchorId;
    };

    $scope.gotoPage = function(anchorId, disabled) {
      if(!disabled) {
        $scope.loadAllCampaignsInTableData(anchorId);
      }
    };

    // Find a list of Campaigns and load them into campaign table
    $scope.loadAllCampaignsInTableData = function(anchorId) {
      var queryOption = anchorId ? {'anchorId': anchorId} : {};
      fetchedFirstPage = anchorId ? false : true;

      $scope.prevAnchorId = $scope.campaigns ? $scope.campaigns.prevAnchorId : undefined;

      $scope.campaigns = Campaigns.query(
        queryOption,
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
