'use strict';

angular.module('designer').directive('mdTextInput', [
  '$timeout', 'mdCanvasService',
  function($timeout, mdCanvasService){
    return {
      restrict: 'E',
      templateUrl: 'modules/designer/views/text-input.client.view.html',
      link: function(scope, element, attrs) {
        $timeout(function() {
          // FIXME: need to figure out a way to communicate the set the
          // currentFont, fontColor and inputText from here
          scope.$on('mdeTextObjectSelected', function(event, props) {
            element.find('#text-string').val(props.text);

            //element.find('#text-fontcolor').minicolors(
            //  'value', props.fontColor
            //);

            var index;
            for(var i=0; i<scope.fonts.length; i++) {
              if (scope.fonts[i].name.toLowerCase() === props.fontFamily.toLowerCase()) {
                index = i;
              }
            }

            element.find('.font-family-picker').val(index || 0);
          });

          scope.$on('mdeObjectCleared', function(event) {
            element.find('#text-string').val('');
            //element.find('#text-fontcolor').minicolors(
            //  'value', '#000000'
            //);

            //element.find('.font-family-picker').val(0);
          });
        }, 0);
      }
    };
  }
]);
