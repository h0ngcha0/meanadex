/**
 * A simple modal controller for the login require modal.
 */

angular.module('auth').controller('LoginRequiredModalController',
  ['$state', '$scope', '$modalInstance',
    function ($state, $scope, $modalInstance) {
      'use strict';

      $scope.login = function () {
        $state.go('auth.authorize');
        $modalInstance.dismiss('success');
      };

      $scope.close = function () {
        $modalInstance.dismiss('cancel');
      };
    }
  ]
);
