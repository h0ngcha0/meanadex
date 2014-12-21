'use strict';

angular.module('dashboard').directive('dashboardGraph', [
  function() {
    return {
      scope: {
        fromDate: '=',
        fromDateIsOpen: '=',
        fromMinDate: '=',
        fromMaxDate: '=',
        openFromDate: '&',
        toDate: '=',
        toDateIsOpen: '=',
        toMinDate: '=',
        toMaxDate: '=',
        openToDate: '&',
        datepickerOptions: '=',
        graphData: '=',
        xscale: '&',
        xformat: '&'
      },
      restrict: 'E',
      templateUrl: 'modules/dashboard/views/dashboard-graph.client.view.html',
      link: function(scope, element, attr) {
      }
    };
  }
]);
