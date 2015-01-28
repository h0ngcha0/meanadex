/**
 * Utility injector, injects the query parameters from the NON-hashbang URL as
 * $searchParams.
 */
angular.module('util').factory('$searchParams', ['$window', 'UrlUtil', '$location',
  function ($window, UrlUtil, $location) {
    'use strict';

    var search = $window.location.search;
    if (!!search) {
      if (search.charAt(0) === '?') {
        search = search.substr(1);
      }

      return UrlUtil.deserializeParameters(search);
    }
    else {
      return $location.search();
    }
  }
]);
