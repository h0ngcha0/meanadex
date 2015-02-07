'use strict';

angular.module('designer').controller('DesignerController', [
  '$scope', 'mdCanvasService', 'allTshirts', 'CampaignCache',
  'FileUploader', '$location',
  function($scope, mdCanvasService, allTshirts, CampaignCache,
           FileUploader, $location) {
    $scope.ensureEnoughData = function() {
      if(!allTshirts || (allTshirts.length === 0)) {
        $location.path('dashboard/tshirts');
      }
    };

    $scope.uploader = new FileUploader();

    $scope.setCanvasBgColor = function(color) {
      CampaignCache.setColor(color);
      mdCanvasService.changeBackground(color);
    };

    $scope.setVariant = function(variant) {
      var color = variant.colors[0];
      $scope.currentTshirt.currentVariant = variant;
      $scope.setCanvasBgColor(color);
    };

    $scope.interactiveCanvas = true;

    $scope.variantClass = function(variant) {
      if ($scope.currentTshirt.currentVariant === variant) {
        return 'active';
      } else {
        return '';
      }
    };

    $scope.changeTshirt = function() {
      var color = $scope.currentTshirt.currentVariant.colors[0];
      $scope.setCanvasBgColor(color);

      CampaignCache.setTshirt($scope.currentTshirt);
    };

    if(allTshirts && (allTshirts.length !== 0)) {
      // set the currentVariant to the first of all variants
      $scope.allTshirts = _.map(
        allTshirts,
        function(t) {
          t.currentVariant = t.variants[0];
          return t;
        });

      $scope.currentTshirt = $scope.allTshirts[0];
      $scope.currentTshirt.currentVariant = $scope.currentTshirt.variants[0];
      CampaignCache.setColor($scope.currentTshirt.currentVariant.colors[0]);
      CampaignCache.setTshirt($scope.currentTshirt);

      $scope.tshirtColor = $scope.currentTshirt.currentVariant.colors[0];
      $scope.setCanvasBgColor($scope.tshirtColor);
    }
  }
]);
