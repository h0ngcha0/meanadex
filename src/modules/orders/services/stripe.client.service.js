'use strict';

angular.module('orders').factory('StripeInitializer', ['$window', '$q',
  'UrlUtil',
  function($window, $q, UrlUtil) {

    // Stripe's url for async initialization
    var checkoutUrl = 'https://checkout.stripe.com/checkout.js';

    // async loader
    var asyncLoad = function(asyncUrl, callbackName) {

      var deferred = $q.defer();

      var script = document.createElement('script');
      if (callbackName) {
        $window[callbackName] = deferred.resolve;
        asyncUrl += callbackName;
      }
      else {
        script.onload = deferred.resolve;
      }
      script.src = asyncUrl;
      document.body.appendChild(script);

      return deferred.promise;
    };


    // loading stripe maps
    var checkoutPromise = asyncLoad(checkoutUrl);

    return {
      // usage: StripeInitializer.checkoutInitialized.then(callback)
      checkoutInitialized: checkoutPromise,
      stripeImage: UrlUtil.getFullUrlPrefix() + '/images/brand/favicon.ico',
      stripePublicKey: 'STRIPE_PUBLISHABLE_KEY'
    };
  }
]);
