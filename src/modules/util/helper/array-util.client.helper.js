/**
 * Array utilities.
 */
angular.module('util').factory('ArrayUtil',
  function () {
    'use strict';

    return {

      /**
       * Performs a logical intersection on two arrays. Given A, and B,
       * returns A∩B, the set of all objects that are in both A and B.
       *
       * @param A
       * @param B
       */
      intersection: function (A, B) {
        var result = [];
        A.forEach(function (item) {
          if (B.indexOf(item) > -1) {
            result.push(item);
          }
        });

        return result;
      },

      /**
       * Performs a logical difference operation on the two
       * arrays. Given sets U and A it will return U\A, the set of all
       * members of U that are not members of A.
       *
       * @param U
       * @param A
       */
      difference: function (U, A) {
        var result = [];
        U.forEach(function (item) {
          if (A.indexOf(item) === -1) {
            result.push(item);
          }
        });

        return result;
      }
    };
  }
);
