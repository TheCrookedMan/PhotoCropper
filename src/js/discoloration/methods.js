import {
  getSourceCanvas,
  removeClass
} from '../utilities';

import {
  NAMESPACE,
  CLASS_HIDDEN
} from './constants';

export default {
    getDiscoloration(options = {}) {
        if (!window.HTMLCanvasElement) {
          return null;
        }
        const {
          canvasData
        } = this;
        const source = getSourceCanvas(this.image, this.imageData, canvasData, options);
        const sourceContext = source.getContext('2d');
        let imgdata = sourceContext.getImageData(0, 0, source.width, source.height);
        let data = imgdata.data;
        /*灰度处理：求r，g，b的均值，并赋回给r，g，b*/
        for (let i = 0, n = data.length; i < n; i += 4) {
            let average = (data[i] + data[i + 1] + data[i + 2]) / 3;
            data[i] = average;
            data[i + 1] = average;
            data[i + 2] = average;
        }
        sourceContext.putImageData(imgdata, 0, 0);
        return source;
    },
    toDataURL(){
        const {
          outPutImageType: imageType,
          outPutImageDefinition: imageDefinition
        } = this.options;
        return this.getDiscoloration().toDataURL(imageType, imageDefinition);
    },
    toBlob(callback) {
      const {
        outPutImageType: imageType,
        outPutImageDefinition: imageDefinition
      } = this.options;
      this.getDiscoloration().toBlob(callback, imageType, imageDefinition);
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
        
        this.discoloration.parentNode.removeChild(this.discoloration);
        removeClass(this.element, CLASS_HIDDEN);
    }
}