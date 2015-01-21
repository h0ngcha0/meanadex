/**
 * An HTTP request interceptor that attaches an authorization to every HTTP
 * request, assuming it exists and isn't expired.
 */
angular.module('auth').factory('httpAuthorizationHeader', ['AccessToken',
  function (AccessToken) {
    'use strict';

    return {
      request: function (request) {

        // TODO: Only apply the token to requests to
        // theApiBase.
        var token = AccessToken.getAccessToken();
        var type = AccessToken.getTokenType();
        if (!!token) {
          request.headers.Authorization = type + ' ' + token;
        }
        return request;
      }
    };
    // Attach the HTTP interceptor.
  }
]).config(['$httpProvider', function ($httpProvider) {
  'use strict';

  $httpProvider.interceptors.push('httpAuthorizationHeader');
}]);
