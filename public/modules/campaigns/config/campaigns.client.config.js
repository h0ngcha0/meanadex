'use strict';

// Configuring the Articles module
angular.module('campaigns').run([
  'Menus',
  function(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'My Campaigns', 'campaigns', 'item');
  }
]);
