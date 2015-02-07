'use strict';

angular.module('dashboard').directive('dashboardWidgetBody', [
  function() {
    return {
      requires: '^dashboardWidget',
      scope: {
        loading: '@?',
        classes: '@?'
      },
      transclude: true,
      template: '<div class="widget-body" ng-class="classes"><rd-loading ng-show="loading"></rd-loading><div ng-hide="loading" class="widget-content" ng-transclude></div></div>',
      restrict: 'E'
    };
  }
]);
