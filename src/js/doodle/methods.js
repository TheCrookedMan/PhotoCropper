import {
  getSourceCanvas,
  forEach,
  removeClass,
  normalizeDecimalNumber,
  setStyle,
  assign,
  getTransforms
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
  zoom(){
    this.options.tool = "zoom"
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
    let {
      canvasData,
      doodleData
    } = this;
    if (!window.HTMLCanvasElement || doodleData.length === 0) {
      return null;
    }
    //重置
    if(this.scale !== 1){
      this.scale = 1;
      //重绘
      this.reDraw()
    }

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
        exportContext.lineWidth = I.pencilSize * ratio;
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
  },
  enlarge(){
    this.options.tool = 'zoom'
    this.scale += this.stepScaleNumber
    this.scale = this.scale > this.maxScale ? this.maxScale:this.scale;
    //重绘
    this.reDraw()
  },
  reduce(){
    this.options.tool = 'zoom'
    this.scale -= this.stepScaleNumber
    this.scale = this.scale < this.minScale ? this.minScale:this.scale;
    //重绘
    this.reDraw()
  },
  reDraw(){
    this.initContainer();
    //初始化canvas区域
    this.initCanvas();

    this.pencilSize(this.options.pencilSize)
  }
}