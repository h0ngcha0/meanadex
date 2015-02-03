'use strict';

var Agenda = require('agenda'),
    fs = require('fs'),
    config = require('../../config/config'),
    path = require('path');

var agenda = new Agenda(
  {
    db: {
      address: config.db,
      collection: 'agendaJobs'
    }
  }
);

var jobPath = './app/lib/jobs/';

var jobModules = fs.readdirSync(jobPath);

jobModules.forEach(function(jobModule) {
  require(path.resolve(jobPath + jobModule))(agenda);
});

if(jobModules.length) {
  agenda.start();
}

module.exports = agenda;
