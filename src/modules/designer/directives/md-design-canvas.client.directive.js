'use strict';

/* global async */
/* global null */

angular.module('designer').directive('mdDesignCanvas', [
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
        var design = CampaignCache.getDesign();
        var color = CampaignCache.getColor();
        mdCanvasService.init(
          scope.interactiveCanvas,
          'tcanvas',
          '#tshirtFacing',
          '#shirtDiv',
          tshirt.frontImage.url,
          tshirt.backImage.url,
          design ? design.front : null,
          design ? design.back : null,
          color
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
