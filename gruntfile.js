'use strict';

var config = {
  livereload: {
    port: 35728
  }
};

module.exports = function(grunt) {
  // Unified Watch Object
  var watchFiles = {
    serverViews: ['app/views/**/*.*'],
    serverJS: ['gruntfile.js', 'app.js', 'config/**/*.js', 'app/**/*.js'],
    clientViews: ['src/modules/**/*.html'],
    clientJS: ['src/modules/**/*.js'],
    clientCSS: ['src/modules/**/*.css'],
    clientLESS: ['src/modules/**/*.less'],
    mochaTests: ['app/tests/**/*.js']
  };

  var dir = {
    source: 'src',
    output: 'public',
    bower:  'bower_components'
  };

  // Project Configuration
  grunt.initConfig({
    copy: {
      dist: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: dir.source,
            dest: dir.output,
            src: [
              '*.html',
              'robots.txt',
              'humans.txt',
            ]
          },
          {
            expand: true,
            dot: true,
            cwd: dir.bower + '/font-awesome',
            dest: dir.output,
            src: [
              'fonts/*.*'
            ]
          },
          {
            expand: true,
            dot: true,
            cwd: dir.bower + '/bootstrap',
            dest: dir.output,
            src: [
              'fonts/*.*'
            ]
          },
          {
            expand: true,
            cwd: dir.source,
            dest: dir.output,
            src: [
              'fonts/*.*'
            ]
          },
          {
            expand: true,
            dot: true,
            cwd: dir.bower + '/slick-carousel/slick',
            dest: dir.output + '/css',
            src: [
              'slick.css.map'
            ]
          }
        ]
      }
    },
    clean: {
      dist: {
        files: [
          {
            dot: true,
            src: [
              dir.output + '/*',
              '!' + dir.output + '/uploads/**'
            ]
          }
        ]
      }
    },
    useminPrepare: {
      html: [dir.source + '/index.html'],
      options: {
        flow: {
          steps: {
            'js': ['concat'],
            'css': ['concat']
          },
          post: []
        },
        dest: dir.output
      }
    },
    concat: {
      js: {
        src: [
          dir.source + '/config.js',
          dir.source + '/application.js',
          dir.source + '/modules/*/*.js',
          dir.source + '/modules/*/*[!tests]*/*.js'
        ],
        dest: dir.output + '/js/application.js'
      },
      css: {
        src: [
          dir.source + '/modules/**/css/*.css'
        ],
        dest: dir.output + '/css/application.css'
      }
    },
    html2js: {
      options: {
        module: 'templates',
        base: dir.source
      },
      main: {
        src: [dir.source + '/modules/**/*.html'],
        dest: dir.output + '/js/templates.js'
      }
    },
    imagemin: {
      dist: {
        files: [
          {
            expand: true,
            cwd: dir.source + '/images',
            src: '**/*.{png,jpg,jpeg,ico,gif}',
            dest: dir.output + '/images'
          }
        ]
      }
    },
    usemin: {
      html: [
        dir.output + '/index.html'
      ],
      css: [
        dir.output + '/css/**/*.css'
      ],
      options: {
        dirs: [dir.output]
      }
    },
    pkg: grunt.file.readJSON('package.json'),
    open: {
      server: {
        url: 'https://localhost:3000'
      }
    },
    watch: {
      serverViews: {
        files: watchFiles.serverViews
      },
      concatJS: {
        files: [
          dir.source + '/config.js',
          dir.source + '/application.js',
          dir.source + '/modules/*/*.js',
          dir.source + '/modules/*/*[!tests]*/*.js'
        ],
        tasks: ['concat:js']
      },
      concatCSS: {
        files: [
          dir.source + '/modules/**/css/*.css'
        ],
        tasks: ['concat:css']
      },
      less: {
        files: [
          watchFiles.clientLESS
        ],
        tasks: ['less', 'csslint', 'concat:css']
      },
      copy: {
        files: [
          dir.source + '/*.{txt}'
        ],
        tasks: ['copy:dist']
      },
      index: {
        files: [
          dir.source + '/index.html'
        ],
        tasks: ['compile']
      },
      templates: {
        files: [
          dir.source + '/modules/**/*.html'
        ],
        tasks: ['html2js']
      },
      jshint: {
        files: [
          watchFiles.clientJS,
          watchFiles.serverJS
        ],
        tasks: ['jshint']
      },
      livereload: {
        options: {
          livereload: {
            port: config.livereload.port,
            key: grunt.file.read('config/sslcerts/key.pem'),
            cert: grunt.file.read('config/sslcerts/cert.pem')
          }
        },
        files: [
          watchFiles.serverViews,
          watchFiles.serverJS,
          dir.output + '/**/*.*'
        ]
      }
    },
    jshint: {
      all: {
        src: watchFiles.clientJS.concat(watchFiles.serverJS),
        options: {
          jshintrc: true
        }
      }
    },
    csslint: {
      options: {
        csslintrc: '.csslintrc'
      },
      all: {
        src: watchFiles.clientCSS
      }
    },
    uglify: {
      options: {
        mangle: true
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: dir.output + '/js',
            src: '**/*.js',
            dest: dir.output + '/js'
          }
        ]
      }
    },
    cssmin: {
      minify: {
        expand: true,
        cwd: dir.output + '/css/',
        src: ['*.css'],
        dest: dir.output + '/css/'
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          removeCommentsFromCDATA: true,
          collapseWhitespace: false,
          collapseBooleanAttributes: false,
          removeAttributeQuotes: false,
          removeRedundantAttributes: false,
          useShortDoctype: false,
          removeEmptyAttributes: true,
          removeOptionalTags: true
        },
        files: [
          {
            expand: true,
            cwd: dir.output,
            src: ['index.html'],
            dest: dir.output
          }
        ]
      }
    },
    less: {
      dist: {
        files: [{
          expand: true,
          src: watchFiles.clientLESS,
          ext: '.css',
          rename: function(base, src) {
            return  src.replace('/less/', '/css/');
          }
        }]
      }
    },
    nodemon: {
      dev: {
        script: 'app.js',
        options: {
          nodeArgs: ['--debug'],
          ext: 'js,html',
          watch: watchFiles.serverViews.concat(watchFiles.serverJS)
        }
      }
    },
    'node-inspector': {
      custom: {
        options: {
          'web-port': 1337,
          'web-host': 'localhost',
          'debug-port': 5858,
          'save-live-edit': true,
          'no-preload': true,
          'stack-trace-limit': 50,
          'hidden': []
        }
      }
    },
    concurrent: {
      default: ['nodemon', 'serve'],
      production: ['nodemon', 'serve:dist'],
      debug: ['nodemon', 'serve', 'node-inspector'],
      options: {
        logConcurrentOutput: true
      }
    },
    env: {
      default: {
        NODE_ENV: 'development',
        SECURE: 'true'
      },
      test: {
        NODE_ENV: 'test',
        SECURE: 'true'
      },
      production: {
        NODE_ENV: 'production',
        SECURE: 'true'
      }
    },
    mochaTest: {
      src: watchFiles.mochaTests,
      options: {
        reporter: 'spec',
        require: 'app.js'
      }
    },
    karma: {
      unit: {
        configFile: 'karma.conf.js'
      }
    }
  });

  // Load NPM tasks
  require('load-grunt-tasks')(grunt);

  // Making grunt default to force in order not to break the project.
  grunt.option('force', !process.env.WERCKER || false);

  // A Task for populating test data into the database
  require('./populate-test-data')(grunt);

  // Default task(s).
  grunt.registerTask('default', ['env:default', 'concurrent:default']);

  // Debug task.
  grunt.registerTask('debug', ['env:default', 'concurrent:debug']);

  // Production task.
  grunt.registerTask('production', ['env:production', 'concurrent:production']);

  // Lint task(s).
  grunt.registerTask('lint', ['less', 'jshint', 'csslint']);

  /**
   * Compiles all of our sources.
   */
  grunt.registerTask('compile', [
    'lint',
    'useminPrepare',
    'concat',
    'imagemin',
    'html2js',
    'copy:dist',
    'usemin'
  ]);

  /**
   * Package built code into a release package.
   */
  grunt.registerTask('package', [
    'uglify',
    'cssmin',
    'htmlmin'
  ]);

  // Build task(s).
  grunt.registerTask('build', ['clean', 'compile', 'package']);

  /**
   * Development server - runs a build and sets up concurrent watchers that
   * will automatically lint, test, and refresh
   * the code when a change is detected.
   */
  grunt.registerTask('serve', [
    'clean',
    'compile',
    'open',
    'watch'
  ]);

  /**
   * This task performs a full build of our application, and then runs that
   * source in a local web server. It does no watching, it simply hosts the
   * files.
   */
  grunt.registerTask('serve:dist', [
    'clean',
    'compile',
    'package',
    'open'
  ]);

  /**
   * grunt test:unit
   *
   * This command will create a clean build against which our unit
   * tests will be run. For more information, please see
   * karma-unit.conf.js
   */
  grunt.registerTask('test:unit', [
    'clean',
    'compile',
    'useminPrepare',
    'concat',
    'karma:unit'
  ]);

  // Test task.
  grunt.registerTask('test', ['env:test', 'mochaTest', 'test:unit']);
};
