'use strict';

angular.module('designer').directive('mdImagePage', [
  '$timeout', 'mdCanvasService',
  function($timeout, mdCanvasService){
    return {
      restrict: 'E',
      scope: {
        images: '='
      },
      templateUrl: 'modules/designer/views/image-page.client.view.html',
      link: function(scope, element, attrs) {
        $timeout(function() {
          element.find('.img-thumbnail').on('click', function(e){
            var el = e.target;
            mdCanvasService.addImage(el.src);
          });
        }, 0);
      }
    };
  }
]);
