/**
 * An HTTP request interceptor that pays attention to POST/PUT/DELETE operations
 * on specific resources, and replaces the local cached data with the resulting
 * value.
 */
angular.module('services').factory('httpCacheHandler', ['$q', '$cacheFactory',
  function ($q, $cacheFactory) {
    'use strict';

    var $httpDefaultCache = $cacheFactory.get('$http');

    return {
      /**
       * Handle a success response.
       */
      response: function (response) {
        var method = response.config.method;
        var url = response.config.url;
        var obj = response.data;

        // Ignore GET methods.
        switch (method) {
          case 'POST':
          if (obj.hasOwnProperty('id')) {
            $httpDefaultCache.put(url + '/' + obj.id, obj);
          }
          break;
          case 'PUT':
          $httpDefaultCache.put(url, obj);
          break;
          case 'DELETE':
          $httpDefaultCache.remove(url);
          break;
          default:
          break;
        }

        return response;
      }
    };
  }
  // Attach the HTTP interceptor.
]).config(['$httpProvider', function ($httpProvider) {
  'use strict';
  $httpProvider.interceptors.push('httpCacheHandler');
}]);
