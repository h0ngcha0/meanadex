'use strict';

angular.module('designer').directive('mdTshirtCanvas', [
  '$timeout', 'mdCanvasService',
  function($timeout, mdCanvasService) {
    var canvas;
    return {
      restrict: 'E',
      scope: {
      },
      templateUrl: 'modules/designer/views/canvas.client.view.html',
      link: function(scope, element, attrs) {
        // initialize the mdCanvasService
        mdCanvasService.init('tcanvas', '#tshirtFacing', '#shirtDiv');
        $timeout(function() {
          element.find('#drawingArea').hover(
            mdCanvasService.addCanvasBorder,
            mdCanvasService.removeCanvasBorder
          );

          element.find('#flip').click(function() {
            var flipText = element.find('#flip-text');
            if (flipText.text() === 'Show Back View') {
              flipText.text('Show Front View');
              mdCanvasService.flipBack();
            } else {
              flipText.text('Show Back View');
              mdCanvasService.flipFront();
            }
          });
        }, 0);
      }
    };
  }
]);
