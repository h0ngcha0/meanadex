'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName,
  ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(
  [ '$locationProvider',
    function($locationProvider) {
      $locationProvider.hashPrefix('!');
    }
  ]
);

// Restrict animation to elements
angular.module(ApplicationConfiguration.applicationModuleName).config(
  ['$animateProvider',
    function($animateProvider){
      // restrict animation to elements with the css class with a regexp.
      $animateProvider.classNameFilter(/^((?!(navbar-fixed-top)).)*$/);
    }
  ]
);

// Configure local storage service
angular.module(ApplicationConfiguration.applicationModuleName).config(
  ['localStorageServiceProvider',
    function(localStorageServiceProvider){
      localStorageServiceProvider
        .setPrefix(ApplicationConfiguration.applicationModuleName);
    }
  ]
);

// Configure monospaced.elastic
angular.module(ApplicationConfiguration.applicationModuleName).config(
  ['msdElasticConfig',
    function(msdElasticConfig){
      // Globally set an additional amount of whitespace to the end of our
      // textarea elastic resizing.
      msdElasticConfig.append = '\n';
    }
  ]
);

// Configure angular-breadcrumb
angular.module(ApplicationConfiguration.applicationModuleName).config(
  ['$breadcrumbProvider',
    function($breadcrumbProvider){
      $breadcrumbProvider.setOptions({
        includeAbstract: true
      });
    }
  ]
);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_') window.location.hash = '#!';

  //Then init the app
  angular.bootstrap( document,
    [ApplicationConfiguration.applicationModuleName]);
});
