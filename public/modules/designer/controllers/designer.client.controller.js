'use strict';

angular.module('designer').controller('DesignerController', [
  '$scope', 'mdCanvasService', 'allTshirts', 'CampaignCache',
  function($scope, mdCanvasService, allTshirts, CampaignCache) {
    $scope.enableEdit = true;

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

    $scope.$watch(
      'currentTshirt',
      function(newVal, _oldVal) {
        $scope.currentTshirt.currentVariant = newVal.variants[0];

        var color = newVal.currentVariant.colors[0];
        $scope.setCanvasBgColor(color);
      });

    $scope.setCanvasBgColor = function(color) {
      CampaignCache.setColor(color);
      mdCanvasService.changeBackground(color);
    };

    $scope.tshirtColor = $scope.currentTshirt.currentVariant.colors[0];
    $scope.setCanvasBgColor($scope.tshirtColor);

    var baseCost = $scope.currentTshirt.currentVariant.baseCost;
    CampaignCache.setCost(baseCost);

    $scope.setVariant = function(variant) {
      $scope.currentTshirt.currentVariant = variant;
      CampaignCache.setCost(variant.baseCost);
    };

    $scope.images = [
      {src: 'modules/designer/img/avatar/avatar-1.jpeg'},
      {src: 'modules/designer/img/avatar/avatar-2.png'},
      {src: 'modules/designer/img/avatar/avatar-3.png'},
      {src: 'modules/designer/img/avatar/avatar-4.png'},
      {src: 'modules/designer/img/avatar/avatar-5.png'}
    ];

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

    $scope.fontColor = '#000000';
    $scope.inputText = '';

    $scope.changeToBoldText = function() {
      mdCanvasService.toggleActiveTextBold();
    };

    $scope.changeToItalicText = function() {
      mdCanvasService.toggleActiveTextItalic();
    };

    $scope.changeToUnderlineText = function() {
      mdCanvasService.toggleActiveTextUnderline();
    };

    $scope.changeFontFamily = function() {
      mdCanvasService.changeTextFontFamily($scope.currentFont.name);
    };

    $scope.changeColorText = function() {
      mdCanvasService.renderActiveTextFontColor($scope.fontColor);
    };

    $scope.addOrEditText = function() {
      if(mdCanvasService.activeTextP()) {
        mdCanvasService.renderActiveTextContent($scope.inputText);
      } else if ($scope.inputText !== '') {
        mdCanvasService.addTextWhenNoActiveText(
          $scope.inputText, $scope.fontColor, $scope.currentFont.name);
        mdCanvasService.setTheLastObjActive();
      }
    };

    $scope.addCanvasBorder = function() {
      mdCanvasService.addCanvasBorder();
    };

    $scope.removeCanvasBorder = function() {
      mdCanvasService.removeCanvasBorder();
    };

    $scope.addImage = function(imgSrc) {
      mdCanvasService.addImage(imgSrc);
    };
  }
]);
