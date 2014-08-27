'use strict';

angular.module('designer').directive('mdTshirtStyleQualityPanel', [
  function() {
    return {
      restrict: 'E',
      templateUrl: 'modules/designer/views/style-quality.client.view.html',
      link: function(scope, element, attrs) {
      }
    };
  }
]);
