'use strict';

//Images service used to communicate Images REST endpoints
angular.module('images').factory('LocalImages', [
  function(DS) {
    return DS.defineResource({
      name: 'local-image',
      defaultAdaptor: 'DSLocalForageAdapter'
    });
  }
]);
