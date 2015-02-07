/**
 * A set of utility methods that may be used during state declaration to enforce
 * session state. They return asynchronous promises which will either resolve
 * or reject the state change, depending on what you're asking for.
 */
angular.module('auth').constant('SessionResolver',
  (function () {
    'use strict';

    /**
     * Resolve the promise based on the current session state. We can't
     * inject here, since the injector's not ready yet.
     */
    function resolveSessionState(deferred, desiredSessionState, Session) {
      return function () {
        var sessionState = Session.getSessionState();
        if (sessionState === desiredSessionState) {
          deferred.resolve(sessionState);
        } else {
          deferred.reject(sessionState);
        }
      };
    }

    return {
      /**
       * This resolver simply checks to see whether a user is logged
       * in or not, and returns the session state.
       */
      resolveSessionState: ['$q', '$log', 'Session', 'SessionState',
        function ($q, $log, Session, SessionState) {
          var deferred = $q.defer();

          $log.debug('Resolving session state...');
          Session.resolveSessionState().then(
            function (sessionState) {
              deferred.resolve(sessionState);
            },
            function (error) {
              $log.error(error);
              deferred.resolve(SessionState.LOGGED_OUT);
            }
          );

          return deferred.promise;
        }
      ],

      /**
       * This resolver asserts that the user is logged
       * out before allowing a route. Otherwise it fails.
       */
      requireLoggedOut: ['$q', '$log', 'Session', 'SessionState',
        function ($q, $log, Session, SessionState) {

          $log.debug('Resolving logged-out-only route...');
          var deferred = $q.defer();
          var resolveLoggedOut = resolveSessionState(deferred,
            SessionState.LOGGED_OUT, Session);

          // Do we have to wait for state resolution?
          if (Session.getSessionState() === SessionState.PENDING) {
            Session.resolveSessionState().then(resolveLoggedOut);
          } else {
            resolveLoggedOut();
          }

          return deferred.promise;
        }
      ],

      /**
       * This resolver asserts that the user is logged
       * in before allowing a route. Otherwise it fails.
       */
      requireLoggedIn: ['$q', '$log', 'Session', '$rootScope', 'SessionState',
        function ($q, $log, Session, $rootScope,
          SessionState) {

          $log.debug('Resolving logged-in-only route...');
          var deferred = $q.defer();
          var resolveLoggedIn = resolveSessionState(deferred,
            SessionState.LOGGED_IN, Session);

          // Do we have to wait for state resolution?
          if (Session.getSessionState() === SessionState.PENDING) {
            Session.resolveSessionState().then(resolveLoggedIn);
          } else {
            resolveLoggedIn();
          }

          return deferred.promise;
        }
      ],

      /**
       * This resolver ensures that the currentUser has been resolved
       * before the route resolves.
       */
      requireCurrentUser: ['$q', '$log', 'CurrentUser',
        function ($q, $log, CurrentUser) {
          $log.debug('Resolving current user...');
          return CurrentUser.resolve();
        }
      ]
    };
  })()
);
