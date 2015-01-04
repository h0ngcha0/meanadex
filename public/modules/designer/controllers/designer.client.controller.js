'use strict';

angular.module('designer').controller('DesignerController', [
  '$scope', 'mdCanvasService', 'allTshirts', 'CampaignCache',
  'FileUploader', '$location',
  function($scope, mdCanvasService, allTshirts, CampaignCache,
           FileUploader, $location) {
    $scope.enableEdit = true;

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
      $scope.currentTshirt.currentVariant = variant;
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

      $scope.$watch(
        'currentTshirt',
        function(newVal, _oldVal) {
          var color;

          $scope.currentTshirt = newVal;
          $scope.currentTshirt.currentVariant = newVal.variants[0];
          color = $scope.currentTshirt.currentVariant.colors[0];
          $scope.setCanvasBgColor(color);

          CampaignCache.setTshirt($scope.currentTshirt);
        });
    }
  }
]);
