'use strict';

// Setting up route
angular.module('core').config([
  '$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/landing');

    // Home state routing
    $stateProvider.
      state('index', {
        url: '/landing'
      });
  }
]).run(['$log', '$rootScope', '$state', function ($log, $rootScope, $state) {

  // Listen to changes on the root scope. If it's an error in the state
  // changes (i.e. a 404) take the user back to the index.
  $rootScope.$on('$stateChangeError',
    function () {
      $state.go('index');
    }
  );
}]);
