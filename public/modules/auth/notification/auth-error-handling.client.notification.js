angular.module('auth').run([
  '$log', '$modal', 'Notification', 'RefreshManager', 'Session', 'Priority',
  function($log, $modal, Notification, RefreshManager, Session, Priority) {
    'use strict';

    function handle_401() {
      RefreshManager.tryRefresh().then(function () {
        $log.info('Token refreshed on 401');
      }, function () {
        $log.info('Could not refresh token. Destroying session');
        Session.destroySession();
      });
    }

    function handle_403() {
      var modalInstance = $modal.open({
        templateUrl: 'modules/auth/view' +
        '/modal/superuser-required.client.view.html',
        controller: function($modalInstance, $scope) {
          $scope.close = function () {
            $modalInstance.dismiss('cancel');
          };
        }
      });
      return modalInstance.result;
    }


    // We're using -1 as the priority, to ensure that this is
    // intercepted before anything else happens.
    Notification.intercept(function (message) {
      if (message.type === 'http') {
        if (message.message === 401) {
          // An unauthorized error. Refreshing the access token
          // might help.
          handle_401();
        }

        if (message.message === 403) {
          // Forbidden error. A user should be warned tha he is
          // doing something wrong.
          handle_403();
        }

        return true; // Stop processing this notifications.
      }
    }, Priority.BEFORE);

  }
]);
