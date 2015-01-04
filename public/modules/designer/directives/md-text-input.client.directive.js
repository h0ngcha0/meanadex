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
          {name: 'Arial', label: '<font face="Arial">Arial<font>'},
          {name: 'Helvetica', label: '<font face="Helvetica">Helvetica<font>'},
          {name: 'Myriad Pro', label: '<font face="MyriadPro">MyriadPro<font>'},
          {name: 'Delicious', label: '<font face="Delicious">Delicious<font>'},
          {name: 'Verdana', label: '<font face="Verdana">Verdana<font>'},
          {name: 'Georgia', label: '<font face="Georgia">Georgia<font>'},
          {name: 'Courier', label: '<font face="Courier">Courier<font>'},
          {name: 'Comic Sans MS', label: '<font face="ComicSansMS">ComicSansMS<font>'},
          {name: 'Impact', label: '<font face="Impact">Impact<font>'},
          {name: 'Monaco', label: '<font face="Monaco">Monaco<font>'},
          {name: 'Optima', label: '<font face="Optima">Optima<font>'},
          {name: 'Hoefler Text', label: '<font face="Hoefler Text">Hoefler Text<font>'},
          {name: 'Plaster', label: '<font face="Plaster">Plaster<font>'},
          {name: 'Engagement', label: '<font face="Engagement">Engagement<font>'}
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
