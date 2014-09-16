'use strict';

angular.module('admin').controller('AdminController', [
  '$scope', 'Authentication', '$location',
  function($scope, Authentication, $location) {
    $scope.authentication = Authentication;

    // check if a user is authenticated
    $scope.ensureAuthenticated = function() {
      if(!$scope.authentication.user) {
        $location.path('signin');
      }
    };

    // check if a user is authorized to access the admin page
    $scope.isAuthorized = function() {
      var roles = $scope.authentication.user.roles;
      return _.contains(roles, 'admin');
    };
  }
]);
