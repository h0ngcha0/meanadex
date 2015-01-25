'use strict';

/* global async */

angular.module('designer').directive('mdTshirtCanvas', [
  '$timeout', 'mdCanvasService', 'Images', 'CampaignCache',
  function($timeout, mdCanvasService, Images, CampaignCache) {
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

        // not in campaign page
        var tshirt = CampaignCache.getTshirt();
        mdCanvasService.init(
          scope.interactiveCanvas,
          'tcanvas',
          '#tshirtFacing',
          '#shirtDiv',
          tshirt.frontImage.url,
          tshirt.backImage.url
        );

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
