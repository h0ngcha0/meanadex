'use strict';

//Setting up route
angular.module('designer').config([
  '$stateProvider', 'theApiBase',
  function($stateProvider, theApiBase) {
    // Designer state routing
    $stateProvider.
    state('designer', {
      url: '/designer',
      resolve: {
        allTshirts: [
          '$http',
          function($http) {
            return $http.get(theApiBase + '/tshirts').then(
              function (resp) {
                return resp.data;
              });
          }
        ]
      },
      templateUrl: 'modules/designer/views/designer.client.view.html',
      controller: 'DesignerController'
    });
  }
]);
