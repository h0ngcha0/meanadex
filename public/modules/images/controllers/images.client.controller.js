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

        $location.path('dashboard/images');
      }
    };

    // Update existing Image
    $scope.update = function(image) {
      image.tags = _.map(image.tags, function(tag) {
                     if(_.isObject(tag)) {
                       return tag.text;
                     } else {
                       return tag;
                     }
                   });
      image.$update(
        function() {
        },
        function(errorResponse) {
          $scope.error = errorResponse.data.message;
        }
      );
    };

    // Find a list of Images
    $scope.find = function(tags) {
      var queryTags;
      if(tags) {
        if(_.isArray(tags)) {
          queryTags = _.map(tags, function(tag) {
            return tag.text;
          });
        } else {
          queryTags = [tags.text];
        }
      }

      $scope.images = Images.query({tags: queryTags});
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
        $location.path('dashboard/images');
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
