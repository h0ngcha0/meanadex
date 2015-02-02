'use strict';
/**
 * Session redirect service, which provides us with some session/auth related
 * modals.
 */
angular.module('auth')
  .factory('SessionRedirectService', ['$state', function ($state) {
  return {

    redirectToLogin: function () {
      $state.go('auth.signin');
    }
  };
}]);
