'use strict';

angular.module('core').factory('ENV', ['UrlUtil', function(UrlUtil) {
  return {
    stripeImage: UrlUtil.getFullUrlPrefix() + '/images/brand/favicon.ico',
    stripePublicKey: 'pk_test_WMSaxecz5HSTGZxlFbuxdF7B'
  };
}]);
