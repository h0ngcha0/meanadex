'use strict';

angular.module('designer').directive('mdImagePage', [
  'mdCanvasService',
  function(mdCanvasService){
    return {
      restrict: 'E',
      templateUrl: 'modules/designer/views/image-page.client.view.html',
      link: function(scope, element, attrs) {
        scope.images = [
          {src: 'modules/designer/img/avatar/avatar-1.jpeg'},
          {src: 'modules/designer/img/avatar/avatar-2.png'},
          {src: 'modules/designer/img/avatar/avatar-3.png'},
          {src: 'modules/designer/img/avatar/avatar-4.png'},
          {src: 'modules/designer/img/avatar/avatar-5.png'}
        ];

        scope.icons = [
          {
            value: "Gear",
            label: "<i class=\"fa fa-gear\"></i> Gear"
          },
          {
            value: "Globe",
            label: "<i class=\"fa fa-globe\"></i> Globe"
          },
          { value: "Heart",
            label: "<i class=\"fa fa-heart\"></i> Heart"
          },
          {
            value: "Camera",
            label:"<i class=\"fa fa-camera\"></i> Camera"
          }
        ];
      }
    };
  }
]);
