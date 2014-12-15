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

        graphData: '='
      },
      restrict: 'E',
      templateUrl: 'modules/dashboard/views/dashboard-graph.client.view.html',
      link: function(scope, element, attr) {
        console.log('open to date:');
        console.log(scope.openToDate);
      }
    };
  }
]);
