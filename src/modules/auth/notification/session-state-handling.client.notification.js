angular.module('auth').run([
  '$log', 'Notification', 'SessionState', 'Priority',
  function ($log, Notification, SessionState, Priority) {
    'use strict';


    // We're using -1 as the priority, to ensure that this is
    // intercepted before anything else happens.
    Notification.intercept(function (message) {

      switch (message.type) {
        case SessionState.LOGGED_IN:
        // Logged in messages get filtered out.
        return true;
        case SessionState.LOGGED_OUT:
        message.message = 'You have been logged out.';
        break;
        default:
        break;
      }
    }, Priority.AFTER);

  }
]);
