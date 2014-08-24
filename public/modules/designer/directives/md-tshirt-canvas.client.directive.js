'use strict';

angular.module('designer').directive('mdTshirtCanvas', [
  'mdCanvasService',
  function(mdCanvasService) {
    var canvas;
    return {
      restrict: 'E',
      templateUrl: 'modules/designer/views/canvas.client.view.html',
      link: function(scope, element, attrs) {
        // initialize the mdCanvasService
        mdCanvasService.init('tcanvas', '#tshirtFacing', '#shirtDiv');
      }
    };
  }
]);
