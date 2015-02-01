'use strict';

/* global moment */

angular.module('campaigns').controller('CampaignsSalesDetailsController', [
  '$scope', 'Campaigns', 'CampaignCache', 'mdCanvasService', '$location', '$http', 'Session', 'SessionModalService',
  function($scope, Campaigns, CampaignCache, mdCanvasService, $location, $http, Session, SessionModalService) {
    $scope.campaignTitle = CampaignCache.getTitle() || '';
    CampaignCache.bindTitle($scope);

    $scope.campaignDescription = CampaignCache.getDescription() || '';
    CampaignCache.bindDescription($scope);

    $scope.campaignLengths = [3, 5, 7, 10, 14, 21];
    $scope.currentCampaignLength =  $scope.campaignLengths[2];

    $scope.displayCampaignLength = function(days) {
      var endTime = '<span class="campaignLengthEnding">' +
        moment().add(days, 'd').format('MMM Do YYYY, h:mm') + '</span>';
      var calendar = '<span class="fa fa-calendar"/>';
      var date = '<span> ' +  days.toString() + ' days ' +
        '  ' + endTime + '</span>';
      return calendar + date;
    };

    $scope.hideWarning = {
      campaignTitle: true,
      campaignDescription: true,
      tosChecked: true
    };

    $scope.saveDetails = function() {
      var status = 'ok';

      var verifyEmptyFun = function(field, hideErrVar) {
        if(!$scope[field]) {
          $scope.hideWarning[field] = false;
          status = 'not_ok';
        } else {
          $scope.hideWarning[field] = true;
        }
      };

      [
        'campaignTitle',
        'campaignDescription',
        'tosChecked'
      ].forEach(function(obj) {
        verifyEmptyFun(obj);
      });

      if(status !== 'not_ok') {
        $scope.launchCampaign();
      }
    };

    $scope.launchCampaign = function() {
      var tshirt = CampaignCache.getTshirt(),
          variant = tshirt.currentVariant,
          now = new Date();

      if (!Session.isLoggedIn()) {
        return SessionModalService.showLoginRequiredModal();
      }

      var campaign = new Campaigns ({
        name: $scope.campaignTitle,
        created_at: now,
        ended_at: moment(now).add($scope.currentCampaignLength, 'days').toDate(),
        description: CampaignCache.getDescription(),
        length: $scope.currentCampaignLength,
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
          $location.path('campaigns/' + response._id);
        },
        function(errorResponse) {
          $scope.error = errorResponse.data.message;
        }
      );
    };
  }
]);
