'use strict';

angular.module('tshirts').directive('mdImageThumb', [
  '$window',
  function($window) {
    var helper = {
      support: !!($window.FileReader && $window.CanvasRenderingContext2D),
      isFile: function(item) {
        return angular.isObject(item) && item instanceof $window.File;
      },
      isImage: function(file) {
        var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    };

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

          if (!helper.support) return;

          if (!helper.isFile(file)) return;
          if (!helper.isImage(file)) return;

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
