/**
 * This module contains our authentication and authorization logic.
 */
ApplicationConfiguration.registerModule('auth',
  ['services', 'ui.router', 'util', 'LocalStorageModule']);

angular.module('auth').config(['$stateProvider', 'SessionResolver',
  function ($stateProvider, SessionResolver) {
    'use strict';

    // Declare the states for this module.
    $stateProvider.state('auth', {
      abstract: true,
      template: '<div ui-view></div>',
      url: '/auth'
    }).state('auth.authorize', {
      url: '/authorize?service&error&error_description',
      templateUrl: 'modules/auth/view/busy.client.view.html',
      controller: 'AuthAuthorizeController',
      resolve: {
        isLoggedOut: SessionResolver.requireLoggedOut
      }
    }).state('auth.connect', {
      url: '/connect?service&error&error_description',
      templateUrl: 'modules/auth/view/busy.client.view.html',
      controller: 'AuthConnectController',
      resolve: {
        isLoggedIn: SessionResolver.requireLoggedIn,
        currentUser: SessionResolver.requireCurrentUser
      }
    }).state('auth.signin', {
      url: '/signin',
      templateUrl: 'modules/auth/view/signin.client.view.html',
      controller: 'AuthSigninController',
      resolve: {
        isLoggedOut: SessionResolver.requireLoggedOut
      }
    }).state('auth.signup', {
      url: '/signup',
      templateUrl: 'modules/auth/view/signup.client.view.html',
      controller: 'AuthSignupController',
      resolve: {
        isLoggedOut: SessionResolver.requireLoggedOut
      }
    }).state('auth.deauthorize', {
      url: '/deauthorize',
      templateUrl: 'modules/auth/view/busy.client.view.html',
      controller: 'AuthDeauthorizeController',
      resolve: {
        isLoggedIn: SessionResolver.requireLoggedIn
      }
    }).state('auth.token', {
      url: '/token?code&state&error&error_description',
      templateUrl: 'modules/auth/view/busy.client.view.html',
      controller: 'AuthTokenController',
      resolve: {
        isLoggedOut: SessionResolver.requireLoggedOut
      }
    }).state('auth.error', {
      url: '/error?error&error_description',
      templateUrl: 'modules/auth/view/error.client.view.html',
      controller: 'AuthErrorController'
    });
  }
]).run(['$rootScope', 'SessionState', 'Session', 'PermissionManager',
  'RefreshManager', 'Notification', 'Priority',
  function ($rootScope, SessionState, Session, PermissionManager,
    RefreshManager, Notification, Priority) {
    'use strict';

    // Initialize our permission manager.
    PermissionManager.initialize();

    // Always record the logged in state on the root scope.
    Notification.intercept(function (message) {
      switch (message.type) {
        case SessionState.LOGGED_IN:
        $rootScope.isLoggedIn = true;
        break;
        case SessionState.LOGGED_OUT:
        $rootScope.isLoggedIn = false;
        break;
        default:
        break;
      }
    }, Priority.LAST);

    RefreshManager.scheduleRefresh();
  }
]);
