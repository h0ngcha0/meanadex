'use strict';

angular.module('tshirts').directive('mdImageThumb', [
  '$window', 'ImagesUtils',
  function($window, ImagesUtils) {
    return {
      restrict: 'E',
      scope: {
        file: '=',
        width: '='
      },
      template: '<canvas/>',
      link: function(scope, element, attributes) {
        scope.$watch('file', function() {
          var file = scope.file;

          if (!ImagesUtils.support()) return;

          if (!ImagesUtils.isFile(file)) return;
          if (!ImagesUtils.isImage(file)) return;

          var canvas = element.find('canvas');
          var reader = new FileReader();

          function onLoadFile(event) {
            var img = new Image();
            img.onload = function() {
              var width = scope.width;
              var height = ((img.height / img.width) * scope.width);
              canvas.attr({ width: width, height: height });
              canvas[0].getContext('2d').drawImage(img, 0, 0, width, height);
            };
            img.src = event.target.result;
          }

          reader.onload = onLoadFile;
          reader.readAsDataURL(file);
        });
      }
    };
  }
]);
