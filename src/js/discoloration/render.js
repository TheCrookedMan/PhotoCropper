import {
  setStyle,
  assign,
  getTransforms
} from '../utilities';

export default {
  render() {
    this.initContainer();
    //初始化canvas区域
    this.initCanvas();
  },
  initContainer() {
    const {
      container,
      discoloration,
    } = this;


    const containerData = {
      width: container.offsetWidth,
      height: container.offsetHeight,
    };

    this.containerData = containerData;

    setStyle(discoloration, {
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
  renderImage() {
    const {
      canvasData,
      imageData
    } = this;
    const rotated = Math.abs(imageData.rotate) % 180 === 90;
    let width = imageData.naturalWidth;
    let height = imageData.naturalHeight;
    if(imageData.naturalWidth > canvasData.width){
      if(rotated){
        width = canvasData.height
        height = imageData.naturalWidth * (canvasData.height / imageData.naturalHeight)
      }else {
        width = canvasData.width
        height = imageData.naturalHeight * (canvasData.width / imageData.naturalWidth)
      }
    }

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
  }
}
