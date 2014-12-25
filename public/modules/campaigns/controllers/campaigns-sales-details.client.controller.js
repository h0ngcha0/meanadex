'use strict';

/* global moment */

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

    $scope.campaignLengths = [3, 5, 7, 10, 14, 21];
    $scope.displayCampaignLength = function(days) {
      return days.toString() + ' days ' + '(Ending ' + moment().add(days, 'd').toString() + ')';
    };

    $scope.launchCampaign = function() {
      var tshirt = CampaignCache.getTshirt(),
          variant = tshirt.currentVariant,
          now = moment().utc();

      var campaign = new Campaigns ({
        name: $scope.campaignTitle,
        created_at: now.toDate(),
        ended_at: now.add($scope.currentCampaignLength, 'days').toDate(),
        description: CampaignCache.getDescription(),
        length: CampaignCache.getLength(),
        url: CampaignCache.getUrl(),
        goal: parseInt(CampaignCache.getGoal()),
        tshirtRef: tshirt._id,
        tshirt: tshirt,
        price: {
          value: CampaignCache.getPrice(),
          currency: variant.currency
        },
        color: CampaignCache.getColor(),
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
