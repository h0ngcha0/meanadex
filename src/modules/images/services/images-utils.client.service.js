'use strict';

angular.module('images').factory('ImagesUtils', [
  '$window', '$alert', 'SearchImages',
  function($window, $alert, SearchImages) {
    var isFile = function(item) {
      return angular.isObject(item) && item instanceof $window.File;
    };
    var isImage = function(file) {
      var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
      return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
    };
    var minSearchTextLength = 3;

    return {
      support: function() {
        return !!($window.FileReader && $window.CanvasRenderingContext2D);
      },
      isFile: isFile,
      isImage: isImage,
      validateImage: function(file, containerSelector, callback) {
        var maxSize = 5000000, // 5MB
            AlertDuration = 2; // 2sec

        if(isFile(file) || isImage(file)) {
          if(file.size > maxSize) {
            $alert({
              title: 'Warning:',
              content: 'max image size is 5MB',
              duration: AlertDuration,
              type: 'danger',
              animation: 'am-fade-and-slide-top',
              container: containerSelector
            });
          } else {
            callback();
          }
        }
      },
      disableSearch: function(text) {
        text = text ? text : '';
        return text.length < minSearchTextLength;
      },
      search: function(text, success, fail) {
        if(text.length >= minSearchTextLength) {
          SearchImages.query(
            {
              text: text,
              limit: 8
            }
          ).$promise.then(
            success,
            fail
          );
        }
      }
    };
  }
]);
