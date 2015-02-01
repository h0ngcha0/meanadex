'use strict';
/**
 * Session Modal service, which provides us with some session/auth related
 * modals.
 */
angular.module('auth')
  .factory('SessionModalService', ['$modal', function ($modal) {
  return {

    /**
     * Show a modal that kindly tells our user that they should
     * log in first.
     */
    showLoginRequiredModal: function () {
      var modalInstance = $modal(
        {
          animation: 'am-fade-and-scale',
          placement: 'center',
          template: 'modules/auth/view/modal/login-required.client.view.html'
        }
      );

      // Return the modal's promise.
      return modalInstance.result;
    }
  };
}]);
