import DEFAULTS from './defaults'
import TEMPLATE from './template';
import render from './render';
import preview from './preview';
import events from './events';
import handlers from './handlers';
import change from './change';
import methods from './methods';
import '../../css/cropper.less';

import {
  NAMESPACE,
  REGEXP_DATA_URL_JPEG,
  MIME_TYPE_JPEG,
  REGEXP_TAG_NAME,
  CLASS_HIDE,
  WINDOW,
  CLASS_HIDDEN,
  CLASS_MOVE,
  ACTION_ALL,
  DATA_ACTION
} from './constants'
import {
    isPlainObject,
    dataURLToArrayBuffer,
    isCrossOriginURL,
    addTimestamp,
    assign,
    addClass,
    removeClass,
    setData,
    resetAndGetOrientation,
    parseOrientation,
    arrayBufferToDataURL
} from '../utilities'

class Cropper {
    constructor(element,options = {}){
        if (!element || !REGEXP_TAG_NAME.test(element.tagName)) {
          throw new Error('主元素必须为<img> 或者 <canvas> 元素.');
        }

        this.element = element;
        this.options = assign({}, DEFAULTS, isPlainObject(options) && options);
        this.pointers = {};
        this.sized = false;
        this.sizing = false;
        this.init()
    }

    init(){
        const {
          element
        } = this;
        const tagName = element.tagName.toLowerCase();
        let url;

        if (element[NAMESPACE]) {
          return;
        }

        element[NAMESPACE] = this;

        if (tagName === 'img') {
          this.isImg = true;

          // e.g.: "img/picture.jpg"   如果是img标签，保存图片的源路径
          url = element.getAttribute('src') || '';
          this.originalUrl = url;

          // 图片路径为空白立即终止
          if (!url) {
            return;
          }

          // e.g.: "http://example.com/img/picture.jpg"
          url = element.src;
        } else if (tagName === 'canvas' && window.HTMLCanvasElement) {
          url = element.toDataURL();
        }
        //加载图片
        this.load(url);
    }

    load(url){
        if(!url){
            return;
        }
        
        this.url = url;
        //图片数据
        this.imageData = {};

        const {element,options} = this
        //如果是base64位的数据，则通过ArrayBuffer来读取性能更好
        if (REGEXP_DATA_URL_JPEG.test(url)) {
          this.read(dataURLToArrayBuffer(url));
          return;
        }

        const xhr = new XMLHttpRequest();
        const clone = this.clone.bind(this);

        this.xhr = xhr;

        // 1. Cross origin requests are only supported for protocol schemes:
        // http, https, data, chrome, chrome-extension.
        // 2. Access to XMLHttpRequest from a Data URL will be blocked by CORS policy
        // in some browsers as IE11 and Safari.
        xhr.onabort = clone;
        xhr.onerror = clone;
        xhr.ontimeout = clone;

        xhr.onprogress = () => {
          // if (xhr.getResponseHeader('content-type') !== MIME_TYPE_JPEG) {
          //   xhr.abort();
          // }
        };

        xhr.onload = () => {
          this.read(xhr.response);
        };

        xhr.onloadend = () => {
          this.xhr = null;
        };

        // Bust cache when there is a "crossOrigin" property to avoid browser cache error
        if (options.checkCrossOrigin && isCrossOriginURL(url) && element.crossOrigin) {
          url = addTimestamp(url);
        }

        xhr.open('GET', url);
        xhr.responseType = 'arraybuffer';
        xhr.withCredentials = element.crossOrigin === 'use-credentials';
        xhr.send();
    }

    read(arrayBuffer) {
        const {
          imageData
        } = this;

        // Reset the orientation value to its default value 1
        // as some iOS browsers will render image with its orientation
        const orientation = resetAndGetOrientation(arrayBuffer);
        let rotate = 0;
        let scaleX = 1;
        let scaleY = 1;

        if (orientation > 1) {
          // Generate a new URL which has the default orientation value
          this.url = arrayBufferToDataURL(arrayBuffer, MIME_TYPE_JPEG);
          ({
            rotate,
            scaleX,
            scaleY
          } = parseOrientation(orientation));
        }

        imageData.rotate = rotate;

        imageData.scaleX = scaleX;
        imageData.scaleY = scaleY;

        this.clone();
    }

    clone(){
        const {
          element,
          url
        } = this;
        let crossOrigin;
        let crossOriginUrl;

        if (this.options.checkCrossOrigin && isCrossOriginURL(url)) {
          ({
            crossOrigin
          } = element);

          if (!crossOrigin) {
            crossOrigin = 'anonymous';
          }

          // Bust cache when there is not a "crossOrigin" property (#519)
          crossOriginUrl = addTimestamp(url);
        }

        this.crossOrigin = crossOrigin;
        this.crossOriginUrl = crossOriginUrl;

        const image = document.createElement('img');

        if (crossOrigin) {
          image.crossOrigin = crossOrigin;
        }

        image.src = crossOriginUrl || url;
        this.image = image;
        image.onload = this.start.bind(this);
        image.onerror = this.stop.bind(this);
        addClass(image, CLASS_HIDE);
        element.parentNode.insertBefore(image, element.nextSibling);
    }
    //开始获取图片原始宽高
    start(){
      const image = this.isImg ? this.element : this.image;
      image.onload = null;
      image.onerror = null;
      this.sizing = true;

       const IS_SAFARI = WINDOW.navigator && /^(?:.(?!chrome|android))*safari/i.test(WINDOW.navigator.userAgent);
       const done = (naturalWidth, naturalHeight) => {
         assign(this.imageData, {
           naturalWidth,
           naturalHeight,
           /* 宽高比 */
           aspectRatio: naturalWidth / naturalHeight
         });
         this.sizing = false;
         this.sized = true;
         this.build()
       };
       //当前浏览器image对象支持 naturalWidth 属性，并且当前浏览器不是 safari 
       if (image.naturalWidth && !IS_SAFARI) {
         done(image.naturalWidth, image.naturalHeight);
         return;
       }

       const sizingImage = document.createElement('img');
       const body = document.body || document.documentElement;

       this.sizingImage = sizingImage;

       sizingImage.onload = () => {
         done(sizingImage.width, sizingImage.height);

         if (!IS_SAFARI) {
           body.removeChild(sizingImage);
         }
       };

       sizingImage.src = image.src;

       // 只需要append到DOM节点上， iOS Safari 浏览器会自动转换图片的角度
       if (!IS_SAFARI) {
         sizingImage.style.cssText = (
           'left:0;' +
           'max-height:none!important;' +
           'max-width:none!important;' +
           'min-height:0!important;' +
           'min-width:0!important;' +
           'opacity:0;' +
           'position:absolute;' +
           'top:0;' +
           'z-index:-1;'
         );
         body.appendChild(sizingImage);
       }

    }

    stop() {
      const {
        image
      } = this;

      image.onload = null;
      image.onerror = null;
      image.parentNode.removeChild(image);
      this.image = null;
    }
    
    //构建裁切区域
    build(){
      if (!this.sized) {
        return;
      }

      const { element,options, image } = this;

      //创建裁切区域
      const container = element.parentNode;
      const template = document.createElement('div');

      template.innerHTML = TEMPLATE;

      const cropper = template.querySelector(`.${NAMESPACE}-container`);
      const canvas = cropper.querySelector(`.${NAMESPACE}-canvas`);
      const dragBox = cropper.querySelector(`.${NAMESPACE}-drag-box`);
      const cropBox = cropper.querySelector(`.${NAMESPACE}-crop-box`);
      const face = cropBox.querySelector(`.${NAMESPACE}-face`);

      this.container = container;
      this.cropper = cropper;
      this.canvas = canvas;
      this.dragBox = dragBox;
      this.cropBox = cropBox;
      this.viewBox = cropper.querySelector(`.${NAMESPACE}-view-box`);
      this.face = face;

      canvas.appendChild(image);

      // Hide the original image
      addClass(element, CLASS_HIDDEN);

      // Inserts the cropper after to the current image
      container.insertBefore(cropper, element.nextSibling);
      // Show the image if is hidden
      if (!this.isImg) {
        removeClass(image, CLASS_HIDE);
      }

      addClass(face, CLASS_MOVE);
      setData(face, DATA_ACTION, ACTION_ALL);

      this.initPreview();

      this.render();

      this.bind();
      //插件准备完毕
      if (typeof this.options.onReady === "function") {
        this.options.onReady();
      }
    }
}

assign(Cropper.prototype, render, preview, events, handlers, change, methods);

export default Cropper;