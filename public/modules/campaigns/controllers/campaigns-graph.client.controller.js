'use strict';

/* global moment */
/* global d3 */

// Campaigns controller
angular.module('campaigns').controller('CampaignsGraphController', [
  '$scope', 'Authentication', 'Campaigns',
  function($scope, Authentication, Campaigns) {
    $scope.authentication = Authentication;

    var findBetween = function(start, end) {
    };

    // date picker related
    $scope.today = Date.today();
    $scope.weekAgo = Date.today().addDays(-7);
    $scope.fromDate = $scope.weekAgo;
    $scope.toDate = $scope.today;


    $scope.loadCampaignData = function(fromDate, toDate, callback) {
      Campaigns.query(
        {
          startDate: $scope.fromDate,
          endDate: $scope.toDate
        },
        function(data) {
          var ts = _.map(data, function(d) {
                     var dd = moment(Date.parse(d.created_at));
                     return dd;
                   });


          callback(null, ts);
        },
        function(err) {
          callback(err);
        }
      );
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };
  }
]);
