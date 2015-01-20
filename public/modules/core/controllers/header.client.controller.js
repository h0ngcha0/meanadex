'use strict';

angular.module('core').controller('HeaderController', [
  '$scope', 'Authentication', 'Menus', '$location',
  function($scope, Authentication, Menus, $location) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');

    $scope.isDashboard = function() {
      var active = /^\/dashboard/.test($location.path());
      return active;
    };

    $scope.isLanding = function() {
      var active = /^\/landing/.test($location.path());
      return active;
    };

    $scope.isMainApp = function() {
      return !$scope.isDashboard() && !$scope.isLanding();
    };

    $('div.navbar-fixed-top').autoHidingNavbar({
      // see next for specifications
    });

    $scope.isAdmin = function() {
      if($scope.authentication.user) {
        return _.contains($scope.authentication.user.roles, 'admin');
      } else {
        return false;
      }
    };

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function() {
      $scope.isCollapsed = false;
    });
  }
]);
