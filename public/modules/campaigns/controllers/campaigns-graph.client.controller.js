'use strict';

/* global moment */
/* global d3 */

// Campaigns controller
angular.module('campaigns').controller('CampaignsGraphController', [
  '$scope', 'Campaigns',
  function($scope, Campaigns) {
    $scope.loadCampaignData = function(fromDate, toDate, callback) {
      Campaigns.query(
        {
          startDate: fromDate,
          endDate: toDate
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
  }
]);
