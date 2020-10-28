import {
    MIME_TYPE_JPEG,
    IMAGE_DEFINITION,
    CROP_MODEL
} from './constants'

export default {
  //裁切框模式 ：freedom (自由), 按照比例 3:4 、4:3、9:16、16:9、1:1
  cropModel: CROP_MODEL,
  // 初始化图片宽高比
  initialAspectRatio: NaN,
  // 默认图片宽高比
  aspectRatio: NaN,
  //裁切框最小宽度
  cropMinW: 50,
  //裁切框最小高度
  cropMinH: 50,
  //输出文件类型
  outPutImageType: MIME_TYPE_JPEG,
  //输出图片文件清晰度
  outPutImageDefinition: IMAGE_DEFINITION,
  //初始裁切框宽度
  initCropBoxWidth: NaN,
  //初始裁切框高度
  initCropBoxHeight: 100,
  //插件加载完成回调方法
  onReady: null
};