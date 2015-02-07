/**
 * Permission provider, which hides particular controls based on whether the
 * passed permission flag has been set.
 */
angular.module('util').directive('permission', ['$log', 'PermissionManager',
  function ($log, PermissionManager) {
    'use strict';

    return {
      restrict: 'A',
      link: function ($scope, element, attrs) {
        // Start by hiding it.
        element.hide();

        var permName = attrs.permission;
        var permValue = attrs.permissionValue || true;

        PermissionManager.listen($scope, permName,
          function (actualValue) {

            if (!!actualValue &&
              actualValue.toString() === permValue.toString()) {
              element.show();
            } else {
              element.hide();
            }
          }
        );
      }
    };
  }
]);
