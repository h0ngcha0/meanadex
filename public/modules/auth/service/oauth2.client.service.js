'use strict';

/**
 * Our Oauth2 token resource, which adheres to the Oauth2 specification
 */
angular.module('auth').factory('Oauth2',
  [
    '$location', '$window', '$log', '$http', '$q',
    'theApiBase', 'localStorageService', 'UrlUtil',
    function ($location, $window, $log, $http, $q,
      theApiBase, localStorageService, UrlUtil) {

      var authorizeUrl = theApiBase + '/oauth';
      var tokenUrl = theApiBase + '/oauth2/token';

      return {
        /**
         * Asks the OAuth endpoint for an authorization token given
         * the passed parameters.
         */
        authorize: function (service, state) {
          var url = authorizeUrl + '/' + service;
          if (state) {
            var oauthParams = {
              state: state
            };
            url += '?' + UrlUtil.serializeParameters(oauthParams);
          }

          $window.location.href = url;
        },

        /**
         * Asks our Oauth2 endpoint to convert an password or a
         * refresh token to an access token.
         */
        token: function (params) {
          var deferred = $q.defer();
          var grant_type = params.grant_type || 'password';
          var username = params.username;
          var password = params.password;
          var refreshToken = params.refresh_token;
          var code = params.code;

          var tokenParams = {
            grant_type: grant_type,
            client_id: 'meanadex',
            client_secret: 'meanadex'
          };

          var url;

          if (grant_type === 'password') {
            tokenParams.username = username;
            tokenParams.password = password;
            url = params.url;
          } else if (grant_type === 'authorization_code') {
            tokenParams.code = code;
            url = tokenUrl;
          } else {
            tokenParams.refresh_token = refreshToken;
            url = tokenUrl;
          }


          $http({method: 'POST', url: url, data: tokenParams})
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
                error_description: response.data.message
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
