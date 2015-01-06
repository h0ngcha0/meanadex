'use strict';

angular.module('designer').directive('mdTshirtDesignPanel', [
  'Images', 'Tags', 'mdCanvasService', 'ImagesUtils', '$alert',
  function(Images, Tags, mdCanvasService, ImagesUtils, $alert) {
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

        scope.loadImages = function(tags) {
          var queryTags;
          if(tags) {
            if(_.isArray(tags)) {
              queryTags = _.map(tags, function(tag) {
                            return tag.value;
                          });
            } else {
              queryTags = [tags.value];
            }
          }

          scope.images = Images.query({tags: queryTags});
        };

        scope.addImage = function(imgSrc) {
          mdCanvasService.addImage(imgSrc);
        };

        scope.uploader.onAfterAddingFile = function(queueItem) {
          var maxSize = 5000000, // 5MB
              AlertDuration = 2; // 2sec

          if(ImagesUtils.isFile(queueItem.file) || ImagesUtils.isImage(queueItem.file)) {
            var imgSize = queueItem.file.size;

            if(imgSize > maxSize) {
              $alert({
                title: 'Warning:',
                content: 'max image size is 5MB',
                duration: AlertDuration,
                type: 'danger',
                animation: 'am-fade-and-slide-top',
                container: '.imageAlert'
              });
            } else {
              var reader = new FileReader();
              reader.onload = function(event) {
                var imgUrl = event.target.result;
                scope.addImage(imgUrl);
              };
              reader.readAsDataURL(queueItem._file);
            }
          }
        };
      }
    };
  }
]);
