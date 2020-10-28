import {
  isNumber,
  getAdjustedSizes,
  normalizeDecimalNumber,
  getSourceCanvas,
  forEach,
  removeClass
} from '../utilities';

import {
  NAMESPACE,
  CLASS_HIDDEN
} from './constants';

export default {
  /**
   * Scale the image on the x-axis.
   * @param {number} scaleX - The scale ratio on the x-axis.
   * @returns {Cropper} this
   */
  scaleX() {
    const {
      scaleY,
      scaleX
    } = this.imageData;

    return this.scale(isNumber(scaleX) ? -scaleX : -1, isNumber(scaleY) ? scaleY : 1);
  },

  /**
   * Scale the image on the y-axis.
   * @param {number} scaleY - The scale ratio on the y-axis.
   * @returns {Cropper} this
   */
  scaleY() {
    const {
      scaleY,
      scaleX
    } = this.imageData;

    return this.scale(isNumber(scaleX) ? scaleX : 1, isNumber(scaleY) ? -scaleY : -1);
  },
  /**
   * Scale the image
   * @param {number} scaleX - The scale ratio on the x-axis.
   * @param {number} [scaleY=scaleX] - The scale ratio on the y-axis.
   * @returns {Cropper} this
   */
  scale(scaleX, scaleY = scaleX) {
    const {
      imageData
    } = this;
    let transformed = false;

    scaleX = Number(scaleX);
    scaleY = Number(scaleY);

    if (isNumber(scaleX)) {
      imageData.scaleX = scaleX;
      transformed = true;
    }

    if (isNumber(scaleY)) {
      imageData.scaleY = scaleY;
      transformed = true;
    }

    if (transformed) {
        this.renderCanvas(true, true);
      this.renderCropBox();
    }

    return this;
  },
  //旋转
  rotate(degree) {
    return this.rotateTo((this.imageData.rotate || 0) + Number(degree));
  },
  rotateTo(degree) {
    degree = Number(degree);
    
    if (isNumber(degree)) {
      this.imageData.rotate = degree % 360;
      this.renderCanvas(true,true);
    }

    return this;
  },
  
  /**
   * Get a canvas drawn the cropped image.
   * @param {Object} [options={}] - The config options.
   * @returns {HTMLCanvasElement} - The result canvas.
   */
  getCroppedCanvas(options = {}) {
    if (!window.HTMLCanvasElement) {
      return null;
    }

    const {
      canvasData
    } = this;
    const source = getSourceCanvas(this.image, this.imageData, canvasData, options);

    // Returns the source canvas if it is not cropped.
   

    let {
      x: initialX,
      y: initialY,
      width: initialWidth,
      height: initialHeight,
    } = this.getData();

    const ratio = source.width / Math.floor(canvasData.naturalWidth);

    if (ratio !== 1) {
      initialX *= ratio;
      initialY *= ratio;
      initialWidth *= ratio;
      initialHeight *= ratio;
    }

    const aspectRatio = initialWidth / initialHeight;
    const maxSizes = getAdjustedSizes({
      aspectRatio,
      width: options.maxWidth || Infinity,
      height: options.maxHeight || Infinity,
    });
    const minSizes = getAdjustedSizes({
      aspectRatio,
      width: options.minWidth || 0,
      height: options.minHeight || 0,
    }, 'cover');
    let {
      width,
      height,
    } = getAdjustedSizes({
      aspectRatio,
      width: options.width || (ratio !== 1 ? source.width : initialWidth),
      height: options.height || (ratio !== 1 ? source.height : initialHeight),
    });

    width = Math.min(maxSizes.width, Math.max(minSizes.width, width));
    height = Math.min(maxSizes.height, Math.max(minSizes.height, height));

    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = normalizeDecimalNumber(width);
    canvas.height = normalizeDecimalNumber(height);

    context.fillStyle = options.fillColor || 'transparent';
    context.fillRect(0, 0, width, height);

    const {
      imageSmoothingEnabled = true, imageSmoothingQuality
    } = options;

    context.imageSmoothingEnabled = imageSmoothingEnabled;

    if (imageSmoothingQuality) {
      context.imageSmoothingQuality = imageSmoothingQuality;
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D.drawImage
    const sourceWidth = source.width;
    const sourceHeight = source.height;

    // Source canvas parameters
    let srcX = initialX;
    let srcY = initialY;
    let srcWidth;
    let srcHeight;

    // Destination canvas parameters
    let dstX;
    let dstY;
    let dstWidth;
    let dstHeight;

    if (srcX <= -initialWidth || srcX > sourceWidth) {
      srcX = 0;
      srcWidth = 0;
      dstX = 0;
      dstWidth = 0;
    } else if (srcX <= 0) {
      dstX = -srcX;
      srcX = 0;
      srcWidth = Math.min(sourceWidth, initialWidth + srcX);
      dstWidth = srcWidth;
    } else if (srcX <= sourceWidth) {
      dstX = 0;
      srcWidth = Math.min(initialWidth, sourceWidth - srcX);
      dstWidth = srcWidth;
    }

    if (srcWidth <= 0 || srcY <= -initialHeight || srcY > sourceHeight) {
      srcY = 0;
      srcHeight = 0;
      dstY = 0;
      dstHeight = 0;
    } else if (srcY <= 0) {
      dstY = -srcY;
      srcY = 0;
      srcHeight = Math.min(sourceHeight, initialHeight + srcY);
      dstHeight = srcHeight;
    } else if (srcY <= sourceHeight) {
      dstY = 0;
      srcHeight = Math.min(initialHeight, sourceHeight - srcY);
      dstHeight = srcHeight;
    }

    const params = [
      srcX,
      srcY,
      srcWidth,
      srcHeight,
    ];

    // Avoid "IndexSizeError"
    if (dstWidth > 0 && dstHeight > 0) {
      const scale = width / initialWidth;

      params.push(
        dstX * scale,
        dstY * scale,
        dstWidth * scale,
        dstHeight * scale,
      );
    }
    // All the numerical parameters should be integer for `drawImage`
    // https://github.com/fengyuanchen/cropper/issues/476
    context.drawImage(source, ...params.map(param => Math.floor(normalizeDecimalNumber(param))));
    
    return canvas;
  },

  /**
   * Get the cropped area position and size data (base on the original image)
   * @param {boolean} [rounded=false] - Indicate if round the data values or not.
   * @returns {Object} The result cropped data.
   */
  getData(rounded = false) {
    const {
      imageData,
      canvasData,
      cropBoxData,
    } = this;
    let data;

    data = {
      x: cropBoxData.left - canvasData.left,
      y: cropBoxData.top - canvasData.top,
      width: cropBoxData.width,
      height: cropBoxData.height,
    };

    const ratio = imageData.width / imageData.naturalWidth;

    forEach(data, (n, i) => {
      data[i] = n / ratio;
    });

    data.rotate = imageData.rotate || 0;
    data.scaleX = imageData.scaleX || 1;
    data.scaleY = imageData.scaleY || 1;
    
    return data;
  },
  toDataURL() {
    const {
      outPutImageType:imageType, outPutImageDefinition: imageDefinition
    } = this.options;
    return this.getCroppedCanvas().toDataURL(imageType, imageDefinition);
  },
  toBlob(callback){
    const {
      outPutImageType: imageType,
      outPutImageDefinition: imageDefinition
    } = this.options;
    this.getCroppedCanvas().toBlob(callback, imageType, imageDefinition);
  },
  destroy(){
    const {
      element
    } = this;

    if (!element[NAMESPACE]) {
      return this;
    }

    element[NAMESPACE] = undefined;
    element.src = this.originalUrl;

    //取消绑定事件
    this.unbind();

    this.cropper.parentNode.removeChild(this.cropper);
    removeClass(this.element, CLASS_HIDDEN);
  }
}