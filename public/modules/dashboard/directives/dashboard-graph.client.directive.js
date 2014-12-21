'use strict';

/* global moment */

angular.module('dashboard').directive('dashboardGraph', [
  function() {
    return {
      scope: {
        fromDate: '=',
        fromDateIsOpen: '=',
        fromMinDate: '=',
        fromMaxDate: '=',
        openFromDate: '&',
        toDate: '=',
        toDateIsOpen: '=',
        toMinDate: '=',
        toMaxDate: '=',
        openToDate: '&',
        datepickerOptions: '=',
        graphData: '=',
        xscale: '&',
        tooltipcontent: '&',
        loadData: '&'
      },
      restrict: 'E',
      templateUrl: 'modules/dashboard/views/dashboard-graph.client.view.html',
      link: function(scope, element, attr) {
        // start is a moment/date
        var categorizeByDay = function(ts, start, end) {
          var diff = end.diff(start, 'days');
          var format = 'DD/MM/YY';
          var map = _.reduce(
            _.range(diff+1),
            function(acc, difference) {
              var key = start.clone().add(difference, 'days').format(format);
              acc[key] = 0;
              return acc;
            },
            {}
          );

          _.each(ts, function(t) {
            var date = t.format(format);
            if(_.isNumber(map[date])) {
              map[date]++;
            }
          });

          return _.map(
            _.pairs(map),
            function(m) {
              return [moment(m[0], format).format('x'), m[1]];
            }
          );
        };

        scope.reloadData = function() {
          var start = moment(scope.fromDate);
          var end = moment(scope.toDate);

          scope.loadData()(start, end, function(err, ts){
            if(!err) {
              console.log('time series:');
              console.log(ts);
              var result = categorizeByDay(ts, start, end);
              console.log('result');
              console.log(result);
              scope.graphData = [
                {
                  'key': 'Campaigns',
                  values: result
                }
              ];
            }
          });
        };

        scope.xformat = function(){
          return function(d){
            return d3.time.format('%x')(new Date(d));
          };
        };

      }
    };
  }
]);
