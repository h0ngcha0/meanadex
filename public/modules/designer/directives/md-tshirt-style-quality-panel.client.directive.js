'use strict';

angular.module('designer').directive('mdTshirtStyleQualityPanel', [
  '$timeout', 'mdCanvasService',
  function($timeout, mdCanvasService) {
    return {
      restrict: 'E',
      templateUrl: 'modules/designer/views/style-quality.client.view.html',
      link: function(scope, element, attrs) {
        $timeout(function() {
          element.find('#designNextStep').click(function(e) {
            mdCanvasService.saveCanvas();
            if(mdCanvasService.isEmptyCanvas()) {
              element.find('#emptyCanvasModal').modal('show');
              e.preventDefault();
            }
          });
        }, 0);
      }
    };
  }
]);
