'use strict';

/* global moment */
/* global d3 */

// Campaigns controller
angular.module('campaigns').controller('CampaignsGraphController', [
  '$scope', 'Dashboard',
  function($scope, Dashboard) {
    $scope.loadCampaignData = function(fromDate, toDate, callback) {
      Dashboard.campaignsCreated.query(
        {
          startDate: fromDate,
          endDate: toDate
        },
        function(data) {
          callback(null, data);
        },
        function(err) {
          callback(err);
        }
      );
    };
  }
]);
