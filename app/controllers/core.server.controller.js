'use strict';

/**
 * Module dependencies.
 */
exports.index = function(req, res) {
  res.render('index', {
    user: req.user || null
  });
};

exports.dashboard = function(req, res) {
  res.render('dashboard', {
    user: req.user
  });
};
