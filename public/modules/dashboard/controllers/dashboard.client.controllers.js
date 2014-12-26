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
      var data = [
        'totalIncome',
        'totalOrders',
        'totalCampaigns',
        'activeCampaigns'
      ];

      data.forEach(function(d) {
        $scope[d] = 0;
      });

      async.each(data, function(d, c) {
        Dashboard[d].query(
          {
          },
          function(res) {
            $scope[d] = res.value;
            c(null);
          },
          function(err) {
            $scope[d] = 0;
            c(null);
          }
        );
      });
    };
  }
]);
