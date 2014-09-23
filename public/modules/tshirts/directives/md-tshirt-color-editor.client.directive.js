'use strict';

angular.module('tshirts').directive('mdTshirtColorEditor', [
  function($timeout){
    return {
      restrict: 'E',
      scope: {
        variant: '=',
        removecolor: '&',
        addcolor: '&'
      },
      templateUrl: 'modules/tshirts/views/tshirt-color-editor.client.view.html',
      link: function(scope, element, attrs) {
      }
    };
  }
]);
