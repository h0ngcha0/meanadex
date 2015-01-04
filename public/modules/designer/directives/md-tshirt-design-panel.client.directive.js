'use strict';

angular.module('designer').directive('mdTshirtDesignPanel', [
  'Images',
  function(Images) {
    return {
      restrict: 'E',
      templateUrl: 'modules/designer/views/design-panel.client.view.html',
      link: function(scope, element) {
        scope.modal = {
          title: 'Title'
        };

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
      }
    };
  }
]);
