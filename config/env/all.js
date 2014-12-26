'use strict';

module.exports = {
  app: {
    title: 'meanadex',
    description: 'Meanadex is Monadex dressed up in the fancy cloak of MEAN stack',
    keywords: 'tshirt, crowd sourcing, mean, lambda'
  },
  port: process.env.PORT || 3000,
  httpsPort: process.env.PORT || 4000,
  templateEngine: 'swig',
  sessionSecret: 'MEAN',
  sessionCollection: 'sessions',
  html5shiv: 'public/lib/html5shiv/dist/html5shiv.js',
  assets: {
    lib: {
      css: [
        'public/lib/bootstrap/dist/css/bootstrap.css',
        'public/lib/bootstrap/dist/css/bootstrap-theme.css',
        'public/lib/font-awesome/css/font-awesome.css',
        'public/lib/angular-bootstrap-colorpicker/css/colorpicker.css',
        'public/lib/ng-table/ng-table.css',
        'public/lib/nvd3/nv.d3.css',
        'public/lib/angular-rangeslider/angular.rangeSlider.css'
      ],
      js: [
        'public/lib/jquery/jquery.js',
        'public/lib/underscore/underscore.js',
        'public/lib/async/lib/async.js',
        'https://checkout.stripe.com/checkout.js',
        'public/lib/angular/angular.js',
        'public/lib/angular-resource/angular-resource.js',
        'public/lib/angular-cookies/angular-cookies.js',
        'public/lib/angular-animate/angular-animate.js',
        'public/lib/angular-touch/angular-touch.js',
        'public/lib/angular-sanitize/angular-sanitize.js',
        'public/lib/angular-ui-router/release/angular-ui-router.js',
        'public/lib/angular-ui-utils/ui-utils.js',
        'public/lib/angular-bootstrap/ui-bootstrap-tpls.js',
        'public/lib/fabric/dist/fabric.js',
        'public/lib/bootstrap/dist/js/bootstrap.js',
        'public/lib/textAngular/dist/textAngular-sanitize.min.js',
        'public/lib/textAngular/dist/textAngular.min.js',
        'public/lib/moment/moment.js',
        'public/lib/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js',
        'public/lib/angular-rangeslider/angular.rangeSlider.js',
        'public/lib/angular-local-storage/angular-local-storage.js',
        'public/lib/ng-table/ng-table.js',
        'public/lib/angular-data/dist/angular-data.js',
        'public/lib/angular-timer/dist/angular-timer.js',
        'public/lib/angular-file-upload/angular-file-upload.js',
        'public/lib/d3/d3.js',
        'public/lib/nvd3/nv.d3.js',
        'public/lib/angularjs-nvd3-directives/dist/angularjs-nvd3-directives.js',
        'public/lib/bootstrap-autohidingnavbar/dist/jquery.bootstrap-autohidingnavbar.js'
      ]
    },
    css: [
      'public/modules/**/css/*.css'
    ],
    less: [
      'public/modules/**/less/*.less'
    ],
    sass: [
      'public/modules/**/scss/*.scss'
    ],
    js: [
      'public/config.js',
      'public/application.js',
      'public/modules/*/*.js',
      'public/modules/*/*[!tests]*/*.js'
    ],
    tests: [
      'public/lib/angular-mocks/angular-mocks.js',
      'public/modules/*/tests/*.js'
    ]
  }
};
