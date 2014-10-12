'use strict';

angular.module('images').factory('ImagesUtils', [
  '$window',
  function($window) {
    return {
      support: function() {
        return !!($window.FileReader && $window.CanvasRenderingContext2D);
      },
      isFile: function(item) {
        return angular.isObject(item) && item instanceof $window.File;
      },
      isImage: function(file) {
        var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    };
  }
]);
