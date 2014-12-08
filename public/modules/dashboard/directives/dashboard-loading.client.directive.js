'use strict';

angular.module('dashboard').directive('dashboardLoading', [
  function() {
    return {
      template: '<div class="loading"><div class="double-bounce1"></div><div class="double-bounce2"></div></div>',
      restrict: 'AE'
    };
  }
]);
