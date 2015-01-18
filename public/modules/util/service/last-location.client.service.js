/**
 * A service that keeps track of the last page we visited.
 */
angular.module('util')
  .factory('LastLocation', ['$rootScope', 'localStorageService', function ($rootScope, localStorageService) {
  'use strict';

  /**
   * The last detected length of the history
   */

  // When the location changes, store the new one. Since the $location
  // object changes too quickly, we instead extract the hash manually.
  function onLocationChange(event, toLocation) {
    var url = new URL(toLocation);
    var hash = url.hash || '#!/';
    var trimmed_hash = hash.slice(2);
    if (trimmed_hash.indexOf('/auth') === -1) {
      localStorageService.set('lastLocation', trimmed_hash);
    }

  }

  // The published API.
  return {

    /**
     * Get the recorded history path at the provided index.
     */
    get: function () {
      return localStorageService.get('lastLocation');
    },

    /**
     * Initialize this service.
     */
    _initialize: function () {
      // Register (and disconnect) our listener.
      $rootScope.$on('$destroy',
        $rootScope.$on('$locationChangeStart', onLocationChange)
      );
    }
  };
}]).run(['LastLocation', function (LastLocation) {
  'use strict';

  // Initialize this service.
  LastLocation._initialize();
}]);
