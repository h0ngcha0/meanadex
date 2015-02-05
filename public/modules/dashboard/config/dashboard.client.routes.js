'use strict';

//Setting up route
angular.module('dashboard').config([
  '$stateProvider', '$urlRouterProvider', 'SessionResolver',
  'PermissionResolver',
  function($stateProvider, $urlRouterProvider, SessionResolver,
    PermissionResolver) {
    // Dashboard state routing
    $urlRouterProvider
      .when('/dashboard/front', '/dashboard/profile');
    $stateProvider.
      state('dashboard', {
        resolve: {
          isLoggedIn: SessionResolver.requireLoggedIn,
          currentUser: SessionResolver.requireCurrentUser
        },
        abstract: true,
        url: '/dashboard',
        templateUrl: 'modules/dashboard/views/dashboard.client.view.html',
        controller: 'DashboardController',
        ncyBreadcrumb: {
          label: 'Home'
        }
      }).
      state('dashboard.front', {
        url: '/front',
        views: {
          'dashboardPanel': {
            templateUrl: 'modules/dashboard/views/front.client.view.html',
            controller: 'DashboardController'
          }
        },
        ncyBreadcrumb: {
          label: 'Dashboard'
        }
      }).
      state('dashboard.profile', {
        url: '/profile',
        views: {
          'dashboardPanel': {
            templateUrl: 'modules/dashboard/views/profile.client.view.html',
            controller: 'SettingsController'
          }
        },
        ncyBreadcrumb: {
          label: 'Profile'
        }
      }).
      state('dashboard.tshirts', {
        url: '/tshirts',
        resolve: {
          isAdmin: PermissionResolver.requirePermission('admin', true)
        },
        views: {
          'dashboardPanel': {
            templateUrl: 'modules/tshirts/views/list-tshirts.client.view.html',
            controller: 'TshirtsController'
          }
        },
        ncyBreadcrumb: {
          label: 'Tshirts'
        }
      }).
      state('dashboard.tshirtCreate', {
        url: '/tshirts/create',
        resolve: {
          isAdmin: PermissionResolver.requirePermission('admin', true)
        },
        views: {
          'dashboardPanel': {
            templateUrl: 'modules/tshirts/views/create-tshirt.client.view.html',
            controller: 'TshirtsController'
          }
        },
        ncyBreadcrumb: {
          label: 'Create Tshirt'
        }
      }).
      state('dashboard.tshirtDetail', {
        url: '/tshirts/:id',
        resolve: {
          isAdmin: PermissionResolver.requirePermission('admin', true)
        },
        views: {
          'dashboardPanel': {
            templateUrl: 'modules/tshirts/views/view-tshirt.client.view.html',
            controller: 'TshirtsController'
          }
        },
        ncyBreadcrumb: {
          label: 'View Tshirt'
        }
      }).
      state('dashboard.campaigns', {
        url: '/campaigns',
        views: {
          'dashboardPanel': {
            templateUrl: 'modules/campaigns/views/list-campaigns.client.view.html',
            controller: 'CampaignsController'
          }
        },
        ncyBreadcrumb: {
          label: 'Campaigns'
        }
      }).
      state('dashboard.orders', {
        url: '/orders',
        views: {
          'dashboardPanel': {
            templateUrl: 'modules/orders/views/list-orders.client.view.html',
            controller: 'OrdersController'
          }
        },
        ncyBreadcrumb: {
          label: 'Orders'
        }
      }).
      state('dashboard.createImage', {
        url: '/images/create',
        resolve: {
          isAdmin: PermissionResolver.requirePermission('admin', true)
        },
        views: {
          'dashboardPanel': {
            templateUrl: 'modules/images/views/create-image.client.view.html',
            controller: 'ImagesController'
          }
        },
        ncyBreadcrumb: {
          label: 'Create Image'
        }
      }).
      state('dashboard.viewImage', {
        url: '/images/:id',
        resolve: {
          isAdmin: PermissionResolver.requirePermission('admin', true)
        },
        views: {
          'dashboardPanel': {
            templateUrl: 'modules/images/views/view-image.client.view.html',
            controller: 'ImagesController'
          }
        },
        ncyBreadcrumb: {
          label: 'View Image'
        }
      }).
      state('dashboard.images', {
        url: '/images',
        resolve: {
          isAdmin: PermissionResolver.requirePermission('admin', true)
        },
        views: {
          'dashboardPanel': {
            templateUrl: 'modules/images/views/list-images.client.view.html',
            controller: 'ImagesController'
          }
        },
        ncyBreadcrumb: {
          label: 'Images'
        }
      });
  }
]);
