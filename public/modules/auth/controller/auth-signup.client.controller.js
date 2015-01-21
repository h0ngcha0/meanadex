'use strict';

angular.module('auth').controller('AuthSignupController', [
  '$scope', '$state', '$log', 'Oauth2', 'Session', '$window',
  'UrlUtil', 'LastLocation',
  function ($scope, $state, $log, Oauth2, Session, $window,
    UrlUtil, LastLocation) {
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

    $scope.signup = function() {
      var params = $scope.credentials || {};
      params.url = '/auth/signup';
      Oauth2.token(params)
        .then(
        function (token) {
          Session.updateSession(token)
            .then(function () {
            var nextPath = buildNextPath();
            $window.location.href =
            UrlUtil.buildApplicationUrl(nextPath);
            $window.location.reload();
          });
        },
        function (error) {
          Session.destroySession();
          $scope.error = error.error_description;
        }
      );
    };
  }
]);
