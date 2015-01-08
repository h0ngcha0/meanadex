'use strict';

angular.module('designer').directive('mdTshirtCanvas', [
  '$timeout', 'mdCanvasService', 'Images',
  function($timeout, mdCanvasService, Images) {
    var canvas;
    return {
      restrict: 'E',
      templateUrl: 'modules/designer/views/canvas.client.view.html',
      link: function(scope, element, attrs) {
        scope.addCanvasBorder = function() {
          mdCanvasService.addCanvasBorder();
        };

        scope.removeCanvasBorder = function() {
          mdCanvasService.removeCanvasBorder();
        };

        if(scope.campaign) {
          scope.campaign.$promise.then
          (
            // promise successful
            function(campaign) {
              var design = JSON.parse(campaign.design);
              var tshirt = campaign.tshirt;
              scope.frontImagePromise = Images.get({imageId: tshirt.frontImage}).$promise;
              scope.backImagePromise = Images.get({imageId: tshirt.backImage}).$promise;
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
