'use strict';

/**
 * The current user service. It pays attention to changes in the application's
 * session state, and loads the user found in the AccessToken when a valid
 * session is detected.
 */
angular.module('auth').factory('CurrentUser',
  [
    'SessionState', 'Session', 'AccessToken', '$rootScope', '$log', '$q',
    'User', 'Notification', 'Priority',
    function (SessionState, Session, AccessToken, $rootScope, $log, $q, User,
      Notification, Priority) {

      /**
       * The current user
       */
      var currentUser = null;
      var currentPromise = null;

      /**
       * Resolve a current user.
       */
      function resolveCurrentUser() {
        // If we've got an in-flight promise, just return that and let
        // the consumers chain off of that.
        if (!!currentPromise) {
          return currentPromise;
        }

        // Construct a new resolution promise.
        var deferred = $q.defer();
        currentPromise = deferred.promise;

        // Make sure we have a logged-in session.
        resolveLoggedInSession().then(
          function () {
            // Now that we know we're logged in, do we have a
            // currentUser yet?
            if (!!currentUser) {
              deferred.resolve(currentUser);
            } else {
              // Ok, we have to load.
              User.get(
                {
                  id: AccessToken.getIdToken()
                },
                function (user) {
                  currentUser = user;
                  deferred.resolve(user);
                },
                function (error) {
                  currentUser = null;
                  deferred.reject(error);
                }
              );
            }
          },
          function (error) {
            currentUser = null;
            deferred.reject(error);
          }
        );

        // Chain a resolution that'll make the currentPromise clear itself.
        currentPromise.then(
          function () {
            currentPromise = null;
          },
          function () {
            currentPromise = null;
          }
        );

        return currentPromise;
      }

      /**
       * A promise that only resolves if we're currently logged in.
       */
      function resolveLoggedInSession() {
        var deferred = $q.defer();

        Session.resolveSessionState().then(
          function (sessionState) {

            if (sessionState === SessionState.LOGGED_IN) {
              deferred.resolve(sessionState);
            } else {
              deferred.reject(sessionState);
            }
          },
          function (error) {
            deferred.reject(error);
          }
        );

        return deferred.promise;
      }

      // Add event listeners.
      Notification.intercept(function (message) {
        switch (message.type) {
          case SessionState.LOGGED_IN:
          resolveCurrentUser();
          break;
          case SessionState.LOGGED_OUT:
          currentUser = null;
          break;
          default:
          break;
        }
      }, Priority.LAST);

      // Expose the methods for this service.
      return {

        /**
         * Resolves the current user with a promise.
         */
        resolve: function () {
          return resolveCurrentUser();
        }
      };
    }
  ]
);
