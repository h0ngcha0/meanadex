'use strict';

// Setting up route
angular.module('users').config([
  '$stateProvider', '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
      .when('/user', '/user/campaigns');

    // Users state routing
    $stateProvider.
      state('user', {
        url: '/user',
        templateUrl: 'modules/users/views/user.client.view.html',
        controller: 'UserController'
      }).
      state('user.profile', {
        url: '/settings/profile',
        views: {
          'userPanel': {
            templateUrl: 'modules/users/views/settings/edit-profile.client.view.html',
            controller: 'SettingsController'
          }
        }
      }).
      state('user.password', {
        url: '/settings/password',
        views: {
          'userPanel': {
            templateUrl: 'modules/users/views/settings/change-password.client.view.html',
            controller: 'SettingsController'
          }
        }
      }).
      state('user.accounts', {
        url: '/settings/accounts',
        views: {
          'userPanel': {
            templateUrl: 'modules/users/views/settings/social-accounts.client.view.html',
            controller: 'SettingsController'
          }
        }
      }).
      state('user.signup', {
        url: '/signup',
        views: {
          'userPanel': {
            templateUrl: 'modules/users/views/authentication/signup.client.view.html',
            controller: 'AuthenticationController'
          }
        }
      }).
      state('user.signin', {
        url: '/signin',
        views: {
          'userPanel': {
            templateUrl: 'modules/users/views/authentication/signin.client.view.html',
            controller: 'AuthenticationController'
          }
        }
      }).
      state('user.forgot', {
        url: '/password/forgot',
        views: {
          'userPanel': {
            templateUrl: 'modules/users/views/password/forgot-password.client.view.html',
            controller: 'PasswordController'
          }
        }
      }).
      state('user.reset-invalid', {
        url: '/password/reset/invalid',
        views: {
          'userPanel': {
            templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
          }
        }
      }).
      state('user.reset-success', {
        url: '/password/reset/success',
        views: {
          'userPanel': {
            templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
          }
        }
      }).
      state('user.reset', {
        url: '/password/reset/:token',
        views: {
          'userPanel': {
            templateUrl: 'modules/users/views/password/reset-password.client.view.html'
          }
        }
      }).
      state('user.orders', {
        url: '/orders',
        views: {
          'userPanel': {
            templateUrl: 'modules/orders/views/list-orders.client.view.html',
            controller: 'OrdersController'
          }
        }
      }).
      state('user.campaigns', {
        url: '/campaigns',
        views: {
          'userPanel': {
            templateUrl: 'modules/campaigns/views/list-campaigns.client.view.html',
            controller: 'CampaignsController'
          }
        }
      });
  }
]);
