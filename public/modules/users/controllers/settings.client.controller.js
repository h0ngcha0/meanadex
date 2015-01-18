'use strict';

angular.module('users').controller('SettingsController', [
  '$scope', '$http', '$location', 'Users', 'currentUser',
  function($scope, $http, $location, Users, currentUser) {
    $scope.user = currentUser;

    // Update a user profile
    $scope.updateUserProfile = function() {
      var user = new Users($scope.user);
      $scope.success = $scope.error = null;
      user.$update(
        function(response) {
          $scope.success = true;
        },
        function(response) {
          $scope.error = response.data.message;
        }
      );
    };

    // Change user password
    $scope.changeUserPassword = function() {
      $scope.success = $scope.error = null;

      $http.post('/users/password', $scope.passwordDetails).success(function(response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function(response) {
        $scope.error = response.message;
      });
    };
  }
]);
