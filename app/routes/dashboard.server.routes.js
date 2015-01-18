'use strict';

/**
 * Module dependencies.
 */
var dashboard = require('../../app/controllers/dashboard'),
    oauth2 = require('../../app/controllers/oauth2');

module.exports = function (app) {
    app.route('/dashboard/total_income')
        .get(oauth2.authorise, dashboard.readTotalIncome);

    app.route('/dashboard/total_orders')
        .get(oauth2.authorise, dashboard.readTotalOrders);

    app.route('/dashboard/total_campaigns')
        .get(oauth2.authorise, dashboard.readTotalCampaigns);

    app.route('/dashboard/active_campaigns')
        .get(oauth2.authorise, dashboard.readActiveCampaigns);

    app.route('/dashboard/income_created')
        .get(oauth2.authorise, dashboard.readIncomeCreated);

    app.route('/dashboard/campaigns_created')
        .get(oauth2.authorise, dashboard.readCampaignsCreated);

    app.route('/dashboard/orders_created')
        .get(oauth2.authorise, dashboard.readOrdersCreated);
};
