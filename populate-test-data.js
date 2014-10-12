'use strict';

/**
 * Module dependencies.
 */
var server = require('./server');

module.exports = function(grunt) {
  grunt.task.registerTask(
    'populateTestData',
    'Task that populats test data into the database.',
    function() {
      console.log('populating test data..');
    }
  );
};
