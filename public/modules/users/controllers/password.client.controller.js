'use strict';

angular.module('users').controller('PasswordController', [
  '$scope', '$stateParams', '$http', '$location', 'theApiBase',
  function($scope, $stateParams, $http, $location, theApiBase) {
    // Submit forgotten password account id
    $scope.askForPasswordReset = function() {
      $scope.success = $scope.error = null;

      $http.post(theApiBase + '/auth/forgot', $scope.credentials).success(function(response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;

        }).error(function(response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };

    // Change user password
    $scope.resetUserPassword = function() {
      $scope.success = $scope.error = null;

      $http.post(theApiBase + '/auth/reset/' + $stateParams.token, $scope.passwordDetails).
        success(
          function(response) {
            // If successful show success message and clear form
            $scope.passwordDetails = null;

            // And redirect to the reset success page
            $location.path('/user/password/reset/success');
          }).
        error(
          function(response) {
            $scope.error = response.message;
            // And redirect to the reset invalid page
            $location.path('/user/password/reset/invalid');
          }
        );
    };
  }
]);
