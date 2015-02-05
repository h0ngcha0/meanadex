'use strict';

/**
 * Module dependencies.
 */
var dashboard = require('../../app/controllers/dashboard'),
    oauth2 = require('../../app/controllers/oauth2');

module.exports = function (app) {
    app.route('/dashboard/totalIncome')
        .get(oauth2.authorise, dashboard.readTotalIncome);

    app.route('/dashboard/totalOrders')
        .get(oauth2.authorise, dashboard.readTotalOrders);

    app.route('/dashboard/totalCampaigns')
        .get(oauth2.authorise, dashboard.readTotalCampaigns);

    app.route('/dashboard/activeCampaigns')
        .get(oauth2.authorise, dashboard.readActiveCampaigns);

    app.route('/dashboard/incomeCreated')
        .get(oauth2.authorise, dashboard.readIncomeCreated);

    app.route('/dashboard/campaignsCreated')
        .get(oauth2.authorise, dashboard.readCampaignsCreated);

    app.route('/dashboard/ordersCreated')
        .get(oauth2.authorise, dashboard.readOrdersCreated);
};
