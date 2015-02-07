'use strict';

angular.module('users').controller('SettingsController', [
  '$scope', '$http', '$location', 'Users', 'currentUser', 'theApiBase',
  function($scope, $http, $location, Users, currentUser, theApiBase) {
    $scope.user = currentUser;

    // Check if there are additional accounts
    $scope.hasConnectedAdditionalSocialAccounts = function(provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }

      return false;
    };

    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function(provider) {
      return $scope.user.provider ===
      provider ||
      ($scope.user.additionalProvidersData &&
        $scope.user.additionalProvidersData[provider]);
    };

    // Remove a user social account
    $scope.removeUserSocialAccount = function(provider) {
      $scope.success = $scope.error = null;

      $http.delete(theApiBase + '/users/accounts', {
        params: {
          provider: provider
        }
      }).success(function(response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = response;
      }).error(function(response) {
        $scope.error = response.message;
      });
    };

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

      $http.post(theApiBase + '/users/password', $scope.passwordDetails).success(function(response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function(response) {
        $scope.error = response.message;
      });
    };
  }
]);
