import {
  assign,
  getTransforms,
  setStyle,
  isNumber
} from '../utilities';

export default {
  initPreview() {
    const {
      crossOrigin
    } = this;
    const url = crossOrigin ? this.crossOriginUrl : this.url;
    const image = document.createElement('img');
    if (crossOrigin) {
      image.crossOrigin = crossOrigin;
    }
    image.src = url;
    this.viewBox.appendChild(image);
    this.viewBoxImage = image;
  },
  preview() {
    const {
      canvasData,
      cropBoxData,
      imageData
    } = this;

    const width = imageData.naturalWidth * (canvasData.width / canvasData.naturalWidth);
    const height = imageData.naturalHeight * (canvasData.height / canvasData.naturalHeight);

    let left = cropBoxData.left - canvasData.left - (isNumber(imageData.left) ? imageData.left : 0);
    let top = cropBoxData.top - canvasData.top - (isNumber(imageData.top) ? imageData.top : 0);

    setStyle(this.viewBoxImage, assign({
      width,
      height,
    }, getTransforms(assign({
      translateX: -left,
      translateY: -top
    }, imageData))));
  }
};
