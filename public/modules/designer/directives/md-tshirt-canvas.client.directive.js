'use strict';

/* global async */

angular.module('designer').directive('mdTshirtCanvas', [
  '$timeout', 'mdCanvasService', 'Images', 'CampaignCache',
  function($timeout, mdCanvasService, Images, CampaignCache) {
    var canvas;
    return {
      restrict: 'E',
      templateUrl: 'modules/designer/views/canvas.client.view.html',
      link: function(scope, element, attrs) {
        scope.addCanvasBorder = function() {
          mdCanvasService.addCanvasBorder();
        };

        scope.removeCanvasBorder = function() {
          mdCanvasService.removeCanvasBorder();
        };

        // has campaign
        if(scope.campaign) {
          var getCampaign = function(callback) {
            scope.campaign.$promise.then(
              function(campaign) {
                callback(null, campaign);
              },
              function(err) {
                callback(err);
              }
            );
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
              // promise fail
              mdCanvasService.init('tcanvas', '#tshirtFacing', '#shirtDiv');
            } else {
              var design = JSON.parse(campaign.design);
              var frontImage = images[0];
              var backImage = images[1];
              mdCanvasService.init(
                'tcanvas',
                '#tshirtFacing',
                '#shirtDiv',
                frontImage,
                backImage,
                design.front,
                design.back,
                campaign.color
              );
            }
          };

          async.waterfall([
            getCampaign,
            getImages
          ], initialize);
        } else {
          // not in campaign page
          var tshirt = CampaignCache.getTshirt();
          mdCanvasService.init(
            'tcanvas',
            '#tshirtFacing',
            '#shirtDiv',
            tshirt.frontImage.url,
            tshirt.backImage.url
          );
        }

        if(scope.enableEdit) {
          mdCanvasService.enableEdit();
        } else {
          mdCanvasService.disableEdit();
        }

        $timeout(function() {
          element.find('#flip').click(function() {
            var flipTextElem = element.find('#flip-text');
            var currentSide = mdCanvasService.flip();
            if (currentSide === 'front') {
              flipTextElem.text('Show Back View');
            } else {
              flipTextElem.text('Show Front View');
            }

          });
        }, 0);
      }
    };
  }
]);
