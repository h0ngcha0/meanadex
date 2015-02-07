'use strict';

angular.module('dashboard').controller('DashboardAlertController', [
  '$scope',
  function($scope) {
    // Potentially push system messages to users here
    $scope.alerts = [];

    $scope.addAlert = function() {
      $scope.alerts.push({
        msg: 'Another alert!'
      });
    };

    $scope.closeAlert = function(index) {
      $scope.alerts.splice(index, 1);
    };
  }
]);
