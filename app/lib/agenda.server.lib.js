var Agenda = require('agenda'),
    fs = require('fs'),
    path = require('path');

var agenda = new Agenda(
  {
    db: {
      address: 'mongodb://localhost/meanadex',
      collection: 'agendaJobs'
    }
  }
);

var jobPath = './app/lib/jobs/';

var jobModules = fs.readdirSync(jobPath);

jobModules.forEach(function(jobModule) {
  require(path.resolve(jobPath + jobModule))(agenda);
})

if(jobModules.length) {
  agenda.start();
}

module.exports = agenda;
