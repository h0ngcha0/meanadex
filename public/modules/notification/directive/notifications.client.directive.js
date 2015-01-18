/**
 * This directive is a notification list renderer with all the trimmings.
 * Errors broadcast throughout the system will be collected and displayed here.
 */
angular.module('notification').directive('notifications',
  function () {
    'use strict';

    return {
      restrict: 'E',
      templateUrl: 'modules/notification/view/notification.client.view.html',
      controller: 'NotificationsController'
    };
  }
);
