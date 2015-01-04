'use strict';

angular.module('designer').controller('DesignerController', [
  '$scope', 'mdCanvasService', 'allTshirts', 'CampaignCache',
  'FileUploader', '$location', 'ImagesUtils', 'Images', 'Tags',
  function($scope, mdCanvasService, allTshirts, CampaignCache,
           FileUploader, $location, ImagesUtils, Images, Tags) {
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

      $scope.uploader.onAfterAddingFile = function(queueItem) {
        if(ImagesUtils.isFile(queueItem.file) || ImagesUtils.isImage(queueItem.file)) {
          var reader = new FileReader();
          reader.onload = function(event) {
            var imgUrl = event.target.result;
            $scope.addImage(imgUrl);
          };
          reader.readAsDataURL(queueItem._file);
        }
      };
    }

    $scope.addCanvasBorder = function() {
      mdCanvasService.addCanvasBorder();
    };

    $scope.removeCanvasBorder = function() {
      mdCanvasService.removeCanvasBorder();
    };

    $scope.addImage = function(imgSrc) {
      mdCanvasService.addImage(imgSrc);
    };

    // load tags
    Tags.query(
      {},
      function(data) {
        $scope.tags = _.map(data, function(d) {
          return {
            value: d,
            label: '<i class="fa fa-circle-o"></i> ' + d
          };
        });
      },
      function(err) {
        $scope.tags = [];
      }
    );

    $scope.fonts = [
      {name: 'Arial', class: 'Arial'},
      {name: 'Helvetica', class: 'Helvetica'},
      {name: 'Myriad Pro', class: 'MyriadPro'},
      {name: 'Delicious', class: 'Delicious'},
      {name: 'Verdana', class: 'Verdana'},
      {name: 'Georgia', class: 'Georgia'},
      {name: 'Courier', class: 'Courier'},
      {name: 'Comic Sans MS', class: 'ComicSansMS'},
      {name: 'Impact', class: 'Impact'},
      {name: 'Monaco', class: 'Monaco'},
      {name: 'Optima', class: 'Optima'},
      {name: 'Hoefler Text', class: 'Hoefler Text'},
      {name: 'Plaster', class: 'Plaster'},
      {name: 'Engagement', class: 'Engagement'}
    ];

    $scope.currentFont = {name: 'Arial' , class: 'Arial'};
  }
]);
