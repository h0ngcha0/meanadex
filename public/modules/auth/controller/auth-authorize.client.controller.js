/*
 * This controller is responsible for getting an authorization code
 * having a state and an openid.
 *
 */

angular.module('auth').controller('AuthAuthorizeController', [
  '$stateParams', '$state', '$log', 'OpenId', '$window', 'LastLocation',
  'localStorageService',
  function ($stateParams, $state, $log, OpenId, $window, LastLocation,
    localStorageService) {
    'use strict';

    // First, check for the edge case where the API returns an error code
    // back to us. This should only happen when it fails to properly parse
    // our redirect_uri and thus just sends the error back to referrer, but
    // we should still catch it.
    if (!!$stateParams.error) {
      $log.debug('Error received, redirecting to auth.error.');
      $state.go('auth.error', $stateParams);
      return;
    }

    // Store the last path...
    localStorageService.set('lastPath', LastLocation.get());

    // We're not an error, let's fire the authorization.
    OpenId.authorize();
  }
]);
