'use strict';

angular.module('designer').directive('mdTshirtDesignPanel', [
  'Images', 'mdCanvasService', 'ImagesUtils',
  function(Images, mdCanvasService, ImagesUtils) {
    return {
      restrict: 'E',
      templateUrl: 'modules/designer/views/design-panel.client.view.html',
      link: function(scope, element) {
        scope.disableSearch = ImagesUtils.disableSearch;
        scope.searchImages = function(text) {
          ImagesUtils.search(
            text,
            function(result) {
              scope.images = result.documents;
            },
            function(err) {
              scope.images = [];
            }
          );
        };

        // Initially load all the dog images
        scope.searchImages('dog');

        scope.addImage = function(imgSrc) {
          mdCanvasService.addImage(imgSrc);
        };

        scope.uploader.onAfterAddingFile = function(queueItem) {
          ImagesUtils.validateImage(
            queueItem.file,
            '.imageAlert',
            function() {
              var reader = new FileReader();
              reader.onload = function(event) {
                var imgUrl = event.target.result;
                scope.addImage(imgUrl);
              };
              reader.readAsDataURL(queueItem._file);
            }
          );
        };
      }
    };
  }
]);
