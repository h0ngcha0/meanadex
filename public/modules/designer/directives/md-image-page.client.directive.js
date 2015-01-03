'use strict';

angular.module('designer').directive('mdImagePage', [
  'mdCanvasService',
  function(mdCanvasService){
    return {
      restrict: 'E',
      templateUrl: 'modules/designer/views/image-page.client.view.html',
      link: function(scope, element, attrs) {
      }
    };
  }
]);
