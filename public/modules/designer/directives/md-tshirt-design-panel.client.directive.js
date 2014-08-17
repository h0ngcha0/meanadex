'use strict';

angular.module('designer').directive('mdTshirtDesignPanel', [
  '$timeout',
  function($timeout) {
    return {
      restrict: 'E',
      scope: {
        colors: '=',
        images: '=',
        fonts: '='
      },
      templateUrl: 'modules/designer/views/design-panel.client.view.html',
      link: function(scope, element) {
        $timeout(function() {
          element.find('.tab-link').click(function(event) {
            event.preventDefault();
          });
        }, 0);
      }
    };
  }
]);
