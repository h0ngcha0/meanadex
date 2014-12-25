'use strict';

/* global moment */
/* global d3 */

angular.module('dashboard').directive('dashboardGraph', [
  '$timeout',
  function($timeout) {
    return {
      scope: {
        loadData: '&'
      },
      restrict: 'E',
      templateUrl: 'modules/dashboard/views/dashboard-graph.client.view.html',
      link: function(scope, element, attr) {
        var paddingValues = function(values, start, end) {
          var map = _.reduce(
            _.range(start, end, 86400000),
            function(acc, ms) {
              acc[ms] = 0;
              return acc;
            },
            {}
          );

          _.each(values, function(t) {
            map[t[0]] +=  t[1];
          });

          return _.map(
            _.pairs(map),
            function(m) {
              return [+m[0], m[1]];
            }
          );
        };

        scope.today = Date.today();
        scope.toDate = Date.today();
        scope.fromDate = Date.today().addDays(-7); // week ago

        scope.reloadData = function() {
          var start = moment(scope.fromDate).startOf('day').toDate();
          var end = moment(scope.toDate).endOf('day').toDate();

          scope.loadData()(start, end, function(err, data){
            if(!err) {
              var values = paddingValues(data.values, start.getTime(),
                end.getTime());
              scope.graphData = [
                {
                  area: true,
                  values: values
                }
              ];
            }
            else {
              scope.graphData = [];
            }
          });
        };

        scope.xformat = function(){
          return function(d){
            return d3.time.format('%x')(new Date(d));
          };
        };


        scope.date = {
          fromOpened: false,
          toOpened: false
        };

        scope.openFromDate = function($event) {
          $event.preventDefault();
          $event.stopPropagation();

          scope.date.fromOpened = true;
        };

        scope.openToDate = function($event) {
          $event.preventDefault();
          $event.stopPropagation();

          scope.date.toOpened = true;
        };

        scope.xscale = function() {
          return d3.time.scale();
        };

        scope.tooltipcontent = function() {
          return function(key, x, y, e, graph) {
            var newX = d3.time.format('%Y-%m-%d')(new Date(+e.point[0]));
            return '<p>' + y + ' &#64; ' + newX + '</p>';
          };
        };

        scope.dateOptions = {
          formatYear: 'yy',
          startingDay: 1
        };

        // first time loading data
        $timeout(function() {
          scope.reloadData();
        }, 0);
      }
    };
  }
]);
