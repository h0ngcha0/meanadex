'use strict';

angular.module('dashboard').controller('DashboardController', [
  '$scope', 'Authentication', '$location', '$state', '$cookieStore',
  function($scope, Authentication, $location, $state, $cookieStore) {
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


    // Fake data for now
    $scope.campaignGraphData = [
      {
        'key': 'Series 1',
        values: [
          [0, 10],
          [1, 20],
          [2, 90],
          [3, 20],
          [4, 40],
          [5, 10],
          [9, 10],
          [100, 10]
        ]
      }
    ];

    // date picker related
    $scope.today = Date.today();
    $scope.weekAgo = Date.today().addDays(-7);
    $scope.fromDate = $scope.weekAgo;
    $scope.toDate = $scope.today;

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    $scope.date = {
      fromOpened: false,
      toOpened: false
    };

    $scope.openFromDate = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.date.fromOpened = true;
    };

    $scope.openToDate = function($event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.date.toOpened = true;
    };
  }
]);
