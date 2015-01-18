/**
 * View controller for authorization error conditions.
 */
angular.module('auth').controller('AuthErrorController', [
  '$scope', '$stateParams',
  function ($scope, $stateParams) {
    'use strict';

    $scope.error = $stateParams.error || 'Unknown';
    $scope.errorDescription = $stateParams.error_description ||
                              'No description received from server.';
  }
]);
