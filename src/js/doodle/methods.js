import {
  getSourceCanvas,
  forEach,
  removeClass,
  normalizeDecimalNumber
} from '../utilities';

import {
  S,
  M,
  L,
  XL,
  XXL,
  LG,
  NAMESPACE,
  CLASS_HIDDEN
} from './constants';

export default {
  pencil() {
    this.options.tool = 'pencil';
    this.renderDoodleContext();
  },
  rubber() {
    this.options.tool = 'rubber';
    this.renderDoodleContext();
  },
  pencilColor(color) {
    this.options.toolColor = color;
    this.renderDoodleContext();
  },
  pencilSize(size) {
    this.options.pencilSize = size;
    this.renderDoodleContext();
  },
  /**
   * 
   * @param {} options 
   * fillColor = 'transparent',
     imageSmoothingEnabled = true,
     imageSmoothingQuality = 'low',
     maxWidth = Infinity,
     maxHeight = Infinity,
     minWidth = 0,
     minHeight = 0,
   */
  getDoodleCanvas(options = {}) {
    if (!window.HTMLCanvasElement) {
      return null;
    }
    let {
      canvasData,
      doodleData
    } = this;

    canvasData.top = normalizeDecimalNumber(canvasData.top)

    const source = getSourceCanvas(this.image, this.imageData, canvasData, options);
    const sourceContext = source.getContext('2d');

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = normalizeDecimalNumber(source.width);
    exportCanvas.height = normalizeDecimalNumber(source.height);
    const exportContext = exportCanvas.getContext('2d');
    //图片压缩比
    const ratio = canvasData.naturalWidth / canvasData.width;
    forEach(doodleData, (I, i) => {
      if (I.tool === 'pencil') {
        exportContext.globalCompositeOperation = "source-over";
        exportContext.strokeStyle = I.toolColor;

        switch (I.pencilSize) {
          case 'S':
            exportContext.lineWidth = S * ratio;
            break;
          case 'M':
            exportContext.lineWidth = M * ratio;
            break;
          case 'L':
            exportContext.lineWidth = L * ratio;
            break;
          case 'XL':
            exportContext.lineWidth = XL * ratio;
            break;
          case 'XXL':
            exportContext.lineWidth = XXL * ratio;
            break;
          default:
            break;
        }
      } else if (I.tool === 'rubber') {
        exportContext.globalCompositeOperation = "destination-out";
        exportContext.strokeStyle = '#ffffff';
        exportContext.lineWidth = LG * ratio;
      }
      exportContext.lineJoin = 'round';
      const {
        startX,
        startY,
        endX,
        endY
      } = I.pointer;
      exportContext.beginPath();
      exportContext.moveTo(startX * ratio, startY * ratio);
      exportContext.lineTo(endX * ratio, endY * ratio);
      exportContext.closePath();
      exportContext.stroke();
    })

    sourceContext.drawImage(exportCanvas, 0, 0, source.width, source.height)
    return source;
  },
  toDataURL() {
    const {
      outPutImageType: imageType,
      outPutImageDefinition: imageDefinition
    } = this.options;
    return this.getDoodleCanvas().toDataURL(imageType, imageDefinition);
  },
  toBlob(callback) {
    const {
      outPutImageType: imageType,
      outPutImageDefinition: imageDefinition
    } = this.options;
    this.getDoodleCanvas().toBlob(callback, imageType, imageDefinition);
  },
  destroy() {
      const {
        element
      } = this;

      if (!element[NAMESPACE]) {
        return this;
      }

      element[NAMESPACE] = undefined;
      element.src = this.originalUrl;
      this.doodleData = [];
      //取消绑定事件
      this.unbind();

      this.doodle.parentNode.removeChild(this.doodle);
      removeClass(this.element, CLASS_HIDDEN);
    }
}