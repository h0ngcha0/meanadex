'use strict';

angular.module('designer').controller('DesignerController', [
  '$scope', 'mdCanvasService', 'localStorageService', 'allTshirts',
  function($scope, mdCanvasService, localStorageService, allTshirts) {
    $scope.enableEdit = true;

    $scope.allTshirts = allTshirts;

    // a bit of a hack to get the select working two ways.
    //var getCurrentTshirt = function() {
    //  var storedTshirtType = localStorageService.get('currentTshirt');
    //  if (storedTshirtType) {
    //    var result = $scope.tshirt.types.filter(function(type) {
    //      return type.name === storedTshirtType.name;
    //    });
    //
    //    if(result.length === 0) {
    //      return $scope.tshirt.types[0];
    //    } else {
    //      return result[0];
    //    }
    //  } else {
    //    return $scope.tshirt.types[0];
    //  }
    //};

    //$scope.currentTshirt = getCurrentTshirt();
    $scope.currentTshirt = $scope.allTshirts[0];
    //localStorageService.bind($scope, 'currentTshirt', $scope.currentTshirt);

    $scope.currentVariant = $scope.currentTshirt.variants[0];
    //localStorageService.bind($scope, 'currentVariant', $scope.currentVariant);

    $scope.setVariant = function(variant) {
      $scope.currentVariant = variant;
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

    $scope.setCanvasBgColor = function(color) {
      mdCanvasService.changeBackground(color);
    };
  }
]);
