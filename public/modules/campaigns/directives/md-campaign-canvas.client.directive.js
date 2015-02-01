'use strict';

/* global async */
/* global fabric */

angular.module('campaigns').directive('mdCampaignCanvas', [
  'Images',
  function(Images) {
    return {
      restrict: 'E',
      scope: {
        scale: '@',
        campaign: '='
      },
      templateUrl: 'modules/campaigns/views/campaign-canvas.client.view.html',
      link: function(scope, element, attrs) {
        // Our requirement of the Tshirt picture should have height of 630
        // and width or 530.
        var originWidth = 530,
            originHeight = 630;

        // Load design and convert it to image.
        var setCanvas = function(canvas, flipText, image, designJson) {
          scope.flipText = flipText;
          scope.backgroundImage = image;
          scope.backgroundImageStyle = {
            width: (originWidth * scope.scale) + 'px',
            height: (originHeight * scope.scale) + 'px'
          };

          canvas.clear();

          // If design json is empty, still try to generate
          // empty image
          designJson = designJson || [];
          canvas.loadFromJSON(designJson, function() {
            var canvasImgSrc = canvas.toDataURL({
              format: 'png',
              multiplier: scope.scale
            });

            element.find('#canvasImage').attr('src', canvasImgSrc);
          });
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
            var canvas = new fabric.Canvas(campaign._id, {
              width: 200,
              height: 400,
              selectionBorderColor:'blue'
            });

            // set front
            setCanvas(canvas, 'Show Back View', frontImage, design.front);

            // restore the background color if possible
            scope.backgroundColor = {'background': campaign.color};

            scope.goalProgressStyle = {
              'width': (campaign.sold / campaign.goal) * 100 + '%',
              'min-width': '10em'
            };

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
