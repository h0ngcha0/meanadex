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
