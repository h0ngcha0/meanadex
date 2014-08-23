'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', [
  '$window',
  function($window) {
    var _this = this;

    _this._data = {
      user: $window.user
    };

    return _this._data;
  }
]);
