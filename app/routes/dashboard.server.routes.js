'use strict';

/**
 * Module dependencies.
 */
var dashboard = require('../../app/controllers/dashboard'),
    users = require('../../app/controllers/users');

module.exports = function (app) {
    app.route('/dashboard/total_income')
        .get(users.requiresLogin, dashboard.readTotalIncome);

    app.route('/dashboard/total_orders')
        .get(users.requiresLogin, dashboard.readTotalOrders);

    app.route('/dashboard/total_campaigns')
        .get(users.requiresLogin, dashboard.readTotalCampaigns);

    app.route('/dashboard/active_campaigns')
        .get(users.requiresLogin, dashboard.readActiveCampaigns);

    app.route('/dashboard/campaigns_created')
        .get(users.requiresLogin, dashboard.readCampaignsCreated);

    app.route('/dashboard/orders_created')
        .get(users.requiresLogin, dashboard.readOrdersCreated);
};
