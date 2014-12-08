'use strict';

angular.module('dashboard').factory('DashboardUtils', [
  'ngTableParams',
  function(NgTableParams) {
    var tableOptions = {
      page: 1,
      count: 10,
      dataLength: 0,
      filter: undefined
    };

    return {
      newTableParams: function(getDataIn, pageIn, countIn, dataLengthIn) {
        return new NgTableParams(
          {
            page: pageIn || tableOptions.page,
            count: countIn || tableOptions.count
          },
          {
            total: dataLengthIn || tableOptions.dataLength,
            getData: getDataIn
          }
        );
      }
    };
  }
]);
