'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    OAuthClient = mongoose.model('OAuthClient');

var authorizedClientIds = [
  'mootee-dashboard',
  'mootee-android',
  'mootee-ios',
  'mootee'
];

var clients = function() {
  return authorizedClientIds.map(function(clientId) {
    return {
      clientId: clientId,
      clientSecret: clientId
    };
  });
};

module.exports =  function() {
  clients().forEach(function(client) {
    OAuthClient.findOne({
      clientId: client.clientId,
      clientSecret: client.clientSecret
    }, function(err, doc) {
      if(err) {
        console.error(err);
        return;
      }
      if(doc) {
        return;
      }
      var oAuthClient = new OAuthClient(client);
      oAuthClient.save(function(err) {
        if(err) {
          console.error(err);
        }
      });
    });
  });
};
