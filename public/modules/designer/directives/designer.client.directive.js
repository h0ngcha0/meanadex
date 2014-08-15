'use strict';

angular.module('designer').directive('designer', [
  function() {
    return {
      template: '<div></div>',
      restrict: 'E',
      link: function postLink(scope, element, attrs) {
        // Designer directive logic
        // ...

        element.text('this is the designer directive');
      }
    };
  }
]);
