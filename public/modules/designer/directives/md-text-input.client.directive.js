'use strict';

angular.module('designer').directive('mdTextInput', [
  '$timeout', 'mdCanvasService',
  function($timeout, mdCanvasService){
    return {
      restrict: 'E',
      templateUrl: 'modules/designer/views/text-input.client.view.html',
      link: function(scope, element, attrs) {
        scope.fontColor = '#000000';
        scope.inputText = '';

        scope.changeFontFamily = function() {
          mdCanvasService.changeTextFontFamily(scope.currentFont.name);
        };

        scope.changeToBoldText = function() {
          mdCanvasService.toggleActiveTextBold();
        };

        scope.changeToItalicText = function() {
          mdCanvasService.toggleActiveTextItalic();
        };

        scope.changeToUnderlineText = function() {
          mdCanvasService.toggleActiveTextUnderline();
        };

        scope.changeColorText = function() {
          mdCanvasService.renderActiveTextFontColor(scope.fontColor);
        };

        scope.addOrEditText = function() {
          if(mdCanvasService.activeTextP()) {
            mdCanvasService.renderActiveTextContent(scope.inputText);
          } else if (scope.inputText !== '') {
            mdCanvasService.addTextWhenNoActiveText(
              scope.inputText, scope.fontColor, scope.currentFont.name);
            mdCanvasService.setTheLastObjActive();
          }
        };

        $timeout(function() {
          // FIXME: need to figure out a way to communicate the set the
          // currentFont, fontColor and inputText from here
          scope.$on('mdeTextObjectSelected', function(event, props) {
            var index = _.indexOf(_.map(scope.fonts, function(font) {
                                    return font.name.toLowerCase();
                                  }), props.fontFamily.toLowerCase()) || 0;

            element.find('.font-family-picker').val(index);
            element.find('#text-string').val(props.text);
          });

          scope.$on('mdeObjectCleared', function(event) {
            element.find('#text-string').val('');
          });
        }, 0);
      }
    };
  }
]);
