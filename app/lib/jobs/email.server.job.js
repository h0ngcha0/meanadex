'use strict';
var config = require('../../../config/config'),
    nodemailer = require('nodemailer');

module.exports = function(agenda) {
  agenda.define('send email', {priority: 'high'}, function(job, done) {
    var data = job.attrs.data;

    var smtpTransport = nodemailer.createTransport(config.mailer.options);
    var mailOptions = {
      to: data.email,
      from: config.mailer.from,
      subject: data.subject,
      html: data.emailHTML
    };

    smtpTransport.sendMail(mailOptions, function(err) {
      done();
    });
  });
};
