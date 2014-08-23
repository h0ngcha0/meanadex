'use strict';

angular.module('designer').controller('DesignerController', [
  '$scope', 'mdCanvasService',
  function($scope, mdCanvasService) {
    $scope.currentTshirtType = null;
    $scope.currentVariant = null;

    $scope.tshirtTypes = [
      { id: 1
      , name: 'Short Sleeve Shirts'
      , variants:
        [ { name: 'Hanes Tagless Tee'
          , description: 'Budget friendly'
          , colors: [ {title:'White', style:'background-color:#ffffff;'}
                    , {title:'Dark Heather', style:'background-color:#616161;'}
                    , {title:'Gray', style:'background-color:#f0f0f0;'}
                    , {title:'Salmon', style:'background-color:#eead91;'}
                    , {title:'Kiwi', style:'background-color:#8aa140;'}
                    ]
          , baseCost: 50
          ,  unit: 'SEK'
          }
        , { name: 'Canvas Ringspun Tee'
          , description: 'Premium material'
          , colors: [ {title:'Heather Orange', style:'background-color:#fc8d74;'}
                    , {title:'Heather Dark Chocolate', style:'background-color:#432d26;'}
                    ,  {title:'Salmon', style:'background-color:#eead91;'}
                    ]
          , baseCost: 60
          , unit: 'SEK'
          }
        , { name: 'American Apparel Crew'
          , description: 'Brand name'
          , colors: [ {title:'Avocado', style:'background-color:#aeba5e;'}
                    , {title:'Kiwi', style:'background-color:#8aa140;'}
                    , {title:'Irish Green', style:'background-color:#1f6522;'}
                    ]
          , baseCost: 55
          , unit: 'SEK'
          }
        ]
      },
      { id: 2
      , name: 'Long Sleeve Shirts'
      , variants:
        [ { name: 'Gildan 6.1oz Long Sleeve'
          , description: 'Budget friendly'
          , colors: [ {title:'White', style:'background-color:#ffffff;'}
                    , {title:'Dark Heather', style:'background-color:#616161;'}
                    , {title:'Gray', style:'background-color:#f0f0f0;'}
                    ]
          , baseCost: 70
          , unit: 'SEK'
          }
        , { name: 'Hanes 6.1oz Long Sleeve'
          , description: 'Premium material'
          , colors: [ {title:'Heather Orange', style:'background-color:#fc8d74;'}
                    , {title:'Heather Dark Chocolate', style:'background-color:#432d26;'}
                    , {title:'Salmon', style:'background-color:#eead91;'}
                    ]
          , baseCost: 72
          , unit: 'SEK'
          }
        ]
      },
      { id: 3
      , name: 'Hoodies'
      , variants:
        [ { name: 'Gildan 8oz Heavy Blend Hoodie'
          , description: 'Basic hoodie'
          , colors: [ {title:'White', style:'background-color:#ffffff;'}
                    , {title:'Dark Heather', style:'background-color:#616161;'}
                    , {title:'Gray', style:'background-color:#f0f0f0;'}
                    ]
          , baseCost: 80
          , unit: 'SEK'
          }
        , { name: 'Canvas Poly-Cotton Hoodie'
          , description: 'Premium blend hoodie'
          , colors: [ {title:'Heather Orange', style:'background-color:#fc8d74;'}
                    , {title:'Heather Dark Chocolate', style:'background-color:#432d26;'}
                    , {title:'Salmon', style:'background-color:#eead91;'}
                    ]
          , baseCost: 82
          , unit: 'SEK'
          }
        ]
      },
      { id: 4
      , name: 'Tank tops'
      , variants:
        [ { name: 'Gildan Unisex Tank'
          , description: 'Budget friendly'
          , colors: [ {title:'White', style:'background-color:#ffffff;'}
                    , {title:'Dark Heather', style:'background-color:#616161;'}
                    , {title:'Gray', style:'background-color:#f0f0f0;'}
                    ]
          , baseCost: 102
          , unit: 'SEK'
          }
        , { name: 'Canvas Ringspun Tank'
          , description: 'Premium material'
          , colors: [ {title:'Heather Orange', style:'background-color:#fc8d74;'}
                    , {title:'Heather Dark Chocolate', style:'background-color:#432d26;'}
                    , {title:'Salmon', style:'background-color:#eead91;'}
                    ]
          , baseCost: 98
          , unit: 'SEK'
          }
        , { name: 'American Apparel Tank'
          , description: 'Top of the line'
          , colors: [ {title:'Avocado', style:'background-color:#aeba5e;'}
                    , {title:'Kiwi', style:'background-color:#8aa140;'}
                    , {title:'Irish Green', style:'background-color:#1f6522;'},
                    ]
          , baseCost: 92
          , unit: 'SEK'
          }
        ]
      }
    ];

    $scope.images = [ {src: 'modules/designer/img/avatar/avatar-1.jpeg'}
                    , {src: 'modules/designer/img/avatar/avatar-2.png'}
                    , {src: 'modules/designer/img/avatar/avatar-3.png'}
                    , {src: 'modules/designer/img/avatar/avatar-4.png'}
                    , {src: 'modules/designer/img/avatar/avatar-5.png'}
                    ];

    $scope.currentFont = { name: 'Arial'
                         , class: 'Arial'
                         };

    $scope.fonts = [ {name: 'Arial', class: 'Arial'}
                   , {name: 'Helvetica', class: 'Helvetica'}
                   , {name: 'Myriad Pro', class: 'MyriadPro'}
                   , {name: 'Delicious', class: 'Delicious'}
                   , {name: 'Verdana', class: 'Verdana'}
                   , {name: 'Georgia', class: 'Georgia'}
                   , {name: 'Courier', class: 'Courier'}
                   , {name: 'Comic Sans MS', class: 'ComicSansMS'}
                   , {name: 'Impact', class: 'Impact'}
                   , {name: 'Monaco', class: 'Monaco'}
                   , {name: 'Optima', class: 'Optima'}
                   , {name: 'Hoefler Text', class: 'Hoefler Text'}
                   , {name: 'Plaster', class: 'Plaster'}
                   , {name: 'Engagement', class: 'Engagement'}
                   ];

    $scope.changeToBoldText = function() {
      mdCanvasService.toggleActiveTextBold();
    };

    $scope.changeToItalicText = function() {
      mdCanvasService.toggleActiveTextItalic();
    };

    $scope.changeToUnderlineText = function() {
      mdCanvasService.toggleActiveTextUnderline();
    };

    $scope.changeFontFamily = function() {
      mdCanvasService.changeTextFontFamily($scope.currentFont.name);
    }
  }
]);
