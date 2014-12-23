'use strict';

angular.module('dashboard').controller('DashboardController', [
  '$scope', 'Authentication', '$location', '$state', '$cookieStore', 'Dashboard',
  function($scope, Authentication, $location, $state, $cookieStore, Dashboard) {
    $scope.authentication = Authentication;

    // check if a user is authenticated
    $scope.ensureAuthenticated = Authentication.ensureAuthenticated;

    $scope.isAdmin = function() {
      var roles = $scope.authentication.user.roles;
      return _.contains(roles, 'admin');
    };

    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };

    $scope.fetchData = function() {
        $scope.data = {};
        $scope.data.totalOrders = Dashboard.totalOrders.query();
        $scope.data.totalCampaigns = Dashboard.totalCampaigns.query();
        $scope.data.activeCampaigns = Dashboard.activeCampaigns.query();
    };
  }
]);
