'use strict';

angular.module('core').controller('HeaderController', [
  '$scope', 'Menus', '$location', 'Notification', 'CurrentUser',
  'SessionState', 'Priority',
  function($scope, Menus, $location, Notification, CurrentUser, SessionState,
    Priority) {
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');

    function resolveCurrentUser() {
      CurrentUser.resolve().then(
        function (user) {
          $scope.currentUser = user;
        },
        function () {
          $scope.currentUser = null;
        }
      );
    }

    resolveCurrentUser();

    /**
     * Load and maintain the current user.
     */
    $scope.currentUser = null;

    $scope.isActive = function() {
      var active = /^\/dashboard/.test($location.path());
      return active;
    };

    $('div.navbar-fixed-top').autoHidingNavbar({
      // see next for specifications
    });

    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function() {
      $scope.isCollapsed = false;
    });

    // Watch for changes to the session state.
    Notification.intercept(function (message) {
      switch (message.type) {
        case SessionState.LOGGED_IN:
        resolveCurrentUser();
        break;
        case SessionState.LOGGED_OUT:
        $scope.currentUser = null;
        break;
        default:
        break;
      }
    }, Priority.LAST);
  }
]);
