'use strict';

angular.module('designer').directive('mdTextInput', [
  '$timeout', 'mdCanvasService',
  function($timeout, mdCanvasService){
    return {
      restrict: 'E',
      templateUrl: 'modules/designer/views/text-input.client.view.html',
      link: function(scope, element, attrs) {
        $timeout(function() {
          element.find('#text-fontcolor').minicolors({
            change: function(hex) {
              mdCanvasService.renderActiveTextFontColor(hex);
            }
          });

          element.find('.font-family-picker').change(
            function(event) {
              var sclass = '.font-family-picker option:selected',
                  selected = element.find(sclass)[0],
                  font = $(selected).text();

              mdCanvasService.changeTextFontFamily(font);
              event.preventDefault();
            }
          );

          element.find('#text-string').keyup(function(e){
            var text = $(this)[0].value;

            if(mdCanvasService.activeTextP()) {
              mdCanvasService.renderActiveTextContent(text);
            } else if (text !== '') {
              var miniColorValFun = function(sel) {
                    return element.find(sel).minicolors('value');
                  },
                  fontColor = miniColorValFun('#text-fontcolor'),
                  sfClass = '.font-family-picker option:selected',
                  sFontObj = element.find(sfClass)[0],
                  fontFamily = $(sFontObj).text();

              mdCanvasService.addTextWhenNoActiveText(
                text, fontColor, fontFamily
              );
              mdCanvasService.setTheLastObjActive();
            }
          });

          scope.$on('mdeTextObjectSelected', function(event, props) {
            element.find('#text-string').val(props.text);

            element.find('#text-fontcolor').minicolors(
              'value', props.fontColor
            );

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
            element.find('#text-fontcolor').minicolors(
              'value', '#000000'
            );

            element.find('.font-family-picker').val(0);
          });
        }, 0);
      }
    };
  }
]);
