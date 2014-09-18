'use strict';

angular.module('tshirts').directive('mdListTshirts', [
  function($timeout){
    return {
      restrict: 'E',
      templateUrl: 'modules/tshirts/views/list-tshirts.client.view.html',
      link: function(scope, element, attrs) {
      }
    };
  }
]);
