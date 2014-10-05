'use strict';

angular.module('tshirts').directive('mdImageUpload', [
  'mdCanvasService',
  function(mdCanvasService){
    return {
      restrict: 'E',
      scope: {
        uploader: '=',
        currentQueueItem: '=',
        onImageUpload: '&'
      },
      templateUrl: 'modules/images/views/image-upload.client.view.html',
      link: function(scope, element, attrs) {
      }
    };
  }
]);
