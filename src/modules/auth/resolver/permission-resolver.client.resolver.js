/**
 * The permission resolver allows us to require certain permissions for specific
 * UI routes.
 */
angular.module('auth').constant('PermissionResolver',
  {
    /**
     * Rejects the route if the current user does not have the required
     * permission.
     */
    requirePermission: function (permName, requiredValue) {
      'use strict';

      return ['$q', '$log', 'PermissionManager',
        function ($q, $log, PermissionManager) {
          var deferred = $q.defer();

          PermissionManager.resolve(permName).then(
            function (value) {
              $log.debug('permission:', permName, requiredValue,
                value);
              if (value === requiredValue) {
                deferred.resolve(value);
              } else {
                deferred.reject(value);
              }
            },
            function (error) {
              $log.debug('permission:', error);
              deferred.reject(error);
            }
          );

          return deferred.promise;
        }
      ];

    },

    /**
     * Resolves the value of the provided permission.
     */
    resolvePermission: function (permName) {
      'use strict';

      return ['$q', '$log', 'PermissionManager',
        function ($q, $log, PermissionManager) {
          var deferred = $q.defer();

          PermissionManager.resolve(permName).then(
            function (value) {
              deferred.resolve(value);
            },
            function () {
              deferred.resolve(false);
            }
          );

          return deferred.promise;
        }
      ];

    }
  }
);
