/**
 * A list of constants used by the session service to maintain the user's
 * current authentication state.
 */
angular.module('auth').value('SessionState', {

  /**
   * Session state constant, used to indicate that the user is logged in.
   */
  LOGGED_IN: 'logged_in',

  /**
   * Session state constant, used to indicate that the user is logged out.
   */
  LOGGED_OUT: 'logged_out',

  /**
   * Session state constant, used during initialization when we're not quite
   * certain yet whether we're logged in or logged out.
   */
  PENDING: 'pending'

});
