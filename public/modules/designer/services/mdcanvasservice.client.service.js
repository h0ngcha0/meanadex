'use strict';

angular.module('designer').service('mdCanvasService', [
  '$rootScope',
  function($rootScope) {
    var canvas = null;

    // Variables related to the demarcation lines for the
    // Drawing area.
    var DrawAreaWidth   = 200,
        DrawAreaHeight  = 400,
        UpperLeftPoint  = [0, 0],
        UpperRightPoint = [DrawAreaWidth, 0],
        DownLeftPoint   = [0, DrawAreaHeight],
        DownRightPoint  = [DrawAreaWidth, DrawAreaHeight],
        LineWidthOffset = 1,
        lineProps = {
          'stroke':'#000000',
          'strokeWidth':1,
          hasBorders:false,
          hasControls:false,
          hasRotatingPoint:false,
          selectable:false
        },
        lineL, lineR, lineU, lineD;

    // Position for the newly added text
    var newTextTop = 50;
    // Edit switch
    var enableEdit = true;
    // background color
    var bgColor = null;

    var offsetXFun = function(Point, OffsetVal) {
      return [Point[0]-OffsetVal, Point[1]];
    };

    var offsetYFun = function(Point, OffsetVal) {
      return [Point[0], Point[1]-OffsetVal];
    };

    var fabricLineFun = function(Point1, Point2) {
      return new fabric.Line(Point1.concat(Point2), lineProps);
    };

    lineL = fabricLineFun(
      offsetXFun(UpperLeftPoint, 1),
      offsetXFun(DownLeftPoint, 1)
    );
    lineR = fabricLineFun(
      offsetXFun(UpperRightPoint, 1),
      offsetXFun(DownRightPoint, 1)
    );
    lineU = fabricLineFun(
      offsetYFun(UpperRightPoint, 1),
      offsetYFun(UpperLeftPoint, 1)
    );
    lineD = fabricLineFun(
      offsetYFun(DownLeftPoint, 1),
      offsetYFun(DownRightPoint, 1)
    );

    // Monkey patch on fabric.js
    (function(){
      fabric.Canvas.prototype.selection = false;

      fabric.Canvas.prototype.cursorMap = [
        'n-resize',
        '-webkit-grab',
        'e-resize',
        '-webkit-grab',
        's-resize',
        'pointer',
        'w-resize',
        '-webkit-grab'
      ];

      fabric.Canvas.prototype._getActionFromCorner = function(target, corner) {
        var action = 'drag';
        if (corner) {
          action = (corner === 'ml' || corner === 'mr') ?
            'scaleX' :
            (corner === 'mt' || corner === 'mb') ?
            'scaleY' :
            (corner === 'tr' || corner === 'mtr') ?
            'rotate' :
            corner === 'bl' ?
            'delete' :
            corner === 'tl' ?
            'drag' :
            'scale';
        }
        return action;
      };


      fabric.Canvas.prototype._setupCurrentTransform = function(e, target) {
        var degreesToRadians = fabric.util.degreesToRadians;

        if (!target) return;

        var pointer = this.getPointer(e),
            corner = target._findTargetCorner(pointer),
            action = this._getActionFromCorner(target, corner),
            origin = this._getOriginFromCorner(target, corner);

        this._currentTransform = {
          target: target,
          action: action,
          scaleX: target.scaleX,
          scaleY: target.scaleY,
          offsetX: pointer.x - target.left,
          offsetY: pointer.y - target.top,
          originX: origin.x,
          originY: origin.y,
          ex: pointer.x,
          ey: pointer.y,
          left: target.left,
          top: target.top,
          theta: degreesToRadians(target.angle),
          width: target.width * target.scaleX,
          mouseXSign: 1,
          mouseYSign: 1
        };

        this._currentTransform.original = {
          left: target.left,
          top: target.top,
          scaleX: target.scaleX,
          scaleY: target.scaleY,
          originX: origin.x,
          originY: origin.y
        };

        this._resetCurrentTransform(e);
        if(action === 'delete') {
          this.remove(target);
        }
      };

      fabric.Canvas.prototype._getRotatedCornerCursor = function(corner, target) {
        var cursorOffset = {
          mt: 0, // n
          tr: 1, // ne
          mr: 2, // e
          br: 3, // se
          mb: 4, // s
          bl: 5, // sw
          ml: 6, // w
          tl: 7 // nw
        };
        var n = cursorOffset[corner];
        return this.cursorMap[n];
      };

      fabric.Object.prototype._drawControl = function(control, ctx, methodName, left, top) {
        var degreesToRadians = fabric.util.degreesToRadians,
            isVML = typeof G_vmlCanvasManager !== 'undefined';
        var sizeX = this.cornerSize / this.scaleX,
            sizeY = this.cornerSize / this.scaleY,
            img   = new Image();

        if (this.isControlVisible(control)) {
          /*jshint expr:true */
          isVML || this.transparentCorners || ctx.clearRect(left, top, sizeX, sizeY);

          switch(control) {
            case 'br':
            img.src = 'modules/designer/img/tool/scale.png';
            ctx.drawImage(img, left, top, sizeX, sizeY);
            break;
            case 'bl':
            img.src = 'modules/designer/img/tool/delete.png';
            ctx.drawImage(img, left, top, sizeX, sizeY);
            break;
            case 'tl':
            img.src = 'modules/designer/img/tool/drag.png';
            ctx.drawImage(img, left, top, sizeX, sizeY);
            break;
            case 'tr':
            img.src = 'modules/designer/img/tool/rotate.png';
            ctx.drawImage(img, left, top, sizeX, sizeY);
            break;
            default:
            ctx[methodName](left, top, sizeX, sizeY);
          }
        }
      };

      fabric.Object.prototype._controlsVisibility = {
        tl: true,
        tr: true,
        br: true,
        bl: true,
        ml: true,
        mt: true,
        mr: true,
        mb: true,
        mtr: false
      };

      fabric.Text.prototype.lockUniScaling = true;
      fabric.Text.prototype.centeredScaling = true;
      fabric.Image.prototype.centeredScaling = true;
    })();

    // return the canvas instance
    this.getCanvas = function() {
      return canvas;
    };

    this.init = function(canvasId, imageId, tshirtDivId, frontJson, backJson, color) {
      console.log('initialize...');
      this.imageId = imageId;
      this.tshirtDivId = tshirtDivId;

      if(frontJson) this.frontCanvas = frontJson;
      if(backJson) this.backCanvas = backJson;
      if(color) bgColor = color;

      canvas = new fabric.Canvas(canvasId, {
        selectionBorderColor:'blue',
        selection: enableEdit ? true : false
      });

      canvas.on({
        'object:moving': function(e) {
          e.target.opacity = 0.5;
        },
        'object:modified': function(e) {
          e.target.opacity = 1;
        },
        'object:selected': function(e) {
          var selectedObject = e.target;
          selectedObject.hasRotatingPoint = true;
          if (selectedObject &&
            selectedObject.type === 'text') {
            $rootScope.$broadcast(
              'mdeTextObjectSelected',
              {
                text: selectedObject.getText(),
                fontColor: selectedObject.fill,
                fontFamily: selectedObject.fontFamily
              }
            );
          } else if (selectedObject &&
            selectedObject.type === 'image'){
            $rootScope.$broadcast('mdeImageObjectSelected');
          }
        },
        'selection:cleared': function(e) {
          $rootScope.$broadcast('mdeObjectCleared');
        }
      });

      this.restoreCanvas();
    };

    // this only saves the current side of the canvas, because the
    // other side is either saved during the flip or doesn't need
    // to be saved since it is empty.
    this.saveCanvas = function() {
      // makes sure there are 1+ objects on the canvas
      if (canvas.getObjects().length !== 0) {
        if (this.currentSide === 'front') {
          this.frontCanvas = JSON.stringify(canvas);
        } else if (this.currentSide === 'back') {
          this.backCanvas = JSON.stringify(canvas);
        }
      } else {
        if (this.currentSide === 'front') {
          this.frontCanvas = null;
        } else if (this.currentSide === 'back') {
          this.backCanvas = null;
        }
      }
    };

    this.restoreCanvas = function() {
      // restore the canvas if possible
      var frontImg = 'modules/designer/img/canvas/crew_front.png';
      this.renderCanvas(frontImg, this.frontCanvas);
      this.currentSide = 'front';

      // restore the background color if possible
      if(bgColor !== null) {
        $(this.tshirtDivId).css('backgroundColor', bgColor);
      }
    };

    var isCanvasEmpty = function(canvasIn) {
      return (! canvasIn) || (JSON.parse(canvasIn).objects.length === 0);
    };

    this.isEmptyCanvas = function() {
      return isCanvasEmpty(this.frontCanvas) && isCanvasEmpty(this.backCanvas);
    };

    this.disableEdit = function() {
      if(canvas) {
        canvas.getObjects().forEach(function(obj) {
          obj.set('selectable', false);
        });
      }
      enableEdit = false;
    };

    this.enableEdit = function() {
      if(canvas) {
        canvas.getObjects().forEach(function(obj) {
          obj.set('selectable', true);
        });
      }
      enableEdit = true;
    };

    var addText = function(text, fontColor, fontFamily) {
      var textSample = new fabric.Text(
        text,
        {
          //left: fabric.util.getRandomInt(0, 200),
          //top: fabric.util.getRandomInt(0, 400),
          left: 80,
          top: 50,
          fontFamily: fontFamily,
          angle: 0,
          fill: fontColor,
          scaleX: 0.5,
          scaleY: 0.5,
          textAlign: 'center',
          fontWeight: '',
          hasRotatingPoint: true
        }
      );

      canvas.add(textSample);
      canvas.item(canvas.item.length-1).hasRotatingPoint = true;
    };

    this.addTextWhenNoActiveText =
    function(text, fontColor, fontFamily) {
      var activeObject = canvas.getActiveObject();
      if (!activeObject || activeObject.type !== 'text') {
        addText(text, fontColor, fontFamily);
      }
    };

    this.activeTextP = function() {
      var activeObject = canvas.getActiveObject();
      return activeObject && activeObject.type === 'text';
    };

    this.setTheLastObjActive = function() {
      canvas.setActiveObject(canvas.item(canvas.getObjects().length - 1));
    };

    this.addImage = function(ImgSrc) {
      /*temp code*/
      var offset = 50;
      var left = fabric.util.getRandomInt(0 + offset, 200 - offset);
      var top = fabric.util.getRandomInt(0 + offset, 400 - offset);
      var angle = fabric.util.getRandomInt(-20, 40);
      var width = fabric.util.getRandomInt(30, 50);
      var opacity = (function(min, max){
        return Math.random() * (max - min) + min;
      })(0.5, 1);

      fabric.Image.fromURL(ImgSrc, function(image) {
        image.set(
          {
            left: left,
            top: top,
            angle: 0,
            padding: 10,
            cornersize: 10,
            hasRotatingPoint:true
          }
        );

        canvas.add(image);
      });
    };

    this.removeSelected = function() {
      var activeObject = canvas.getActiveObject(),
          activeGroup = canvas.getActiveGroup();
      if (activeObject) {
        canvas.remove(activeObject);
        $('#text-string').val('');
      }
      else if (activeGroup) {
        var objectsInGroup = activeGroup.getObjects();
        canvas.discardActiveGroup();
        objectsInGroup.forEach(function(object) {
          canvas.remove(object);
        });
      }
    };

    this.renderCanvas = function(Img, tshirtCanvas) {
      $(this.imageId).attr('src', Img);
      canvas.clear();
      if(tshirtCanvas !== null) {
        canvas.loadFromJSON(
          tshirtCanvas,
          canvas.renderAll.bind(canvas)
        );
      }

      if(enableEdit) {
        this.enableEdit();
      } else {
        this.disableEdit();
      }
    };

    this.flip = function() {
      if (this.currentSide === 'front') {
        return this.flipBack();
      } else {
        return this.flipFront();
      }
    };

    this.flipBack = function() {
      var backImg = 'modules/designer/img/canvas/crew_back.png';
      this.frontCanvas = JSON.stringify(canvas);
      this.renderCanvas(backImg, this.backCanvas);
      this.currentSide = 'back';
      return this.currentSide;
    };

    this.flipFront = function() {
      var frontImg = 'modules/designer/img/canvas/crew_front.png';
      this.backCanvas = JSON.stringify(canvas);
      this.renderCanvas(frontImg, this.frontCanvas);
      this.currentSide = 'front';
      return this.currentSide;
    };

    this.getFrontCanvas = function() {
      return this.frontCanvas;
    };

    this.getBackCanvas = function() {
      return this.backCanvas;
    };

    this.changeBackground = function(color) {
      bgColor = color;
      $(this.tshirtDivId).css('backgroundColor', color);
    };

    this.addCanvasBorder = function() {
      [lineL, lineR, lineU, lineD].map(function(elem) {
        canvas.add(elem);
      });
      canvas.renderAll();
    };

    this.removeCanvasBorder = function() {
      [lineL, lineR, lineU, lineD].map(function(elem) {
        canvas.remove(elem);
      });
      canvas.renderAll();
    };

    var applyToActiveTextFun = function(fun) {
      var activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === 'text') {
        fun(activeObject);
        canvas.renderAll();
      }
    };

    this.renderActiveTextContent = function(text) {
      var activeObject = canvas.getActiveObject();
      if (activeObject && activeObject.type === 'text') {
        if(text === '') {
          canvas.remove(activeObject);
        } else {
          activeObject.setText(text);
          var left = (DrawAreaWidth - activeObject.width)/2;
          activeObject.setLeft(left);
        }
        canvas.renderAll();
      }
    };

    this.renderActiveTextFontColor = function(color) {
      applyToActiveTextFun(function(activeObject) {
        activeObject.setFill(color);
      });
    };

    this.changeTextFontFamily = function(font) {
      applyToActiveTextFun(function(activeObject) {
        activeObject.setFontFamily(font);
      });
    };

    this.toggleActiveTextBold = function() {
      applyToActiveTextFun(function(activeObject) {
        var weight = activeObject.fontWeight === 'bold' ? '' : 'bold';
        activeObject.setFontWeight(weight);
      });
    };

    this.toggleActiveTextItalic = function() {
      applyToActiveTextFun(function(activeObject) {
        var style = activeObject.fontStyle === 'italic' ? '' : 'italic';
        activeObject.setFontStyle(style);
      });
    };

    this.toggleActiveTextStrike = function() {
      applyToActiveTextFun(function(activeObject) {
        var decoration = activeObject.textDecoration === 'line-through' ? '' : 'line-through';
        activeObject.setTextDecoration(decoration);
      });
    };

    this.toggleActiveTextUnderline = function() {
      applyToActiveTextFun(function(activeObject) {
        var decoration = activeObject.textDecoration === 'underline' ? '' : 'underline';
        activeObject.setTextDecoration(decoration);
      });
    };

    this.setAvailableBgColors = function(colors) {
      $rootScope.$broadcast('mdeBgAvailableColorsChanged', {
        colors: colors
      });
    };
  }
]);
