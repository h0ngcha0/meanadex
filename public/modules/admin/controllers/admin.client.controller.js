'use strict';

angular.module('admin').controller('AdminController', [
  '$scope', 'Authentication', '$location', '$state',
  function($scope, Authentication, $location, $state) {
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

    $scope.listTshirts = function() {
      $state.go('admin.tshirts');
    };

    $scope.listCampaigns = function() {
      $location.path('admin/campaigns');
    };
  }
]);
