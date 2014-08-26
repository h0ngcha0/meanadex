'use strict';

angular.module('designer').directive('mdTshirtStyleQualityPanel', [
  '$timeout', '$compile', 'mdCanvasService', 'localStorageService',
  function($timeout, $compile, mdCanvasService, localStorageService) {
    return {
      restrict: 'E',
      templateUrl: 'modules/designer/views/style-quality.client.view.html',
      link: function(scope, element, attrs) {
        $timeout(function() {
          var setInitColor = function() {
            var col = element.find('.tshirt-variant').attr('colors');
            scope.colors = eval(col);
          };

          var setInitBaseCostAndUnit = function() {
            var baseCostNum = element.find('.tshirt-variant').attr('basecost'),
                unit = element.find('.tshirt-variant').attr('unit'),
                baseCost = [baseCostNum, unit].join(' ');

            element.find('#baseCostLabel').text(baseCost);
            localStorageService.set('baseCost', baseCost);
          };

          var setAvailableColorsFun = function() {
            element.find('.tshirt-variant').click(function() {
              mdCanvasService.setAvailableBgColors(eval(
                $(this).attr('colors')
              ));
            });
          };

          var setBaseCostAndUnitFun = function() {
            element.find('.tshirt-variant').click(function() {
              var baseCostNum = $(this).attr('basecost'),
                  unit = $(this).attr('unit'),
                  baseCost = [baseCostNum, unit].join(' ');

              element.find('#baseCostLabel').text(baseCost);
              localStorageService.set('baseCost', baseCost);
            });
          };

          var setInitTshirtVariant = function() {
            var name = element.find('.tshirt-variant').attr('name');
            localStorageService.set('tshirtVariant', name);
          };

          var setTshirtVariantFun = function() {
            element.find('.tshirt-variant').click(function() {
              var name = $(this).attr('name');
              localStorageService.set('tshirtVariant', name);
            });
          };

          // set up the available colors
          var setupColor = function() {
            scope.$apply(setInitColor);
            setAvailableColorsFun();
          };

          // set up the base cost
          var setupBaseCost = function() {
            setInitBaseCostAndUnit();
            setBaseCostAndUnitFun();
          };

          // set up the tshirt variants
          var setupTshirtVariant = function() {
            setInitTshirtVariant();
            setTshirtVariantFun();
          };

          setupColor();
          setupBaseCost();
          setupTshirtVariant();

          element.find('#tshirt-type-selector').change(function(e) {
            setupColor();
            setupBaseCost();
            setupTshirtVariant();
          });

          element.find('#designNextStep').click(function(e) {
            mdCanvasService.saveCanvas();

            if(mdCanvasService.isEmptyCanvas()) {
              element.find('#emptyCanvasModal').modal('show');
              e.preventDefault();
            } else {
              // when leaving the designer save the canvas
              // TODO: set it to read only as well. setting
              // canvas.selection = false doesn't seem to work.
              localStorageService.set('tshirtType', scope.currentTshirtType);
              mdCanvasService.disableEdit();
            }
          });

          scope.$on('mdeBgAvailableColorsChanged', function(e, o) {
            scope.$apply(function() {
              scope.colors = o.colors;
            });
          });
        }, 0);
      }
    };
  }
]);
