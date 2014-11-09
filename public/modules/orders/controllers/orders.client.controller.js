'use strict';

// Orders controller
angular.module('orders').controller('OrdersController', [
  '$scope', '$stateParams', '$location', 'Authentication', 'Orders',
  function($scope, $stateParams, $location, Authentication, Orders) {

    $scope.authentication = Authentication;

    $scope.orderedCampaign = JSON.parse($stateParams.campaign);
    $scope.sizes = ['S', 'M', 'L'];
    $scope.tshirtSize = 'M';

    $scope.countries = ['Finland', 'Sweden', 'Norway', 'Denmark'];
    $scope.country = 'Sweden';

    // Create new Order
    $scope.create = function() {
      // Create new Order object
      var order = new Orders ({
        name: this.name
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

    // Remove existing Order
    $scope.remove = function( order ) {
      if ( order ) {
        order.$remove();

        for (var i in $scope.orders ) {
          if ($scope.orders [i] === order ) {
            $scope.orders.splice(i, 1);
          }
        }
      } else {
        $scope.order.$remove(function() {
          $location.path('orders');
        });
      }
    };

    // Update existing Order
    $scope.update = function() {
      var order = $scope.order ;

      order.$update(function() {
        $location.path('orders/' + order._id);
      }, function(errorResponse) {
           $scope.error = errorResponse.data.message;
         });
    };

    // Find a list of Orders
    $scope.find = function() {
      $scope.orders = Orders.query();
    };

    // Find existing Order
    $scope.findOne = function() {
      $scope.order = Orders.get({
        orderId: $stateParams.orderId
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
        messages.push("email format is not correct");
      }

      if(messages === []) {
        console.log('yay');
      } else {
        $scope.error = {
          messages: messages
        };
      }
    };
  }
]);
