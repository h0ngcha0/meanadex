'use strict';

angular.module('designer').directive('mdBgColorPicker', [
  '$timeout', 'mdCanvasService',
  function($timeout, mdCanvasService){
    return {
      restrict: 'E',
      scope: {
        colors: '='
      },
      templateUrl: 'modules/designer/views/bg-color-picker.client.view.html',
      link: function(scope, element, attrs) {
        $timeout(function() {
          scope.$watch('colors', function() {
            element.find('.color-preview').on('click', function(){
              var color = $(this).css('background-color');
              mdCanvasService.changeBackground(color);
            });
          });
        }, 0);
      }
    };
  }
]);
