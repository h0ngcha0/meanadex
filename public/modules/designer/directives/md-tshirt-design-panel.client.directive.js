'use strict';

angular.module('designer').directive('mdTshirtDesignPanel', [
  'Images', 'Tags', 'mdCanvasService',
  function(Images, Tags, mdCanvasService) {
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
                            return tag.text;
                          });
            } else {
              queryTags = [tags.text];
            }
          }

          scope.images = Images.query({tags: queryTags});
        };

        scope.addImage = function(imgSrc) {
          mdCanvasService.addImage(imgSrc);
        };
      }
    };
  }
]);
