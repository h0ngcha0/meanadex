'use strict';

/* global moment */
/* global d3 */

angular.module('dashboard').directive('dashboardGraph', [
  '$timeout', 'DashboardUtils',
  function($timeout, DashboardUtils) {
    return {
      scope: {
        title: '@',
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

        var period = DashboardUtils.initialCalendarDates();

        scope.reloadData = function(start, end) {
          scope.loadData()(start, end, function(err, data){
            if(!err) {
              var values = paddingValues(data.values, start.getTime(),
                end.getTime());

              // total items
              scope.total = data.total;

              scope.yaxisdomain = function() {
                var max = d3.max(values, function(v) { return v[1];});
                return [
                  0,
                  max ? max : 1
                ];
              };

              scope.graphData = [
                {
                  key: scope.title,
                  area: true,
                  values: values
                }
              ];
            }
            else {
              scope.total = 0;
              scope.graphData = [];
              scope.yaxisdomain = function() {
                return [0, 1];
              };
            }
          });
        };

        scope.xformat = function(){
          return function(d){
            return d3.time.format('%Y-%m-%d')(new Date(d));
          };
        };

        scope.yformat = function() {
          return function(d){
            return d3.format(',g')(d);
          };
        };

        scope.$on('dashboard.dates', function(event, dates) {
          scope.reloadData(dates.from, dates.to);
        });

        scope.xscale = function() {
          return d3.time.scale();
        };

        scope.tooltipcontent = function() {
          return function(key, x, y, e, graph) {
            var newX = d3.time.format('%Y-%m-%d')(new Date(+e.point[0]));
            return '<p>' + y + ' &#64; ' + newX + '</p>';
          };
        };

        // first time loading data
        $timeout(function() {
          scope.reloadData(period.fromDate, period.toDate);
        }, 0);
      }
    };
  }
]);
