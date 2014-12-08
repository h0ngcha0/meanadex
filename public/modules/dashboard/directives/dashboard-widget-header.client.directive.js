'use strict';

angular.module('dashboard').directive('dashboardWidgetHeader', [
  function() {
    return {
      requires: '^dashboardWidget',
      scope: {
        title: '@',
        icon: '@'
      },
      transclude: true,
      template: '<div class="widget-header"><i class="fa" ng-class="icon"></i> {{title}} <div class="pull-right" ng-transclude></div></div>',
      restrict: 'E'
    };
  }
]);
