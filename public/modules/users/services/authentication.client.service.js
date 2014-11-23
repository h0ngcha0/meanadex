'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
  '$window', '$location',
  function($window, $location) {
    var _this = this;

    _this._data = {
      user: $window.user,
      ensureAuthenticated: function() {
        if(!$window.user) {
          $location.path('signin');
        }
      }
    };

    return _this._data;
  }
]);
