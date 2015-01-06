'use strict';

angular.module('designer').directive('mdTshirtStyleQualityPanel', [
  'mdCanvasService', '$location', '$modal',
  function(mdCanvasService, $location, $modal) {
    return {
      restrict: 'E',
      templateUrl: 'modules/designer/views/style-quality.client.view.html',
      link: function(scope, element, attrs) {
        scope.saveDesign = function() {
          mdCanvasService.saveCanvas();
          if(mdCanvasService.isEmptyCanvas()) {
            $modal({
              animation: 'am-fade-and-scale',
              placement: 'center',
              template: 'modules/designer/views/empty-canvas.client.view.html'
            });
          } else {
            $location.path('campaign_sales_goal');
          }
        };
      }
    };
  }
]);
