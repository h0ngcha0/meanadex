'use strict';

/* global async */
/* global fabric */

angular.module('campaigns').directive('mdCampaignCanvas', [
  'Images',
  function(Images) {
    return {
      restrict: 'E',
      scope: {
        campaign: '='
      },
      templateUrl: 'modules/campaigns/views/campaign-canvas.client.view.html',
      link: function(scope, element, attrs) {
        // Load design and convert it to image.
        var setCanvas = function(canvas, flipText, image, designJson) {
          // Going back
          scope.flipText = flipText;
          scope.backgroundImage = image;
          canvas.clear();
          if(designJson !== null) {
            canvas.loadFromJSON(designJson, function() {
              scope.canvasImgSrc = canvas.toDataURL({
                format: 'png'
              });
            });
          }
        };

        // has campaign
        var getCampaign = function(callback) {
          // if not a campaign promise, consider it as resolved campaign
          if(scope.campaign.$promise) {
            scope.campaign.$promise.then(
              function(campaign) {
                callback(null, campaign);
              },
              function(err) {
                callback(err);
              }
            );
          } else {
            callback(null, scope.campaign);
          }
        };

        var getFrontImage = function(campaign) {
          return function(callback) {
            var tshirt = campaign.tshirt;
            Images.get({imageId: tshirt.frontImage._id}).$promise.then(
              function(frontImage) {
                callback(null, frontImage.url);
              },
              function(err) {
                callback(err);
              }
            );
          };
        };

        var getBackImage = function(campaign) {
          return function(callback) {
            var tshirt = campaign.tshirt;
            Images.get({imageId: tshirt.backImage._id}).$promise.then(
              function(backImage) {
                callback(null, backImage.url);
              },
              function(err) {
                callback(err);
              }
            );
          };
        };

        var getImages = function(campaign, callback) {
          async.parallel([
            getFrontImage(campaign),
            getBackImage(campaign)
          ], function(err, images) {
               callback(err, campaign, images);
             });
        };

        var initialize = function(err, campaign, images) {
          if(err) {
            scope.error = {
              message: 'Error loading campaign.. We are sorry'
            };
          } else {
            var design = JSON.parse(campaign.design);
            var frontImage = images[0];
            var backImage = images[1];
            var canvas = new fabric.StaticCanvas('canvasId', {
              selectionBorderColor:'blue'
            });

            // set front
            setCanvas(canvas, 'Show Back View', frontImage, design.front);

            // restore the background color if possible
            scope.backgroundColor = {'background': campaign.color};

            scope.flip = function() {
              if(scope.flipText === 'Show Back View') {
                // Going back
                setCanvas(canvas, 'Show Front View', backImage, design.back);
              } else {
                // Going front
                setCanvas(canvas, 'Show Back View', frontImage, design.front);
              }
            };
          }
        };

        async.waterfall([
          getCampaign,
          getImages
        ], initialize);
      }
    };
  }
]);
