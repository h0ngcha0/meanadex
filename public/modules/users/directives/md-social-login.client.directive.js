'use strict';

angular.module('users').directive('mdSocialLogin', [
  function(){
    return {
      restrict: 'E',
      templateUrl: 'modules/users/views/authentication/social-login.client.view.html'
    };
  }
]);
