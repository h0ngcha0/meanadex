/**
 * This controller deauthorizes the session and destroys all tokens.
 */

angular.module('auth').controller('AuthDeauthorizeController', [
  'Session', '$state', '$log',
  function (Session, $state, $log) {
    'use strict';

    $log.debug('Logging out');
    Session.destroySession();
    $state.go('index');
  }
]);
