/**
 * Utility injector, injects the query parameters from the NON-hashbang URL as
 * $searchParams.
 */
angular.module('util').factory('$searchParams', ['$window', 'UrlUtil',
  function ($window, UrlUtil) {
    'use strict';

    var params = {};
    var search = $window.location.search;
    if (!!search) {
      if (search.charAt(0) === '?') {
        search = search.substr(1);
      }

      return UrlUtil.deserializeParameters(search);
    }
    return params;
  }
]);
