'use strict';

/**
 * Session management service - keeps track of our current session state, mostly
 * by verifying the token state returned from the OpenID service.
 */
angular.module('auth').factory('Session',
  [
    'SessionState', 'AccessToken', '$rootScope', '$log', '$q', '$state',
    'User', 'RefreshManager', 'Notification', 'Severity', '$stateParams',
    function (SessionState, AccessToken, $rootScope, $log, $q, $state, User,
      RefreshManager, Notification, Severity, $stateParams) {

      /**
       * The current session state.
       *
       * @type String
       */
      var sessionState = SessionState.PENDING;

      /**
       * Initialize the session.
       */
      function initializeSession() {
        var deferred = $q.defer();

        if (!AccessToken.getAccessToken()) {
          $log.debug('No token found');
          updateSessionState(SessionState.LOGGED_OUT);
          deferred.resolve();
        } else {
          // Validate the token currently in the cache.
          validateToken()
            .then(function () {
            $log.debug('Token validated');
            updateSessionState(SessionState.LOGGED_IN);
            deferred.resolve(sessionState);
          }, function () {
            $log.debug('Token not validated');
            AccessToken.clear();
            updateSessionState(SessionState.LOGGED_OUT);
            deferred.resolve(sessionState);
          });
        }

        return deferred.promise;
      }

      /**
       * Validate the token.
       */
      function validateToken() {

        /**
         * Try fresh call is necessary here because a User may try to
         * validate a token after a long break.
         * Even if refresh is not necessary right now the tryRefresh method
         * will just resolve immediately.
         */

        var deferred = $q.defer();
        RefreshManager.tryRefresh().then(function () {
          var id = AccessToken.getIdToken();

          User.get({id: id},
            function (user) {
              deferred.resolve(user);
            }, function (error) {
              deferred.reject(error);
            }
          );
        });
        return deferred.promise;
      }


      /**
       * Handles state updates and broadcasts.
       */
      function updateSessionState(newState) {
        if (newState !== sessionState) {
          sessionState = newState;
          Notification.send(newState, newState, Severity.SUCCESS);
        }
      }

      /**
       * Destroy the session (Clear the token).
       */
      function destroySession() {
        AccessToken.clear();
        updateSessionState(SessionState.LOGGED_OUT);
        $state.transitionTo($state.current, $stateParams, {
          reload: false, inherit: false, notify: true
        });
      }

      /**
       * Initialize and test our current session token.
       */
      initializeSession();

      // Expose the methods for this service.
      return {
        /**
         * The current session state.
         */
        getSessionState: function () {
          return sessionState;
        },

        /**
         * Resolve the current session state, as a promise.
         */
        resolveSessionState: function () {
          var deferred = $q.defer();
          if (sessionState !== SessionState.PENDING) {
            deferred.resolve(sessionState);
          } else {
            var unwatch = $rootScope.$watch(function () {
              return sessionState;
            }, function () {
              if (sessionState !== SessionState.PENDING) {
                deferred.resolve(sessionState);
                unwatch();
              }
            });
          }

          return deferred.promise;
        },

        /**
         * Are we logged in?
         */
        isLoggedIn: function () {
          return sessionState === SessionState.LOGGED_IN;
        },

        /**
         * Destroy the session.
         */
        destroySession: function () {
          destroySession();
        },

        /**
         * Update the session with a new (or null) token.
         */
        updateSession: function (token) {
          var deferred = $q.defer();
          if (!token) {
            destroySession();
            deferred.resolve(sessionState);
          } else {
            AccessToken.setToken(token);
            initializeSession().then(
              function () {
                deferred.resolve(sessionState);
              },
              function () {
                deferred.resolve(sessionState);
              }
            );
          }

          return deferred.promise;
        }
      };
    }
  ]
);
