/**
 * This criteria resolver may be injected by individual resources that accept a
 * plain text search parameter.
 */
angular.module('services').factory('Text', ['Criteria', '$q',
  function (Criteria, $q) {
    'use strict';

    /**
     * Return a text search parameter constructed from the passed search
     * string.
     */
    return {
      criteriaResolver: function (searchString) {
        var deferred = $q.defer();

        deferred.resolve([Criteria.create('Text', searchString)]);

        return deferred.promise;
      }
    };
  }
]);
