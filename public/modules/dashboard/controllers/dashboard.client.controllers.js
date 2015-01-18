'use strict';

angular.module('dashboard').controller('DashboardController', [
  '$scope', '$state', '$cookieStore', 'Dashboard',
  function($scope, $state, $cookieStore, Dashboard) {
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

    $scope.userDropdown = [
      {
        text: 'Go to designer',
        href: '/#!/'
      },
      {
        text: 'Signout',
        href: '#!/auth/deauthorize'
      }
    ];
  }
]);
