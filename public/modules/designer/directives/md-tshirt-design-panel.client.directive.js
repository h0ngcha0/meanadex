'use strict';

angular.module('designer').directive('mdTshirtDesignPanel', [
  '$timeout',
  function($timeout) {
    return {
      restrict: 'E',
      templateUrl: 'modules/designer/views/design-panel.client.view.html',
      link: function(scope, element) {
      }
    };
  }
]);
