'use strict';

// Campaigns controller
angular.module('campaigns').controller('CampaignsGraphController', [
  '$scope', 'Authentication', 'Campaigns',
  function($scope, Authentication, Campaigns) {
    $scope.authentication = Authentication;

    var findBetween = function(start, end) {
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
