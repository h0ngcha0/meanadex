'use strict';

/* global Share */

angular.module('core').directive('mdSocialButton', [
  '$timeout',
  function($timeout) {
    return {
      restrict: 'E',
      templateUrl: 'modules/core/views/social-button.client.view.html',
      link: function(scope, element, attrs) {
        $timeout(function() {
          new Share('.shared-button');
        }, 0);
      }
    };
  }
]);
