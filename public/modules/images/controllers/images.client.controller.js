'use strict';

// Images controller
angular.module('images').controller('ImagesController', [
  '$scope', '$stateParams', '$location', 'Authentication', 'Images', 'FileUploader',
  function($scope, $stateParams, $location, Authentication, Images, FileUploader) {
    $scope.authentication = Authentication;

    // Create new Image
    $scope.create = function() {
      // Create new Image object
      var image = new Images ({
        url: this.url
      });

      // Redirect after save
      image.$save(function(response) {
        $location.path('images/' + response._id);

        // Clear form fields
        $scope.url = '';
      }, function(errorResponse) {
           $scope.error = errorResponse.data.message;
         });
    };

    // Remove existing Image
    $scope.remove = function( image ) {
      if ( image ) {
        image.$remove();

        for (var i in $scope.images ) {
          if ($scope.images [i] === image ) {
            $scope.images.splice(i, 1);
          }
        }
      } else {
        $scope.image.$remove(function() {
          $location.path('images');
        });
      }
    };

    // Update existing Image
    $scope.update = function() {
      var image = $scope.image ;

      image.$update(function() {
        $location.path('images/' + image._id);
      }, function(errorResponse) {
           $scope.error = errorResponse.data.message;
         });
    };

    // Find a list of Images
    $scope.find = function() {
      $scope.images = Images.query();
    };

    // Find existing Image
    $scope.findOne = function() {
      $scope.image = Images.get({
        imageId: $stateParams.imageId
      });
    };


    // file upload
    $scope.uploader = new FileUploader({
      url: '/images'
    });

    $scope.uploadItem = function(item) {
      item.onSuccess = function(response, status, header) {
        $location.path('images/' + response._id);
      };

      item.upload();
    };

    $scope.removeCurrentItem = function() {
      $scope.currentQueueItem.remove();
      $scope.currentQueueItem = undefined;
    };

    $scope.uploader.onAfterAddingFile = function(item) {
      $scope.currentQueueItem = item;
    };
  }
]);
