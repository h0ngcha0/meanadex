'use strict';

// Tshirts controller
angular.module('tshirts').controller('TshirtsController', [
  '$scope', '$stateParams', '$location', 'Authentication', 'Tshirts',
  '$filter', 'ngTableParams', '$timeout',
  function($scope, $stateParams, $location, Authentication, Tshirts,
           $filter, NgTableParams, $timeout) {
    $scope.authentication = Authentication;
    $scope.tmpVariant = {};

    // Create new Tshirt
    $scope.create = function() {
      // Create new Tshirt object
      var tshirt = new Tshirts ({
        name: this.name,
        frontImageUrl: this.frontImageUrl,
        backImageUrl: this.backImageUrl,
        variants: [this.tmpVariant]
      });

      // Redirect after save
      tshirt.$save(function(response) {
        $location.path('admin/tshirts/' + response._id);

        // Clear form fields
        $scope.name = '';
      }, function(errorResponse) {
           $scope.error = errorResponse.data.message;
         });
    };

    // Remove existing Tshirt
    $scope.remove = function( tshirt ) {
      if ( tshirt ) {
        tshirt.$remove();

        for (var i in $scope.tshirts ) {
          if ($scope.tshirts [i] === tshirt ) {
            $scope.tshirts.splice(i, 1);
          }
        }
      } else {
        $scope.tshirt.$remove(function() {
          $location.path('tshirts');
        });
      }
    };

    // Update existing Tshirt
    $scope.update = function(tshirt0) {
      var tshirt = tshirt0 || $scope.tshirt;
      tshirt.$update(
        function() {
        },
        function(errorResponse) {
          $scope.error = errorResponse.data.message;
        });
    };

    // Find a list of Tshirts
    $scope.find = function() {
      $scope.tshirts = Tshirts.query();
    };

    // Find existing Tshirt
    $scope.findOne = function() {
      $scope.tshirt = Tshirts.get({
        tshirtId: $stateParams.tshirtId
      });
    };

    var newVariantPlaceholder = function() {
      return {
        name: '',
        description: '',
        baseCost: 0,
        unit: 'SEK',
        colors: ['black'],
        $edit: true
      };
    };

    var variantPlaceholder = newVariantPlaceholder();

    $scope.addVariantColor = function(variant, color) {
      if (! _.contains(variant.colors, color)) {
        variant.colors.push(color);
        variant.error = '';
      } else {
        variant.error = 'Color already added';
      }
    };

    $scope.removeVariantColor = function(variant, color) {
      variant.colors = _.filter(
        variant.colors,
        function(c) {
          return c !== color;
        });
    };

    $scope.createOne = function() {
      $scope.tmpVariant = variantPlaceholder;
    };

    $scope.addTshirtVariant = function() {
      $scope.tshirt.variants.push(variantPlaceholder);
      $scope.variantsTableParams.reload();
    };

    $scope.tshirtsTableParams = new NgTableParams(
      {
        page: 1,
        count: 10
      },
      {
        total: 0,
        getData: function($defer, params) {
          $timeout(function() {
            var orderedData = params.filter() ?
              $filter('filter')($scope.tshirts, params.filter()) : $scope.tshirts;

            $scope.presentedTshirts = orderedData;

            params.total($scope.presentedTshirts.length);
            $defer.resolve($scope.presentedTshirts);
          }, 800); // FIXME: this is ugly
        }
      }
    );

   $scope.variantsTableParams = new NgTableParams(
      {
        page: 1,
        count: 10
      },
      {
        total: 0,
        getData: function($defer, params) {
          $timeout(function() {
            var orderedData = params.filter() ?
              $filter('filter')($scope.tshirt.variants, params.filter()) : $scope.tshirt.variants;

            $scope.presentedVariants = orderedData;

            params.total($scope.presentedVariants.length);
            $defer.resolve($scope.presentedVariants);
          }, 800); // FIXME: this is ugly
        }
      }
    );


    $scope.onRemove = function(tshirt) {
      $scope.remove(tshirt);
      $scope.tshirtsTableParams.reload();
    };

    $scope.onSave = function(tshirt) {
      tshirt.$edit = false;
      $scope.update(tshirt);
    };

    $scope.onEdit = function(tshirt) {
      tshirt.$edit = true;
    };

    $scope.onVariantEdit = function(variant) {
      variant.$edit = true;
    };

    $scope.onVariantSave = function(variant) {
      variant.$edit = false;
      variantPlaceholder = newVariantPlaceholder();
      $scope.update();
    };

    $scope.onVariantRemove = function(variant) {
      var newVariants =  _.filter($scope.tshirt.variants, function(v) {
                           return v.name !== variant.name;
                         });

      $scope.tshirt.variants = newVariants;
      variant.$edit = false;
      $scope.update();
      $scope.variantsTableParams.reload();
    };
  }
]);
