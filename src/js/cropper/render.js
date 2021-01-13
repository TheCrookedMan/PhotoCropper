import {
  setStyle,
  addClass,
  assign,
  getTransforms,
  getRotatedSizes
} from '../utilities';

import DEFAULTS from './defaults'

export default {
  render() {
    this.initContainer();
    this.initCanvas();
    this.initCropBox()
  },
  initContainer() {
    const {
      element,
      options,
      container,
      cropper,
    } = this;
    const containerData = {
      width: container.offsetWidth - 10,
      height: container.offsetHeight - 10,
    };

    this.containerData = containerData;

    setStyle(cropper, {
      width: containerData.width,
      height: containerData.height,
    });
  },
  initCanvas() {
    const {
      containerData,
      imageData
    } = this;
    const rotated = Math.abs(imageData.rotate) % 180 === 90;

    const naturalWidth = rotated ? imageData.naturalHeight : imageData.naturalWidth;
    const naturalHeight = rotated ? imageData.naturalWidth : imageData.naturalHeight;

    const aspectRatio = naturalWidth / naturalHeight;

    let canvasWidth = containerData.width;
    let canvasHeight = containerData.height;
    //容器宽高比
    const canvasAspectRatio = canvasWidth / canvasHeight;
    
    //判断图片的宽高比，与容器的宽高比
    if (aspectRatio > canvasAspectRatio) {
      //判断图片宽度是否大于容器宽度
      if (naturalWidth > containerData.width) {
        canvasWidth = containerData.width
        canvasHeight = canvasWidth / aspectRatio
      } else {
        canvasWidth = naturalWidth
        canvasHeight = canvasWidth / aspectRatio
      }
    } else {
      //判断图片高度是否大于容器高度
      if (naturalHeight > containerData.height) {
        canvasHeight = containerData.height
        canvasWidth = canvasHeight * aspectRatio
      } else {
        canvasHeight = naturalHeight
        canvasWidth = canvasHeight * aspectRatio
      }
    }

    const canvasData = {
      aspectRatio,
      naturalWidth,
      naturalHeight,
      width: canvasWidth,
      height: canvasHeight,
    };

    canvasData.left = (containerData.width - canvasWidth) / 2;
    canvasData.top = (containerData.height - canvasHeight) / 2;
    
    this.canvasData = canvasData;

    const {
      canvas
    } = this;

    setStyle(canvas, assign({
      width: canvasData.width,
      height: canvasData.height
    }, getTransforms({
      translateX: canvasData.left,
      translateY: canvasData.top
    })));

    assign(this.imageData, {
      width: canvasData.width,
      height: canvasData.height,
      left: 0,
      top: 0
    });

    this.renderImage();
  },
  renderCanvas(changed, transformed) {
    const {
      canvasData,
      imageData,
      containerData
    } = this;

    if (transformed) {
      const {
        width: naturalWidth,
        height: naturalHeight
      } = getRotatedSizes({
        width: imageData.naturalWidth * Math.abs(imageData.scaleX || 1),
        height: imageData.naturalHeight * Math.abs(imageData.scaleY || 1),
        degree: imageData.rotate || 0,
      });

      //计算canvas容器宽高比例
      const containerRatio = containerData.width / containerData.height;
      //调整后的图片宽高比例
      const imageRatio = naturalWidth / naturalHeight;

      let width,height;
      //容器宽高比如果小于图片宽高比，那么以容器的宽度为缩放依据
      if (containerRatio < imageRatio) {
        //留边
        width = containerData.width - 10;
        height = width / imageRatio;
      } else {
        //留边
        height = containerData.height - 10;
        width = height * imageRatio;
      }

      canvasData.left -= (width - canvasData.width) / 2;
      canvasData.top -= (height - canvasData.height) / 2;

      canvasData.width = width;
      canvasData.height = height;
      canvasData.aspectRatio = naturalWidth / naturalHeight;
      canvasData.naturalWidth = naturalWidth;
      canvasData.naturalHeight = naturalHeight;
      this.canvasData = canvasData;
    }

    setStyle(this.canvas, assign({
      width: canvasData.width,
      height: canvasData.height
    }, getTransforms({
      translateX: canvasData.left,
      translateY: canvasData.top,
    })));

    this.limitCropBox();
    this.renderImage(changed);
  },
  renderImage(changed) {
    const {
      canvasData,
      imageData
    } = this;

    let width = imageData.naturalWidth * (canvasData.width / canvasData.naturalWidth);
    let height = imageData.naturalHeight * (canvasData.height / canvasData.naturalHeight);
    
    this.imageData = assign(imageData, {
      width,
      height,
      left: (canvasData.width - width) / 2 ,
      top: (canvasData.height - height) / 2,
    });

    setStyle(this.image, assign({
      width: imageData.width,
      height: imageData.height,
    }, getTransforms(assign({
      translateX: imageData.left,
      translateY: imageData.top,
    }, imageData))));

    if (changed) {
      this.output();
    }
  },
  initDragBox() {
    const {
      dragBox
    } = this

    addClass(dragBox, 'cropper-crop')
    addClass(dragBox, 'cropper-modal')
  },

  initCropBox() {
    this.initDragBox();
    const {
      options,
      cropBox,
      canvasData,
      imageData
    } = this;
    
    const cropBoxData = {
      width: options.initCropBoxWidth || canvasData.width,
      height: (options.initCropBoxHeight < canvasData.height ? options.initCropBoxHeight : canvasData.height) || canvasData.height,
      top: canvasData.top,
      left: canvasData.left
    };
    //裁切框上下居中
    cropBoxData.top += (canvasData.height - cropBoxData.height)/2;
    //裁剪框左右居中
    cropBoxData.left += (canvasData.width - cropBoxData.width) / 2;

    if (options.cropModel === 'freedom') {
      setStyle(cropBox, assign({
        width: cropBoxData.width,
        height: cropBoxData.height,
      }, getTransforms({
        translateX: cropBoxData.left,
        translateY: cropBoxData.top,
      })))
    }

    let _maxLeft = canvasData.left + canvasData.width,
    _maxTop = canvasData.top + canvasData.height;

    this.cropBoxData = assign(cropBoxData, {
      minWidth: options.cropMinW,
      minHeight: options.cropMinH
    }, {
      maxWidth: canvasData.width,
      maxHeight: canvasData.height,
      minLeft: canvasData.left,
      minTop: canvasData.top,
      maxLeft: _maxLeft,
      maxTop: _maxTop,
    });

    this.output();
  },
  limitCropBox(){
    const {
      cropBoxData,
      canvasData
    } = this;

    assign(cropBoxData, {
      minWidth: DEFAULTS.cropMinW,
      minHeight: DEFAULTS.cropMinH
    }, {
      maxWidth: canvasData.width,
      maxHeight: canvasData.height,
      minLeft: canvasData.left,
      minTop: canvasData.top,
      maxLeft: canvasData.left + canvasData.width,
      maxTop: canvasData.top + canvasData.height,
    });

    //判断当前裁切框是否超出新的canvas面板范围
    cropBoxData.width = Math.min(Math.max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);

    cropBoxData.height = Math.min(
      Math.max(cropBoxData.height, cropBoxData.minHeight),
      cropBoxData.maxHeight,
    );

    cropBoxData.left = Math.min(
      Math.max(cropBoxData.left, cropBoxData.minLeft),
      (cropBoxData.maxLeft - cropBoxData.width),
    );

    cropBoxData.top = Math.min(
      Math.max(cropBoxData.top, cropBoxData.minTop) ,
      (cropBoxData.maxTop - cropBoxData.height),
    );

    cropBoxData.oldLeft = cropBoxData.left;
    cropBoxData.oldTop = cropBoxData.top;

    this.cropBoxData = cropBoxData;

    setStyle(this.cropBox, assign({
      width: cropBoxData.width,
      height: cropBoxData.height,
    }, getTransforms({
      translateX: cropBoxData.left,
      translateY: cropBoxData.top,
    })));
  },
  renderCropBox() {
    const {
      cropBoxData
    } = this;

    if (cropBoxData.width > cropBoxData.maxWidth ||
      cropBoxData.width < cropBoxData.minWidth) {
      if (typeof cropBoxData.oldLeft !== "undefined") {
        cropBoxData.left = cropBoxData.oldLeft;
      }
    }

    if (cropBoxData.height > cropBoxData.maxHeight ||
      cropBoxData.height < cropBoxData.minHeight) {
      if (typeof cropBoxData.oldTop !== "undefined") {
        cropBoxData.top = cropBoxData.oldTop;
      }
    }

    cropBoxData.width = Math.min(Math.max(cropBoxData.width, cropBoxData.minWidth), cropBoxData.maxWidth);

    cropBoxData.height = Math.min(
      Math.max(cropBoxData.height, cropBoxData.minHeight),
      cropBoxData.maxHeight,
    );

    cropBoxData.left = Math.min(
      Math.max(cropBoxData.left, cropBoxData.minLeft),
      cropBoxData.maxLeft,
    );
    
    cropBoxData.top = Math.min(
      Math.max(cropBoxData.top, cropBoxData.minTop),
      cropBoxData.maxTop,
    );
    cropBoxData.oldLeft = cropBoxData.left;
    cropBoxData.oldTop = cropBoxData.top;

    setStyle(this.cropBox, assign({
      width: cropBoxData.width,
      height: cropBoxData.height,
    }, getTransforms({
      translateX: cropBoxData.left,
      translateY: cropBoxData.top,
    })));

    this.output();
  },
  output() {
    this.preview();
  }
}
