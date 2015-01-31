'use strict';

angular.module('core').controller('HeaderController', [
  '$scope', 'Menus', '$location', 'Notification', 'CurrentUser',
  'SessionState', 'Priority', 'FeaturedCampaigns',
  function($scope, Menus, $location, Notification,
           CurrentUser, SessionState, Priority, FeaturedCampaigns) {
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

    $scope.initFeaturedCampaigns = function() {
      $scope.featuredCampaigns = FeaturedCampaigns.query(
        {
          itemsPerPage: 6
        }
      );
    };

    /**
     * Load and maintain the current user.
     */
    $scope.currentUser = null;

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
