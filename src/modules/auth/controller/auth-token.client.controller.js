'use strict';

/*
 * This controller is responsible for getting an access_token and
 * a refresh token having an authorization_code.
 *
 */
angular.module('auth').controller('AuthTokenController',
  [
    '$state', '$log', 'Oauth2', 'Session', '$searchParams', '$window',
    'UrlUtil', 'LastLocation',
    function ($state, $log, Oauth2, Session, $searchParams, $window, UrlUtil,
      LastLocation) {

      // First, check for the edge case where the API returns an error code
      // back to us. This should only happen when it fails to properly parse
      // our redirect_uri and thus just sends the error back to referrer, but
      // we should still catch it.
      if (!!$searchParams.error) {
        $log.debug('Error received, redirecting to auth.error.');
        $state.go('auth.error', $searchParams);
        return;
      }

      // Validate any previously stored redirect path
      function buildNextPath() {

        // First, do we have a stored last location?
        var location = LastLocation.get();

        // Sanity check on the location, we don't want to bounce straight
        // back into auth.
        if (location.indexOf('/auth') > -1) {
          location = '/';
        }

        return location;
      }

      if (Session.isLoggedIn()) {
        var nextPath = buildNextPath();
        $window.location.href =
        UrlUtil.buildApplicationUrl(nextPath);
        return;
      }

      // Looks like there's no error, so let's see if we can resolve a token.
      // TODO: Finish implementing.
      var params = $searchParams;
      params.grant_type = 'authorization_code';
      Oauth2.token(params)
        .then(
        function (token) {
          Session.updateSession(token)
            .then(function () {
            var nextPath = buildNextPath();
            $window.location.href =
            UrlUtil.buildApplicationUrl(nextPath);
          });
        },
        function (error) {
          Session.destroySession();
          $state.go('auth.error', error);
        }
      );
    }
  ]
);
