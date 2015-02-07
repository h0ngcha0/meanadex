'use strict';

ApplicationConfiguration.registerModule('util',
  ['ui.router', 'LocalStorageModule']);

angular.module('util').run(function () {
  angular.element.prototype.hide = function () {
    this.addClass('ng-hide');
  };

  angular.element.prototype.show = function () {
    this.removeClass('ng-hide');
  };
});
