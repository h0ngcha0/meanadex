'use strict';

angular.module('dashboard').directive('dashboardWidgetFooter', [
  function() {
    return {
      requires: '^dashboardWidget',
      transclude: true,
      template: '<div class="widget-footer" ng-transclude></div>',
      restrict: 'E'
    };
  }
]);
