'use strict';

// Tshirts controller
angular.module('tshirts').controller('TshirtsController', [
  '$scope', '$stateParams', '$location', 'Authentication', 'Tshirts',
  '$filter', 'DashboardUtils', '$timeout', 'FileUploader',
  function($scope, $stateParams, $location, Authentication, Tshirts,
           $filter, DashboardUtils, $timeout, FileUploader) {
    $scope.authentication = Authentication;
    $scope.tmpVariant = {};
    $scope.tmpTshirt = {};

    // Create new Tshirt
    $scope.create = function() {
      if(!$scope.currentQueueItemFront) {
        $scope.error = 'Need to have front image';
        return;
      }

      if(!$scope.currentQueueItemBack) {
        $scope.error = 'Need to have back image';
        return;
      }

      var variantMsgsMap = {
        currency: 'Variant currency is required',
        baseCost: 'Variant base cost is required',
        description: 'Variant description is required',
        name: 'Variant name is required'
      };

      Object.keys(variantMsgsMap).forEach(function(key) {
        if(!$scope.tmpVariant[key]) {
          $scope.error = variantMsgsMap[key];
        }
      });

      if($scope.error) return;

      $scope.currentQueueItemFront.onSuccess = function(responseF, statusF, headerF) {
        var frontImgId = responseF._id;

        $scope.currentQueueItemBack.onSuccess = function(responseB, statusB, headerB) {
          var backImgId = responseB._id;

          var tshirt = new Tshirts ({
            name: $scope.tmpTshirt.name,
            frontImage: frontImgId,
            backImage: backImgId,
            variants: [$scope.tmpVariant]
          });

          // Redirect after save
          tshirt.$save(
            function(response) {
              $location.path('dashboard/tshirts/' + response._id);

              // Clear form fields
              $scope.tmpTshirt = {};
            },
            function(errorResponse) {
              $scope.error = errorResponse.data.message;
            }
          );
        };

        $scope.currentQueueItemBack.upload();
      };

      $scope.currentQueueItemFront.upload();
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
        function(response) {
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
        currency: 'SEK',
        colors: ['red'],
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

    $scope.tshirtsTableParams = DashboardUtils.newTableParams(
      function($defer, params) {
        var orderedData = params.filter() ?
          $filter('filter')($scope.tshirts, params.filter()) :
          $scope.tshirts;

        params.total(orderedData.length);
        $defer.resolve(orderedData);
      }
    );

    // Find a list of Tshirts and load them into tshirts table
    $scope.loadAllTshirtInTableData = function() {
      $scope.tshirts = Tshirts.query(
        function(data) {
          $scope.tshirtsTableParams.reload();
        }
      );
    };

    $scope.variantsTableParams = DashboardUtils.newTableParams(
      function($defer, params) {
        var orderedData = params.filter() ?
          $filter('filter')($scope.tshirt.variants, params.filter()) :
          $scope.tshirt.variants,
            length = (orderedData && orderedData.length) || 0;

        params.total(length);
        $defer.resolve(orderedData);
      }
    );

    // Find existing Tshirt and load all the variants to variants table
    $scope.loadAllVariantsInTableData = function() {
      $scope.tshirt = Tshirts.get(
        {
          tshirtId: $stateParams.tshirtId
        },
        function(data) {
          $scope.variantsTableParams.reload();
        }
      );

      $scope.tshirt.editFrontImg = false;
      $scope.tshirt.editBackImg = false;
      $scope.currentQueueItemBack = undefined;
      $scope.currentQueueItemFront = undefined;
    };


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

    // front image upload
    $scope.frontUploader = new FileUploader({
      url: '/images'
    });

    $scope.frontUploader.onAfterAddingFile = function(item) {
      $scope.currentQueueItemFront = item;
    };

    // back image uploader
    $scope.backUploader = new FileUploader({
      url: '/images'
    });

    $scope.backUploader.onAfterAddingFile = function(item) {
      $scope.currentQueueItemBack = item;
    };

    $scope.onFrontImgEdit = function() {
      $scope.tshirt.editFrontImg = true;
    };

    $scope.onBackImgEdit = function() {
      $scope.tshirt.editBackImg = true;
    };

    var onImgUploadSuccess = function(side, edit) {
      return function(response, status, header) {
        var imgId = response._id;
        var imgUrl = response.url;
        $scope.tshirt[side] = imgId;
        $scope.tshirt[edit] = false;

        $scope.tshirt.$update(
          function(response) {
            $scope.tshirt[side] = {
              _id: imgId,
              url: imgUrl
            };
          },
          function(errorResponse) {
            $scope.error = errorResponse.data.message;
          }
        );
      };
    };

    $scope.onFrontImgUpload = function() {
      $scope.currentQueueItemFront.onSuccess = onImgUploadSuccess('frontImage', 'editFrontImg');
      $scope.currentQueueItemFront.upload();
    };

    $scope.onBackImgUpload = function() {
      $scope.currentQueueItemBack.onSuccess = onImgUploadSuccess('backImage', 'editBackImg');
      $scope.currentQueueItemBack.upload();
    };
  }
]);
