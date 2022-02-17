import {
  setStyle,
  assign,
  getTransforms
} from '../utilities';

import {
  S, M, L, XL, XXL, LG, BORDER_WIDTH
} from './constants';

export default {
  render() {
    this.initContainer();
    //初始化canvas区域
    this.initCanvas();
    //初始化canvas画板
    this.initDoodleCanvas();
  },
  initContainer() {
    const {
      element,
      options,
      container,
      doodle,
    } = this;
    let containerDataPoints = container.getBoundingClientRect()

    const containerData = {
      width: container.offsetWidth,
      height: container.offsetHeight,
      x: containerDataPoints.x,
      y: containerDataPoints.y
    };

    this.containerData = containerData;

    setStyle(doodle, {
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
      width: canvasWidth * this.scale,
      height: canvasHeight  * this.scale,
    };

    canvasData.left = (containerData.width - canvasData.width) / 2;
    canvasData.top = (containerData.height - canvasData.height) / 2;

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
  renderImage() {
    const {
      canvasData,
      imageData
    } = this;
    const width = imageData.naturalWidth * (canvasData.width / canvasData.naturalWidth);
    const height = imageData.naturalHeight * (canvasData.height / canvasData.naturalHeight);

    // document.getElementById('pointerId').textContent = width + '::::' + height

    this.imageData = assign(imageData, {
      width,
      height,
      left: (canvasData.width - width) / 2,
      top: (canvasData.height - height) / 2,
    });

    setStyle(this.image, assign({
      width: imageData.width,
      height: imageData.height,
    }, getTransforms(assign({
      translateX: imageData.left,
      translateY: imageData.top,
    }, imageData))));

  },
  initDoodleCanvas(){
    const {
      canvas,
      canvasData
    } = this;

    let doodleCanvas = document.createElement('canvas');
    doodleCanvas.width = canvasData.width;
    doodleCanvas.height = canvasData.height;

    canvas.appendChild(doodleCanvas);

    let doodleContext = doodleCanvas.getContext('2d');

    this.doodleContext = doodleContext;
    this.doodleCanvas = doodleCanvas;

    this.renderDoodleContext();
  },
  renderDoodleContext(){
    const {
      tool,
      toolColor,
      pencilSize
    } = this.options;
    const {
      doodleContext
    } = this;

    if (tool === 'pencil') {
      doodleContext.globalCompositeOperation = "source-over";
      doodleContext.strokeStyle = toolColor;

      switch (pencilSize) {
        case 'S':
          doodleContext.lineWidth = this.calcPencilSize(S);
          break;
        case 'M':
          doodleContext.lineWidth = this.calcPencilSize(M);
          break;
        case 'L':
          doodleContext.lineWidth = this.calcPencilSize(L);
          break;
        case 'XL':
          doodleContext.lineWidth = this.calcPencilSize(XL);
          break;
        case 'XXL':
          doodleContext.lineWidth = this.calcPencilSize(XXL);
          break;
        default:
          break;
      }
    } else if (tool === 'rubber') {
      doodleContext.globalCompositeOperation = "destination-out";
      doodleContext.strokeStyle = '#fff';
      doodleContext.lineWidth = LG;
    }
    doodleContext.lineJoin = 'round';
  },
  calcPencilSize(num){
    return this.scale > 1 ? num/this.scale : num*this.scale;
  }
}
