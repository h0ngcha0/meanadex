/**
 * An HTTP request interceptor that broadcasts response status codes to the
 * rest of the application as notifications. These events are broadcast before
 * the error response itself is passed back to the receiving closure, so please
 * keep that in mind as you base your application logic on it.
 *
 */
angular.module('services')
// Create an HTTP Error Broadcaster that intercepts requests and lets the
// rest of the application know about what happened.
  .factory('httpErrorBroadcaster', ['$q', '$rootScope', 'Notification', 'Severity',
  function ($q, $rootScope, Notification, Severity) {
    'use strict';

    function sendEvent(severity, response) {
      // Only send an event if a status is passed.
      if (!!response.status) {
        Notification.send('http', response.status, severity, response);
      }
    }

    return {
      /**
       * Handle a success response.
       */
      response: function (response) {
        if (!!response) {
          sendEvent(Severity.SUCCESS, response);
        }
        return response;
      },

      /**
       * Handle a fail response.
       */
      responseError: function (response) {
        if (!!response) {
          sendEvent(Severity.ERROR, response);
        }

        return $q.reject(response);
      }
    };
  }
  // Attach the HTTP interceptor.
]).config(['$httpProvider', function ($httpProvider) {
  'use strict';
  $httpProvider.interceptors.unshift('httpErrorBroadcaster');
}]);
