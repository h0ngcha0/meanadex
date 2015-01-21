'use strict';

/**
 * Our OpenID token resource, which adheres to the OpenID connect specification
 * found here; http://openid.net/specs/openid-connect-basic-1_0.html
 */
angular.module('auth').factory('OpenId',
  [
    '$location', '$window', '$log', '$http', '$q', 'StringUtil', 'UrlUtil',
    'theApiBase', 'localStorageService',
    function ($location, $window, $log, $http, $q, StringUtil, UrlUtil,
      theApiBase, localStorageService) {

      var storageKey = 'openid_authorize_state';
      var authorizeUrl = theApiBase + '/openid/authorize';
      var tokenUrl = theApiBase + '/openid/token';
      var redirectUri = UrlUtil.buildApplicationUrl('/auth/token');
      var clientId = $location.host();

      return {
        /**
         * Asks the OAuth endpoint for an authorization token given
         * the passed parameters.
         */
        authorize: function () {
          // Create and store a random state parameter.
          var state = StringUtil.randomAlphaNumeric(20);
          localStorageService.set(storageKey, state);

          var openIdParams = {
            response_type: 'code',
            client_id: clientId,
            redirect_uri: redirectUri,
            scope: 'user',
            state: state
          };

          $window.location.href = authorizeUrl + '?' +
                                  UrlUtil.serializeParameters(openIdParams);
        },

        /**
         * Asks our OpenID endpoint to convert an authorization code or a
         * refresh token to an access token.
         */
        token: function (params) {
          var deferred = $q.defer();
          var grant_type = params.grant_type || 'authorization_code';
          var authorizationCode = params.code;
          var refreshToken = params.refresh_token;

          var tokenParams = {
            grant_type: grant_type
          };

          if (grant_type === 'authorization_code') {
            tokenParams.code = authorizationCode;
          } else {
            tokenParams.refresh_token = refreshToken;
          }

          var url = tokenUrl + '?' +
                    UrlUtil.serializeParameters(tokenParams);

          $http({method: 'POST', url: url})
            .then(function (response) {
            $log.debug('Token creation succeeded.');
            // Extract the data
            var data = response.data;

            // Derive an issue date, from the Date header if
            // possible.
            var dateHeader = response.headers('Date');
            if (!dateHeader) {
              data.issue_date = Math.floor(Date.now() / 1000);
            } else {
              data.issue_date = Math.floor(
                new Date(dateHeader) / 1000
              );
            }

            deferred.resolve(data);
          },
          function (response) {
            $log.debug('Token creation failed.');

            // Construct a conformant error response.
            var error = response.data;
            if (!error.hasOwnProperty('error')) {
              error = {
                error: response.status,
                error_description: response.data
              };
            }
            deferred.reject(error);
          });

          return deferred.promise;
        }
      };
    }
  ]
);
