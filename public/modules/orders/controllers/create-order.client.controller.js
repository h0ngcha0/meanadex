'use strict';

// Orders controller
angular.module('orders').controller('CreateOrderController', [
  '$scope', '$stateParams', '$location', 'Authentication', 'Orders',
  function($scope, $stateParams, $location, Authentication, Orders) {

    $scope.authentication = Authentication;

    $scope.orderedCampaign = JSON.parse($stateParams.campaign);
    $scope.sizes = ['S', 'M', 'L'];
    $scope.tshirtSize = 'M';

    $scope.countries = ['Finland', 'Sweden', 'Norway', 'Denmark'];
    $scope.country = 'Sweden';
    $scope.shippingAddr = {};

    // Create new Order
    $scope.create = function(campaign, provider, email, description, payment, shippingAddr) {
      // Create new Order object
      var order = new Orders ({
        campaign: campaign,
        provider: provider,
        email: email,
        description: description,
        payment: payment,
        shippingAddr: shippingAddr
      });

      // Redirect after save
      order.$save(function(response) {
        $location.path('orders/' + response._id);

        // Clear form fields
        $scope.name = '';
      }, function(errorResponse) {
           $scope.error = errorResponse.data.message;
         });
    };

    $scope.totalPrice = function(quantity) {
      var price = parseInt($scope.orderedCampaign.price.value);
      if(quantity === undefined) {
        return price;
      } else {
        return price * quantity;
      }
    };

    $scope.orderCampaign = function(name, campaign) {
      var messages = [];

      var msgsMap = {
        quantity: 'Quantity is required',
        email: 'Email is required',
        fullname: 'Full name is required',
        shippingAddr: 'Shipping address is required',
        roomNum: 'Room number is required',
        city: 'City is required',
        zipcode: 'Zip code is required'
      };

      Object.keys(msgsMap).forEach(function(key) {
        if($scope.orderForm[key].$error.required) {
          messages.push(msgsMap[key]);
        }
      });

      if($scope.orderForm.email.$error.email){
        messages.push('email format is not correct');
      }

      // Check if there're any errors
      if(messages.length === 0) {
        var handler = StripeCheckout.configure({
          key: 'pk_test_WMSaxecz5HSTGZxlFbuxdF7B',
          image: '/modules/core/img/brand/favicon.ico',
          token: function(payment) {
            $scope.create(
              $scope.orderedCampaign._id,
              'stripe',
              $scope.email,
              $scope.orderedCampaign.name,
              payment,
              $scope.shippingAddr
            );
          }
        });

        // Open Checkout with further options
        handler.open({
          name: 'Meanadex',
          description: $scope.orderedCampaign.title,
          amount: $scope.orderedCampaign.price.value,
          unit: $scope.orderedCampaign.price.unit
        });
      } else {
        $scope.error = {
          messages: messages
        };
      }
    };
  }
]);
