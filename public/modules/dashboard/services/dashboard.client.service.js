'use strict';

// Dashboard service used for communicating with the dashboard REST endpoint
angular.module('dashboard').factory('Dashboard', ['$resource',
    function($resource) {
        return {
            totalIncome: $resource(
                'dashboard/total_income',
                {},
                {
                    query: {method: 'GET', params: {}, isArray: false}
                }
            ),
            totalOrders: $resource(
                'dashboard/total_orders',
                {},
                {
                    query: {method: 'GET', params: {}, isArray: false}
                }
            ),
            totalCampaigns: $resource(
                'dashboard/total_campaigns',
                {},
                {
                    query: {method: 'GET', params: {}, isArray: false}
                }
            ),
            activeCampaigns: $resource(
                'dashboard/active_campaigns',
                {},
                {
                    query: {method: 'GET', params: {}, isArray: false}
                }
            ),
            incomeCreated: $resource(
                'dashboard/income_created',
                {},
                {
                    query: {method: 'GET', params: {}, isArray: false}
                }
            ),
            campaignsCreated: $resource(
                'dashboard/campaigns_created',
                {},
                {
                    query: {method: 'GET', params: {}, isArray: false}
                }
            ),
            ordersCreated: $resource(
                'dashboard/orders_created',
                {},
                {
                    query: {method: 'GET', params: {}, isArray: false}
                }
            )
        };
    }
]);
