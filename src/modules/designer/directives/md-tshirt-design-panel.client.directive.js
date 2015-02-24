'use strict';

angular.module('designer').directive('mdTshirtDesignPanel', [
  'Images', 'Tags', 'mdCanvasService', 'ImagesUtils', 'SearchImages',
  function(Images, Tags, mdCanvasService, ImagesUtils, SearchImages) {
    return {
      restrict: 'E',
      templateUrl: 'modules/designer/views/design-panel.client.view.html',
      link: function(scope, element) {
        scope.tags = [];

        // load tags
        Tags.query({}, function(data) {
          scope.tags = _.map(
            data,
            function(d) {
              return {
                  value: d,
                  label: '<i class="fa fa-circle-o"></i> ' + d
                };
              }
            );
        });

        var minSearchTextLength = 3;
        scope.searchText = '';
        scope.disableSearch = function(text) {
          return text.length < minSearchTextLength;
        };

        scope.searchImages = function(text) {
          console.log('search images: ' + text);
          if(text.length >= minSearchTextLength) {
            SearchImages.query(
              {
                text: text,
                limit: 8
              }
            ).$promise.then(
              function(result) {
                scope.images = result.documents;
              },
              function(err) {
                scope.images = [];
              }
            );
          }
        };

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
