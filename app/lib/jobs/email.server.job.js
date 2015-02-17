'use strict';

var nodemailer = require('nodemailer'),
    logger = require('../logger.server.lib.js');

module.exports = function(agenda, config) {
  var generator = require('xoauth2').createXOAuth2Generator({
    user: config.mailer.from,
    clientId: config.google.clientID,
    clientSecret: config.google.clientSecret,
    refreshToken: config.google.refreshToken
  });

  var smtpTransport = nodemailer.createTransport({
    service: config.mailer.options.service,
    auth: {
      xoauth2: generator
    }
  });

  agenda.define('send email', {priority: 'high'}, function(job, done) {
    logger.info('send email job started');
    var data = job.attrs.data;
    var mailOptions = {
      to: data.email,
      from: config.mailer.from,
      subject: data.subject,
      html: data.emailHTML
    };

    smtpTransport.sendMail(mailOptions, function(err) {
      if (err) {
        logger.error('failed to send email: ', err);
      }
      done();
    });
  });
};
