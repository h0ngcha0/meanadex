'use strict';

// Images controller
angular.module('images').controller('ImagesController', [
  '$scope', '$stateParams', '$location', 'AccessToken',
  'Images', 'FileUploader', 'Tags', 'ImagesUtils', 'SearchImages',
  function($scope, $stateParams, $location, AccessToken,
           Images, FileUploader, Tags, ImagesUtils, SearchImages) {
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
        id: $stateParams.id
      });
    };


    var url = '/images',
        token = AccessToken.getAccessToken();
    if (!!token) {
      url += '?access_token=' + token;
    }

    // file upload
    $scope.uploader = new FileUploader({
      url: url
    });

    $scope.uploadItem = function(item) {
      ImagesUtils.validateImage(
        item.file,
        '.imageAlert',
        function() {
          item.onSuccess = function(image, status, header) {
            $location.path('dashboard/images/' + image._id);
          };

          item.upload();
        }
      );
    };

    $scope.removeCurrentItem = function() {
      $scope.currentQueueItem.remove();
      $scope.currentQueueItem = undefined;
    };

    $scope.uploader.onAfterAddingFile = function(item) {
      $scope.currentQueueItem = item;
    };

    // load tags
    $scope.loadTags = function() {
      return Tags.query();
    };

    var minSearchTextLength = 3;
    $scope.searchImages = function(text) {
      console.log('search images: ' + text);
      if(text.length >= minSearchTextLength) {
        SearchImages.query(
          {
            text: text,
            limit: 8
          }
        ).$promise.then(
          function(result) {
            $scope.images = result.documents;
          },
          function(err) {
            $scope.images = [];
          }
        );
      }
    };
  }
]);
