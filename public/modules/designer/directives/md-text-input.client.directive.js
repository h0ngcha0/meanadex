'use strict';

angular.module('designer').directive('mdTextInput', [
  '$timeout', 'mdCanvasService',
  function($timeout, mdCanvasService){
    return {
      restrict: 'E',
      scope: {},
      templateUrl: 'modules/designer/views/text-input.client.view.html',
      link: function(scope, element, attrs) {
        scope.fontColor = '#000000';
        scope.inputText = '';

        scope.fonts = [
          {name: 'Arial', class: 'Arial'},
          {name: 'Helvetica', class: 'Helvetica'},
          {name: 'Myriad Pro', class: 'MyriadPro'},
          {name: 'Delicious', class: 'Delicious'},
          {name: 'Verdana', class: 'Verdana'},
          {name: 'Georgia', class: 'Georgia'},
          {name: 'Courier', class: 'Courier'},
          {name: 'Comic Sans MS', class: 'ComicSansMS'},
          {name: 'Impact', class: 'Impact'},
          {name: 'Monaco', class: 'Monaco'},
          {name: 'Optima', class: 'Optima'},
          {name: 'Hoefler Text', class: 'Hoefler Text'},
          {name: 'Plaster', class: 'Plaster'},
          {name: 'Engagement', class: 'Engagement'}
        ];

        scope.currentFont = scope.fonts[0];

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
