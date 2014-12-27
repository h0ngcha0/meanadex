'use strict';

/* global moment */
/* global d3 */

angular.module('dashboard').directive('dashboardGraph', [
  '$timeout', 'Authentication',
  function($timeout, Authentication) {
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

        scope.user = Authentication.user;

        var today = new Date(),
            weekAgo = moment(today).subtract(6, 'd').startOf('day').toDate(),
            fromMinDate = moment(scope.user.created).startOf('day').toDate(),
            fromDate = weekAgo.getTime() > fromMinDate.getTime() ? weekAgo : fromMinDate,
            toDate = moment(today).endOf('day').toDate();

        scope.reloadData = function(start, end) {
          scope.loadData()(start, end, function(err, data){
            if(!err) {
              var values = paddingValues(data.values, start.getTime(),
                end.getTime());

              // total items
              scope.total = data.total;

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
          scope.reloadData(fromDate, toDate);
        }, 0);
      }
    };
  }
]);
