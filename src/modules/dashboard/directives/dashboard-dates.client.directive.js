'use strict';

/* global moment */

angular.module('dashboard').directive('dashboardDates', [
  '$rootScope', 'DashboardUtils',
  function($rootScope, DashboardUtils) {
    return {
      scope: {},
      restrict: 'E',
      templateUrl: 'modules/dashboard/views/dashboard-dates.client.view.html',
      link: function(scope, element, attr) {
        scope.period = DashboardUtils.initialCalendarDates();

        scope.reloadData = function() {
          var from = scope.period.fromDate;
          var to = scope.period.toDate;
          $rootScope.$broadcast('dashboard.dates', {
            from: from,
            to: to
          });
        };
      }
    };
  }
]);
