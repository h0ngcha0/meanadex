'use strict';

angular.module('dashboard').directive('dashboardWidget', [
  function() {
    return {
      transclude: true,
      template: '<div class="widget" ng-transclude></div>',
      restrict: 'EA',
      link: function postLink(scope, element, attrs) {
      }
    };
  }
]);
