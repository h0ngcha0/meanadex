'use strict';

/* global moment */

angular.module('dashboard').directive('dashboardDates', [
  '$rootScope', 'Authentication', '$timeout', 'DashboardUtils',
  function($rootScope, Authentication, $timeout, DashboardUtils) {
    return {
      scope: {},
      restrict: 'E',
      templateUrl: 'modules/dashboard/views/dashboard-dates.client.view.html',
      link: function(scope, element, attr) {
        scope.user = Authentication.user;
        scope.period = DashboardUtils.initialCalendarDates();

        scope.date = {
          fromOpened: false,
          toOpened: false
        };

        scope.openFromDate = function($event) {
          $event.preventDefault();
          $event.stopPropagation();

          scope.date.fromOpened = true;
        };

        scope.openToDate = function($event) {
          $event.preventDefault();
          $event.stopPropagation();

          scope.date.toOpened = true;
        };

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
