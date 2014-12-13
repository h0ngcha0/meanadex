'use strict';

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
      var tshirt = CampaignCache.getTshirt(),
          variant = tshirt.currentVariant;

      var campaign = new Campaigns ({
        name: $scope.campaignTitle,
        created_at: Date.today(),
        ended_at: Date.today().addDays($scope.currentCampaignLength),
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
