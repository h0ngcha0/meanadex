'use strict';

angular.module('designer').directive('mdTshirtCanvas', [
  '$timeout', 'mdCanvasService',
  function($timeout, mdCanvasService) {
    var canvas;
    return {
      restrict: 'E',
      templateUrl: 'modules/designer/views/canvas.client.view.html',
      link: function(scope, element, attrs) {
        if(scope.campaign) {
          scope.campaign.$promise.then
          (
            // promise successful
            function(campaign) {
              var design = JSON.parse(campaign.design);
              mdCanvasService.init(
                'tcanvas',
                '#tshirtFacing',
                '#shirtDiv',
                design.front,
                design.back,
                campaign.color
              );
            },
            // promise fail
            function(err) {
              mdCanvasService.init('tcanvas', '#tshirtFacing', '#shirtDiv');
            }
          );
        } else {
          mdCanvasService.init('tcanvas', '#tshirtFacing', '#shirtDiv');
        }

        if(scope.enableEdit) {
          mdCanvasService.enableEdit();
        } else {
          mdCanvasService.disableEdit();
        }

        $timeout(function() {
          element.find('#flip').click(function() {
            var flipTextElem = element.find('#flip-text');
            var currentSide = mdCanvasService.flip();
            if (currentSide === 'front') {
              flipTextElem.text('Show Back View');
            } else {
              flipTextElem.text('Show Front View');
            }

          });
        }, 0);
      }
    };
  }
]);
